(function () {
  'use strict';

  // Module configuration.
  angular.module('frontend.core.auth')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          .state('auth', {
            parent: 'frontend',
            data: {
              access: 1
            },
            views: {
              'content@': {
                template: ''
              }
            }
          });
      }
    ]);
})();
