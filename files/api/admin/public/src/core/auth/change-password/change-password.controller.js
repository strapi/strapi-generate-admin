(function () {
  'use strict';

  angular.module('frontend.core.auth.changePassword')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$state', '$location', 'authService'];

  function ChangePasswordController($state, $location, authService) {
    // Already authenticated so redirect back to dashboard.
    if (authService.isAuthenticated()) {
      return $state.go('strapi.dashboard');
    }

    var vm = this;
    vm.action = action;
    vm.fields = getFields();

    /**
     * Call authService to make change password request.
     */
    function action() {
      if (vm.changePasswordForm.$valid) {
        var scope = {
          password: vm.form.password,
          passwordConfirmation: vm.form.passwordConfirmation,
          code: $location.$$search.code
        };

        authService
          .changePassword(scope)
          .then(function (err) {
            if (err) {
              vm.form.password = '';
              vm.form.confirmPassword = '';
              return;
            }

            $state.go('strapi.dashboard');
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
        key: 'password',
        templateOptions: {
          type: 'password',
          label: '',
          focus: true,
          placeholder: 'Password (min. 8 charachters)',
          minlength: 6,
          addonLeft: {
            class: 'fa fa-lock'
          }
        }
      }, {
        type: 'input',
        key: 'passwordConfirmation',
        templateOptions: {
          type: 'password',
          label: '',
          placeholder: 'Confirm Password',
          minlength: 6,
          addonLeft: {
            class: 'fa fa-lock'
          }
        }
      }];
    }
  }
})();
