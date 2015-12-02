(function () {
  'use strict';

  // Module config.
  angular.module('frontend.core.auth.login')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('auth.login', {
            url: '/login',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/core/auth/login/login.html',
                controller: 'LoginController as LoginCtrl'
              }
            }
          });
      }
    ]);
})();
