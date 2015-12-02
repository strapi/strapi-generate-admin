(function () {
  'use strict';

  angular.module('frontend.core.auth.forgotPassword')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('auth.forgotPassword', {
            url: '/forgot-password',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/core/auth/forgot-password/forgot-password.html',
                controller: 'ForgotPasswordController as ForgotPasswordCtrl'
              }
            }
          });
      }
    ]);
})();
