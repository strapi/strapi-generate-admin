(function () {
  'use strict';

  angular.module('frontend.core.auth.forgotPassword')
    .controller('ForgotPasswordController', ForgotPasswordController);

  ForgotPasswordController.$inject = ['$state', 'authService'];

  function ForgotPasswordController($state, authService) {
    // Already authenticated so redirect back to dashboard.
    if (authService.isAuthenticated()) {
      return $state.go('strapi.dashboard');
    }

    var vm = this;
    vm.action = action;
    vm.fields = getFields();

    /**
     * Call authService to make forgot password request
     */
    function action() {
      if (vm.forgotPasswordForm.$valid) {
        authService
          .forgotPassword(vm.form.email)
          .then(function (err) {
            if (err) {
              return;
            }

            $state.go('auth.login');
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
        key: 'email',
        templateOptions: {
          type: 'email',
          focus: true,
          placeholder: 'Your e-mail',
          label: '',
          minlength: 6,
          addonLeft: {
            class: 'fa fa-envelope'
          }
        }
      }];
    }
  }
})();
