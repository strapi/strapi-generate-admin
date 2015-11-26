(function () {
  'use strict';

  // Module config.
  angular.module('frontend.core.auth.register')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('auth.register', {
            url: '/register',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/core/auth/register/register.html',
                controller: 'RegisterController as RegisterCtrl'
              }
            }
          })
          .state('auth.register.confirmation', {
            url: '/register/confirmation',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/core/auth/register/confirm.html'
              }
            }
          });
      }
    ]);
})();
