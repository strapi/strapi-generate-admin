(function () {
  'use strict';

  // Module configuration
  angular.module('frontend.strapi.explorer')
    .config([
      '$stateProvider',
      function ($stateProvider) {
        var menuGroup = 'explorer';

        $stateProvider
          .state('strapi.explorer', {
            abstract: true
          })
          .state('strapi.explorer.home', {
            url: '/strapi/explorer',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/explorer/explorer.html'
              }
            }
          })
          // List data view.
          .state('strapi.explorer.list', {
            url: '/strapi/explorer/:model',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/explorer/explorer-list.html',
                controller: 'ExplorerListController as ExplorerListCtrl'
              }
            },
            params: {
              where: undefined
            }
          })
          // Create data view.
          .state('strapi.explorer.list.create', {
            url: '/create',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/explorer/explorer-edit.html',
                controller: 'ExplorerEditController as ExplorerEditCtrl',
                resolve: {
                  _entry: function () {
                    return undefined;
                  }
                }
              }
            }
          })
          // Edit data view.
          .state('strapi.explorer.list.edit', {
            url: '/:entryId',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/explorer/explorer-edit.html',
                controller: 'ExplorerEditController as ExplorerEditCtrl',
                resolve: {
                  _entry: ['$stateParams', 'DataModel', function ($stateParams, DataModel) {
                    var model = new DataModel('admin/explorer/' + $stateParams.model);

                    return model.fetch($stateParams.entryId);
                  }]
                }
              }
            }
          });
      }
    ]);
})();
