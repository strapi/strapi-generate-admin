(function () {
  'use strict';

  // Module config.
  angular.module('frontend.core.auth.changePassword')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('auth.forgotPassword.change', {
            url: '/change-password',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/core/auth/change-password/change-password.html',
                controller: 'ChangePasswordController as ChangePasswordCtrl'
              }
            }
          });
      }
    ]);
})();
