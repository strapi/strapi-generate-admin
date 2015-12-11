(function () {
  'use strict';

  angular.module('frontend.core.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$state', 'authService', 'configService'];

  function LoginController($state, authService, configService) {
    // Already authenticated so redirect back to dashboard.
    if (authService.isAuthenticated() && configService.getConfig().isNewApp !== undefined) {
      return $state.go('strapi.dashboard');
    }

    // Auto redirection if there are no user yet.
    if (configService.getConfig() && configService.getConfig().isNewApp) {
      return $state.go('auth.register');
    }

    var vm = this;
    vm.action = action;
    vm.loading = false;
    vm.fields = getFields();

    _init();

    /**
     * Call authService to make login request
     */
    function action() {
      if (vm.loginForm.$valid) {
        vm.loading = true;
        authService
          .login(vm.credentials)
          .then(function success() {
            $state.go('strapi.dashboard', null, {
              reload: true
            });
            vm.loading = false;
          })
          .catch(function error() {
            vm.credentials.password = '';
            vm.loading = false;
          });
      }
    }

    /**
     * Return the list of fields for the login form.
     *
     * @returns [] fields
     */
    function getFields() {
      return [{
        type: 'input',
        key: 'identifier',
        templateOptions: {
          placeholder: 'Email or username',
          label: '',
          focus: true,
          minlength: 3,
          addonLeft: {
            class: 'fa fa-user'
          }
        }
      }, {
        type: 'input',
        key: 'password',
        templateOptions: {
          type: 'password',
          placeholder: 'Password',
          label: '',
          minlength: 6,
          addonLeft: {
            class: 'fa fa-lock'
          }
        }
      }];
    }

    /**
     * Private helper function to reset credentials and set focus to
     * username input.
     *
     * @private
     */
    function _init() {
      // Initialize credentials
      vm.credentials = {
        identifier: '',
        password: ''
      };
    }
  }

})();
