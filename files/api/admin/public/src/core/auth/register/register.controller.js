(function () {
  'use strict';

  angular.module('frontend.core.auth.register')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$state', 'authService', 'configService'];

  function RegisterController($state, authService, configService) {
    // Already authenticated so redirect back to the dashboard page.
    if (authService.isAuthenticated()) {
      $state.go('strapi.dashboard');
    }

    // Disable registration if there more than 0 user existing.
    if (configService.getConfig() && !configService.getConfig().isNewApp) {
      $state.go('auth.login');
    }

    var vm = this;

    // Init the loading variable
    vm.loading = false;

    // Scope user and set password to empty string
    vm.user = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    };

    /**
     * Call authService to make register request
     *
     * @scope
     */
    vm.action = function () {
      if (vm.registrationForm.$valid) {
        vm.loading = true;

        authService
          .register(vm.user)
          .then(function () {
            // Go to the dashboard page.
            $state.go('strapi.dashboard');
            vm.loading = false;

            // Reload the app config.
            configService.getApp();
          })
          .catch(function () {
            vm.loading = false;
          });
      }
    };

    /**
     * Helper for submit button.
     *
     * @returns {boolean}
     */
    vm.matchPassword = function () {
      return vm.user.password === vm.user.passwordConfirmation;
    };

    // Form fields
    vm.fields = [{
      type: 'input',
      key: 'username',
      templateOptions: {
        placeholder: 'Username',
        label: '',
        minlength: 3,
        focus: true,
        required: true,
        addonLeft: {
          class: 'fa fa-user'
        }
      }
    }, {
      type: 'input',
      key: 'email',
      templateOptions: {
        type: 'email',
        placeholder: 'E-mail',
        label: '',
        minlength: 6,
        required: true,
        addonLeft: {
          class: 'fa fa-envelope'
        }
      }
    }, {
      type: 'input',
      key: 'password',
      templateOptions: {
        type: 'password',
        label: '',
        placeholder: 'Password',
        minlength: 6,
        required: true,
        addonLeft: {
          class: 'fa fa-lock'
        }
      }
    }, {
      type: 'input',
      key: 'passwordConfirmation',
      extras: {
        validateOnModelChange: true
      },
      templateOptions: {
        type: 'password',
        label: '',
        placeholder: 'Confirm Password',
        minlength: 6,
        required: true,
        addonLeft: {
          class: 'fa fa-lock'
        }
      },
      validators: {
        confirmation: {
          expression: function (viewValue, modelValue) {
            var value = modelValue || viewValue;
            return !vm.user.password || vm.user.password === value;
          },
          message: '"Password  does not match with the password field"'
        }
      }
    }];
  }
})();
