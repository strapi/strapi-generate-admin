(function () {
  'use strict';

  // Module configuration.
  angular.module('frontend.strapi')
    .config([
      '$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('strapi', {
            parent: 'frontend',
            abstract: true,
            views: {
              'header@': {
                templateUrl: '/frontend/core/layout/partials/header.html',
                controller: 'HeaderController as HeaderCtrl'
              },
              'sidebar@': {
                templateUrl: '/frontend/core/layout/partials/menu.html'
              },
              'content@': {
                template: '<div></div>',
                controller: [
                  '$state',
                  function ($state) {
                    $state.go('strapi.dashboard');
                  }
                ]
              }
            },
            resolve: {
              _config: ['configService', '$q', function (configService, $q) {
                var deferred = $q.defer();

                configService.getApp()
                  .then(function () {
                    deferred.resolve();
                  })
                  .catch(function (err) {
                    deferred.reject(err);
                  });

                return deferred.promise;
              }]
            }
          });
      }
    ]);
})();
