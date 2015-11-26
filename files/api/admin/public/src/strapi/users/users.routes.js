(function () {
  'use strict';

  // Module configuration
  angular.module('frontend.strapi.users')
    .config([
      '$stateProvider',
      function ($stateProvider) {
        var menuGroup = 'users';

        $stateProvider
          .state('strapi.users', {
            url: '/users',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/users/users.html'
              }
            }
          })
          .state('strapi.users.permissions', {
            url: '/permissions',
            data: {
              access: 1,
              menuGroup: menuGroup
            },
            views: {
              'content@': {
                templateUrl: '/frontend/strapi/users/permissions/permissions.html',
                controller: 'UsersPermissionsController as UsersPermissionsCtrl'
              }
            },
            resolve: {
              _routesAndRoles: ['usersPermissionsService', function (usersPermissionsService) {
                return usersPermissionsService.getRoutesAndRoles();
              }]
            }
          });
      }
    ]);
})();
