(function () {
  'use strict';

  // Module configuration.
  angular.module('frontend.strapi.dashboard')
    .config([
      '$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('strapi.dashboard', {
            url: '/',
            data: {
              access: 1
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/dashboard/dashboard.html'
              }
            }
          });
      }
    ]);
})();
