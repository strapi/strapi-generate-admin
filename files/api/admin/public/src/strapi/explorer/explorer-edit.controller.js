(function () {
  'use strict';

  angular.module('frontend.strapi.explorer')
    .controller('ExplorerEditController', ExplorerEditController);

  ExplorerEditController.$inject = ['_entry',
    'explorerService',
    'configService',
    '$stateParams',
    '$state',
    'messageService',
    'confirmationModal',
    '$filter',
    '_',
    'DataModel',
    '$scope',
    'userService',
    'stringService',
    'Config',
    '$http',
    '$localStorage'];

  function ExplorerEditController(_entry,
                                  explorerService,
                                  configService,
                                  $stateParams,
                                  $state,
                                  messageService,
                                  confirmationModal,
                                  $filter,
                                  _,
                                  DataModel,
                                  $scope,
                                  userService,
                                  stringService,
                                  Config,
                                  $http,
                                  $localStorage) {

    // Init variables.
    var vm = this;
    var configModel = vm.configModel = configService.getConfig().models[$stateParams.model];
    var dataModel = new DataModel('admin/explorer/' + $stateParams.model);
    var backupModel = angular.copy(_entry) || {};

    // `vm` variables.
    vm.resetModel = resetModel;
    vm.refreshSuggestions = refreshSuggestions;
    vm.templateChanged = templateChanged;
    vm.onSubmit = onSubmit;
    vm.deleteEntry = deleteEntry;
    vm.changeUserPasswordType = changeUserPasswordType;
    vm.generateRandomPassword = generateRandomPassword;
    vm.toggleUserPasswordDisplayField = toggleUserPasswordDisplayField;

    // `$scope` variables.
    $scope.getDisplayedAttribute = getDisplayedAttribute;

    // Private functions.

    /*
     * Reset the model as it was when the page loaded.
     */
    function resetModel() {
      vm.model = angular.copy(backupModel);
    }

    /**
     * Function used to refresh the list of items suggested in the relations.
     *
     * @param relation
     * @param search
     * @param entries
     * @param reset
     */
    function refreshSuggestions(relation, search, entries, reset) {
      // Cancel the previous request.
      if (relation.dataLoad) {
        relation.dataLoad.cancel();
      }

      // Empty the params object.
      var loadParams = {};

      // Init a new instance of the `DataModel` service.
      var dataModel = new DataModel('admin/explorer/' + (relation.model || relation.collection));

      // Default values of the list of entries.
      entries = entries || [];

      if (relation.previousSearch !== search || reset) {
        relation.suggestions = [];
        relation.skip = 0;
        relation.endLoad = false;
      } else if (relation.endLoad) {
        return;
      } else {
        relation.skip = (relation.skip + 10) || 0;
      }

      relation.limit = relation.limit || 10;
      relation.suggestions = relation.suggestions || [];
      relation.loading = true;
      relation.previousSearch = search;

      loadParams.where = {};
      loadParams.populate = [];
      loadParams.limit = relation.limit;
      loadParams.skip = relation.skip;

      if (search) {
        loadParams.where[relation.displayedAttribute] = {
          contains: search
        };
      }

      if (entries.length) {
        loadParams.where.id = {
          '!': _.map(entries, function (entry) {
            return entry.id;
          })
        };
      }

      relation.dataLoad = dataModel.load(loadParams);

      relation.dataLoad
        .promise
        .success(function (response) {
          if (response.length) {
            angular.forEach(response, function (result) {
              relation.suggestions.push(result);
            });
            if (relation.model) {
              var empty = {};
              empty[$scope.getDisplayedAttribute(relation)] = 'Leave empty';
              empty.id = null;
              relation.suggestions.push(empty);
            }
          } else {
            relation.endLoad = true;
          }

          // Loading is done.
          relation.loading = false;

          if (!relation.suggestions.length && vm.model[relation.key] && !vm.model[relation.key].length) {
            relation.suggestions.push({createLink: true});
          }
        })
        .catch(function () {
          // Reset the list of suggestions.
          relation.suggestions = [];

          // Loading is done.
          relation.loading = false;
        });
    }

    /**
     * Function used when the user selects a specific template. Generate the new
     * list of fields.
     */
    function templateChanged() {
      generateFields(configModel.templates[vm.model.template].attributes);
    }

    function onSubmit() {
      vm.submitting = true;

      // Format the relations of the model.
      var formattedModel = reduceModelRelations(angular.copy(vm.model));
      _.forEach(formattedModel, function (value, key) {
        formattedModel[key] = value || '';
      });

      if (formattedModel.id) {
        // Updating.
        dataModel.update(formattedModel.id, formattedModel)
          .then(function success(response) {
            vm.model = response.data;
            vm.submitting = false;

            // Success message.
            messageService.success('The ' + $stateParams.model + ' has been updated', 'Success');

            // Go to the list view.
            $state.go('strapi.explorer.list', {
              model: configModel.identity
            });

            // Update registered user username.
            if ($state.params.model === 'user' && userService.user().id === response.data.id) {
              $localStorage.credentials.user = response.data;
            }
          })
          .catch(function error() {
            vm.submitting = false;
          });
      } else if ($state.params.model === 'user') {
        // The user is trying to register a new user. So we call a specific route.
        $http.post(Config.backendUrl + '/auth/local/register', formattedModel)
          .then(function success(response) {
            vm.submitting = false;
            backupModel = angular.copy(response.data.user);
            $state.go('strapi.explorer.list', {
              model: configModel.identity
            });
            messageService.success('The entry has been created', 'Success');
          })
          .catch(function error() {
            vm.submitting = false;
          });
      } else {
        dataModel.create(formattedModel)
          .then(function success(response) {
            vm.submitting = false;
            backupModel = angular.copy(response && response.data);
            $state.go('strapi.explorer.list', {
              model: configModel.identity
            });
            messageService.success('The entry has been created', 'Success');
          })
          .catch(function error() {
            vm.submitting = false;
          });
      }
    }

    /**
     * Delete the current entry.
     */
    function deleteEntry() {
      confirmationModal.open()
        .then(function () {
          dataModel.delete(vm.model.id)
            .then(function success() {
              // Succes message.
              messageService.success('The ' + $stateParams.model + ' has been deleted', 'Success');

              // Go to the list view.
              $state.go('strapi.explorer.list', {
                model: configModel.identity
              });
            })
            .catch(function error() {
            });
        });
    }

    /**
     * Return the `displayedAttribute` of the current model.
     *
     * @param relation
     * @param template
     * @returns {*|templates|{toast, progressbar}|string}
     */
    function getDisplayedAttribute(relation, template) {
      var model = configService.getConfig().models[relation.model || relation.collection];
      return model && model.templates && model.templates[template] && model.templates[template].displayedAttribute || model.displayedAttribute;
    }

    /**
     *  Change the type of the password input.
     *  Switch between text and password.
     */
    function changeUserPasswordType() {
      if (vm.userPasswordInput && vm.userPasswordInput.type === 'password') {
        vm.userPasswordInput = {
          type: 'text',
          action: 'Hide'
        };
      } else {
        vm.userPasswordInput = {
          type: 'password',
          action: 'Display'
        };
      }
    }

    /**
     * Generate a random passord and assign
     * in to the password field of the current model.
     */
    function generateRandomPassword() {
      vm.model.password = stringService.random(10);
      vm.userPasswordInput = {
        type: 'text',
        action: 'Hide'
      };
    }

    /**
     * Display, or not, the user password field.
     */
    function toggleUserPasswordDisplayField() {
      if (vm.displayUserPasswordField) {
        vm.displayUserPasswordField = false;
        if ($state.params.model === 'user') {
          delete vm.model.password;
        }
      } else {
        delete vm.model.password;
        vm.displayUserPasswordField = true;
      }
    }

    /**
     * Helper
     *
     * @param attributesForFields
     */
    function generateFields(attributesForFields) {
      vm.fields = explorerService.generateFormFields(attributesForFields);
      vm.createdUpdatedFields = explorerService.generateCreatedUpdatedField(vm.model);
    }

    /**
     * Helper
     *
     * @param model
     * @returns {*}
     */
    function reduceModelRelations(model) {
      angular.forEach(vm.relations, function (relation) {
        if (relation.collection) {
          angular.forEach(model[relation.key], function (value, i) {
            model[relation.key][i] = value.id;
          });
        } else if (relation.model) {
          model[relation.key] = model[relation.key] && model[relation.key].id;
        }
      });
      return model;
    }

    _init();

    /**
     * Function called at the first page load.
     * @private
     */

    function _init() {
      vm.submitting = false;

      var defaultEntry = {
        createdBy: userService.user(),
        createdAt: new Date(),
        contributors: [userService.user()]
      };

      // Format the model.
      vm.model = _entry || defaultEntry;

      // Change the behavior according to the presence of
      // templates in the current model.
      if (configModel.templates) {
        vm.model.template = vm.model.template || _.keys(configModel.templates)[0];
        generateFields(configModel.templates[vm.model.template].attributes);
      } else {
        generateFields(configModel.attributes);
      }

      // Display user password.
      if ($state.params.model === 'user') {
        vm.userPasswordInput = {
          type: 'password',
          action: 'Display'
        };
        if (!vm.model.id) {
          vm.displayUserPasswordField = true;
        }
      }

      // List of the relations
      vm.relations = _.map(_.filter(configModel.attributes, function (relation, key) {
        relation.key = key;
        if (relation.collection) {
          vm.model[key] = vm.model[key] || [];
        }

        // To improve creation page.
        if (relation.key !== 'updatedBy' || vm.model.id) {
          return relation.model || relation.collection;
        }
      }), function (relation) {
        relation.name = relation.model || relation.collection;
        relation.formattedName = relation.model ? relation.name : $filter('pluralize')(relation.name);
        relation.displayedAttribute = configService.getConfig().models[relation.name].displayedAttribute || 'id';
        vm.refreshSuggestions(relation);
        return relation;
      });

      // Infinite scroll config for relations lists.
      vm.infiniteScroll = {};
      vm.infiniteScroll.numToAdd = 20;
      vm.infiniteScroll.currentItems = 20;

      // Lang attribute.
      if (configModel.attributes.lang) {
        vm.model.lang = vm.model.lang || configService.getConfig().settings.i18n.defaultLocale;
      }
    }
  }
})();
