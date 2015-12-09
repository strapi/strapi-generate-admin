(function () {
  'use strict';

  /**
   * This is the controller of the list view of the Data Explorer. Most of the queries are
   * based on the Waterline query language. For more information, please refer to the Waterline documentation.
   */
  angular.module('frontend.strapi.explorer')
    .controller('ExplorerListController', ExplorerListController);

  ExplorerListController.$inject = ['$stateParams',
    'configService',
    '$localStorage',
    'confirmationModal',
    'messageService',
    '_',
    '$filter',
    '$location',
    'DataModel',
    '$q',
    '$http',
    'Config',
    '$scope',
    'userService'];

  function ExplorerListController($stateParams,
                                  configService,
                                  $localStorage,
                                  confirmationModal,
                                  messageService,
                                  _,
                                  $filter,
                                  $location,
                                  DataModel,
                                  $q,
                                  $http,
                                  Config,
                                  $scope,
                                  userService) {

    // Init variables.
    var vm = this;
    var loadParams = {};
    var dataModel;

    var paginationPageSizeDefault = 15;
    var pageRequest;
    var countRequest;

    // Check URL Params.
    var initParams = {
      skip: isNaN($location.search().skip) ? 0 : Number($location.search().skip),
      limit: isNaN($location.search().limit) ? paginationPageSizeDefault : Number($location.search().limit),
      sort: $location.search().sort && $location.search().sort.split(' ') && $location.search().sort.split(' ')[1],
      sortColumn: $location.search().sort && $location.search().sort.split(' ') && $location.search().sort.split(' ')[0]
    };
    initParams.page = initParams.skip === 0 ? 1 : initParams.limit / initParams.skip + 1;

    // Grid settings.
    var paginationOptions = {
      pageNumber: initParams.page,
      pageSize: initParams.limit,
      sort: initParams.sort || 'desc',
      sortColumn: initParams.sortColumn || 'createdAt'
    };

    _init();

    // Private functions.

    /**
     * Function called when the value of the search input changed
     */
    function searchChanged() {
      if (vm.search) {
        loadParams.where = loadParams.where || {};
        loadParams.where.or = [];
        loadParams.where.or.push({
          id: vm.search
        });

        angular.forEach(vm.displayedAttributes, function (attribute) {
          var displayedAttributeParam = {};
          displayedAttributeParam[attribute] = {
            contains: vm.search
          };
          loadParams.where.or.push(displayedAttributeParam);
        });
      } else if (_.keys(loadParams.where).length > 1) {
        delete loadParams.where.or;
      } else if (loadParams.where) {
        delete loadParams.where;
      }

      getPage();
    }

    /**
     * Function called when the `Empty filters` button is clicked.
     */
    function emptyFilters() {
      // Empty the search query.
      vm.search = '';
      delete loadParams.where;

      // Reload the list of items.
      getPage();
    }

    /**
     * Sort changed (ui-grid).
     */
    function sortChanged() {
      if (paginationOptions.sortColumn && paginationOptions.sort) {
        // Invert the sort order.
        var order = paginationOptions.sort === 'desc' ? ' desc' : ' asc';
        loadParams.sort = paginationOptions.sortColumn + order;
      } else {
        // Remove the sort param.
        loadParams.sort = null;
      }

      // Reload the list of items.
      getPage();
    }

    /**
     * Pagination changed (ui-grid).
     */
    function paginationChanged() {
      // Set the number of entries to skip.
      loadParams.skip = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

      // Reload the list of items.
      getPage();
    }

    /**
     * Main function used to get the list of items.
     */
    function getPage() {

      // Start loading.
      vm.loading = true;

      // Set the limit.
      loadParams.limit = paginationOptions.pageSize;

      // Cancel the previous request.
      if (pageRequest && pageRequest.cancel) {
        pageRequest.cancel();
      }

      // Empty search params.
      angular.forEach($location.search(), function (value, key) {
        $location.search(key, undefined);
      });

      // Set search params.
      angular.forEach(loadParams, function (value, key) {
        $location.search(key, angular.isObject(value) ? angular.toJson(value) : value);
      });
      $location.search('search', vm.search);

      // Init the request.
      pageRequest = dataModel.load(loadParams);
      countRequest = dataModel.count(loadParams);

      $q.all({
        items: pageRequest.promise,
        count: countRequest
      })
        .then(function (results) {
          // Pass the results to the grid options in
          // order to display them.
          vm.gridOptions.data = results.items.data;
          vm.gridOptions.totalItems = results.count.data;

          // Not loading anymore.
          vm.loading = false;

          // First load is done.
          vm.firstLoad = false;
        })
        .catch(function () {
          // Not loading anymore.
          vm.loading = false;
        });
    }

    /**
     * Helper for ui-grid resizing.
     *
     * @returns {{height: string}}
     */
    vm.getTableStyle = function () {
      var rowHeight = 30;
      var headerHeight = 45;
      var height = (paginationOptions.pageSize * rowHeight + headerHeight) + (vm.gridOptions.enableFiltering ? 50 : 20);

      // Should be moved in a directive.
      document.querySelector('.ui-grid-viewport').style.height = height + 'px';

      return {
        height: height + 'px'
      };
    };

    /**
     * Delete an entry.
     *
     * @param {String} id
     */
    function deleteEntry(id) {
      // Open the confirmation modal in order to prevent
      // accidental clicks.
      confirmationModal.open()
        .then(function () {
          dataModel.delete(id)
            .then(function success() {
              // Success message.
              messageService.success('The entry has been deleted', 'Success');

              // Delete the item for the current list.
              var index = _.findIndex(vm.gridOptions.data, {id: id});
              vm.gridOptions.data.splice(index, 1);

              // Reload the list of items.
              getPage();
            });
        });
    }

    /**
     * Prevent user auto-deletion.
     *
     * @param entryId
     * @returns {boolean}
     */
    function hideDeleteButton(entryId) {
      var isUserModel = vm.configModel.identity === 'user';
      var currentUserId = userService.user().id;
      return isUserModel && entryId === currentUserId;
    }

    /**
     * First function launched.
     *
     * @private
     */
    function _init() {
      // `vm` variables.
      vm.loading = true;
      vm.firstLoad = true;
      vm.configModel = configService.getConfig().models[$stateParams.model];
      vm.getPage = getPage;
      vm.emptyFilters = emptyFilters;
      vm.searchChanged = searchChanged;
      vm.displayedAttributes = [];

      // Here we have to use the `$scope` because of the `angular-ui-grid` module.
      $scope.deleteEntry = deleteEntry;
      $scope.hideDeleteButton = hideDeleteButton;

      // Init a new instance of the `DataModel` service.
      dataModel = new DataModel('admin/explorer/' + vm.configModel.identity);

      // Add the `count` function to the `DataModel` service instance.
      dataModel.count = function (loadParams) {
        return $http.get(Config.backendUrl + '/admin/explorer/' + vm.configModel.identity + '/count', loadParams);
      };

      // Format `loadParams` according to the URL params.
      loadParams = {};
      angular.forEach($location.search(), function (param, key) {
        try {
          param = JSON.parse(param);
        } catch (err) {
        }

        if (param) {
          loadParams[key] = isNaN(param) ? param : Number(param);
        }
      });
      loadParams.sort = paginationOptions.sortColumn + ' ' + paginationOptions.sort;
      loadParams.where = loadParams.where ? loadParams.where : $stateParams.where;
      vm.search = loadParams.search;
      delete loadParams.search;

      // Use the `displayedAttribute` of the model.
      if (configService.getConfig().models[$stateParams.model].displayedAttribute) {
        vm.displayedAttributes.push(configService.getConfig().models[$stateParams.model].displayedAttribute);
      }

      angular.forEach(configService.getConfig().models[$stateParams.model].templates, function (template) {
        if (template.displayedAttribute && vm.displayedAttributes.indexOf(template.displayedAttribute) === -1) {
          vm.displayedAttributes.push(template.displayedAttribute);
        }
      });

      // `angular-ui-grid` module options.
      vm.gridOptions = {
        enableColumnResizing: true,
        rowTemplate: '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
        '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
        '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
        '</div>',
        data: [],
        paginationPageSizes: [paginationPageSizeDefault, 50, 100],
        paginationPageSize: initParams.limit,
        enableGridMenu: true,
        enableFiltering: false,
        onRegisterApi: function (gridApi) {
          vm.gridApi = gridApi;
          getPage(vm.gridApi.grid, [vm.gridOptions.columnDefs[1]]);
          vm.gridApi.core.on.sortChanged(null, function (grid, sortColumns) {
            if (sortColumns.length === 0) {
              paginationOptions.sort = null;
              paginationOptions.sortColumn = null;
            } else {
              paginationOptions.sort = sortColumns[0].sort.direction;
              paginationOptions.sortColumn = sortColumns[0].field;
            }
            vm.gridOptions.paginationCurrentPage = 1;
            paginationOptions.pageNumber = 1;
            sortChanged();
          });
          vm.gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            paginationChanged();
          });
          vm.gridApi.colMovable.on.columnPositionChanged(null, function (colDef, originalPosition, newPosition) {
            function generateColumOrder() {
              // Remove fron original position
              vm.gridOptions.columnDefs.splice(originalPosition, 1);
              // Add to new position
              vm.gridOptions.columnDefs.splice(newPosition, 0, colDef);
            }

            generateColumOrder();
            $localStorage.explorer[configService.getConfig().appName][vm.configModel.identity].columnDefs = vm.gridOptions.columnDefs;
          });
        },
        useExternalPagination: true,
        useExternalSorting: true,
        paginationCurrentPage: initParams.page
      };

      vm.gridOptions.totalItems = 100;

      // Check local storage params to display appropriated attributes.
      function checkLocalStorage() {
        $localStorage.explorer = angular.isObject($localStorage.explorer) ? $localStorage.explorer : {};
        $localStorage.explorer[configService.getConfig().appName] = angular.isObject($localStorage.explorer[configService.getConfig().appName]) ? $localStorage.explorer[configService.getConfig().appName] : {};
        $localStorage.explorer[configService.getConfig().appName][vm.configModel.identity] = angular.isObject($localStorage.explorer[configService.getConfig().appName][vm.configModel.identity]) ? $localStorage.explorer[configService.getConfig().appName][vm.configModel.identity] : {};
      }

      checkLocalStorage();

      /**
       * Generate the columns for the `angular-ui-grid` module.
       *
       * @returns {Array}
       */
      function generateColumnDefs() {
        var columns = [];
        _.forEach(vm.configModel.attributes, function (value, key) {
          var column = {
            name: key,
            visible: false
          };
          if (key === 'id') {
            column.visible = true;
            column.cellTemplate = '<div class="ui-grid-cell-contents"><a data-ui-sref="strapi.explorer.list.edit({model: \'' + vm.configModel.identity + '\',entryId:COL_FIELD})">{{COL_FIELD CUSTOM_FILTERS}}</a></div>';
          }
          if (vm.displayedAttributes.indexOf(key) !== -1) {
            column.visible = true;
            column.cellTemplate = '<div class="ui-grid-cell-contents"><a data-ui-sref="strapi.explorer.list.edit({model: \'' + vm.configModel.identity + '\',entryId:row.entity.id})">{{COL_FIELD CUSTOM_FILTERS}}</a></div>';
          }
          if (value.type === 'date' || value.type === 'datetime') {
            column.cellTemplate = '<div class="ui-grid-cell-contents"><span>{{COL_FIELD | date}}</a></div>';
          }
          if (value.model) {
            column.visible = true;
            column.enableSorting = false;
            column.cellTemplate = '<div class="ui-grid-cell-contents"><a data-ui-sref="strapi.explorer.list.edit({model: \'' + value.model + '\',entryId:COL_FIELD.id})">{{COL_FIELD[\'' + configService.getConfig().models[value.model].displayedAttribute + '\' || \'id\'] CUSTOM_FILTERS}}</a></div>';
          }
          if (value.collection) {
            column.visible = true;
            column.enableSorting = false;
            column.cellTemplate = '<div class="ui-grid-cell-contents"><a class="cursor-pointer" data-go-to-collection ng-click="goToCollection(COL_FIELD, \'' + vm.configModel.identity + '\', \'' + value.collection + '\')">See ' + $filter('pluralize')(value.collection) + ' ({{COL_FIELD.length}})</a></div>';
          }
          if (key === 'createdAt') {
            column.visible = true;
          }
          if (key === paginationOptions.sortColumn) {
            column.sort = {
              direction: paginationOptions.sort === 'asc' ? 'asc' : 'desc'
            };
          }
          columns.push(column);
        });

        var defaultColumns = {
          id: {
            newPosition: 0
          }
        };

        angular.forEach(defaultColumns, function () {
          angular.forEach(columns, function (column, i) {
            if (defaultColumns[column.name]) {
              defaultColumns[column.name].originalPosition = i;
            }
          });
        });

        angular.forEach(defaultColumns, function (value) {
          if (value.originalPosition) {
            var columnCopy = angular.copy(columns[value.originalPosition]);
            columns.splice(value.originalPosition, 1);
            columns.splice(value.newPosition, 0, columnCopy);
          }
        });

        columns.push({
          cellTemplate: '<div class="ui-grid-cell-contents text-center">' +
          '<button class="explorer-action-btn btn btn-success btn-sm" data-ui-sref="strapi.explorer.list.edit({model:\'' + vm.configModel.identity + '\', entryId: row.entity.id})">Edit</button>' +
          '<button ng-hide="grid.appScope.hideDeleteButton(row.entity.id)" class="explorer-action-btn btn btn-warning btn-sm" data-ng-click="grid.appScope.deleteEntry(row.entity.id, row)">Delete</button>' +
          '</div>',
          enableSorting: false,
          field: 'Actions'
        });

        return columns;
      }

      // Get columns from the local storage or generate them.
      if ($localStorage.explorer[configService.getConfig().appName][vm.configModel.identity].columnDefs) {
        vm.gridOptions.columnDefs = $localStorage.explorer[configService.getConfig().appName][vm.configModel.identity].columnDefs;
      } else {
        vm.gridOptions.columnDefs = generateColumnDefs();
      }
    }
  }
})();
