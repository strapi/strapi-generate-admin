(function () {
  'use strict';

  // Init module.
  angular.module('frontend.core.services')
    .factory('usersPermissionsService', usersPermissionsService);

  usersPermissionsService.$inject = ['Config', '$http', '_', '$q', 'messageService'];

  function usersPermissionsService(Config, $http, _, $q, messageService) {

    var service = {
      getRoutesAndRoles: getRoutesAndRoles,
      formatRoutes: formatRoutes,
      updateRoutes: updateRoutes
    };

    return service;

    // Private functions.

    /**
     * Get the list of roles and routes (grouped).
     *
     * @returns {{routes: [], roles: []}
     */

    function getRoutesAndRoles() {
      var deferred = $q.defer();

      var promises = [];

      // Http call to get routes.
      promises.push($http.get(Config.backendUrl + '/admin/routes'));

      promises.push(getRoles());

      $q.all(promises)
        .then(function (responses) {
          var routesGroups = responses[0].data;
          var roles = responses[1];

          // Format routes.
          formatRoutes(routesGroups, roles);

          // Finally resolve the promise.
          deferred.resolve({
            routes: routesGroups,
            roles: roles
          });
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * Get the list of roles.
     *
     * @returns {*}
     */

    function getRoles() {
      var deferred = $q.defer();

      // Http call to get roles.
      $http({
        method: 'get',
        url: Config.backendUrl + '/admin/explorer/role',
        params: {
          populate: {}
        }
      })
        .success(function (roles) {
          // Order properly the list of roles.
          var adminRole = _.find(roles, {
            name: 'admin'
          });

          // If the `admin` role is found, it is moved at the
          // end of the list of roles.
          if (adminRole) {
            var index = _.indexOf(roles, adminRole);
            roles.splice(index, 1);
            roles.push(adminRole);
          }
          console.log('roles', roles);

          deferred.resolve(roles);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * Update a list of routes
     *
     * @param routesGroups
     * @returns {*} Promise
     */

    function updateRoutes(routesGroups) {
      // Clone the object in order to disturb the display during the update.
      routesGroups = angular.copy(routesGroups);

      // Format the list of routes.
      var routes = [];
      angular.forEach(routesGroups, function (routesGroup) {
        angular.forEach(routesGroup, function (route) {
          var enabledRoutes = _.where(route.roles, {
            enabled: true
          });
          route.roles = enabledRoutes;
          routes.push(route);
        });
      });

      // Finally call the API.
      return $http({
        method: 'put',
        url: Config.backendUrl + '/admin/routes',
        data: routes
      })
        .success(function () {
          messageService.success('Permissions updated', 'Success');
        });
    }

    /**
     * Helper which format routes according to there roles.
     *
     * @param routesGroups
     * @param roles
     *
     * @returns {*}
     */

    function formatRoutes(routesGroups, roles) {
      var roleFound;
      var tmpRoles;

      angular.forEach(routesGroups, function (routesGroup) {
        angular.forEach(routesGroup, function (route) {
          // Format the list of roles of the current route.
          route.roles = route.roles || [];

          // Temporary list of roles used in the loop.
          tmpRoles = [];
          angular.forEach(roles, function (role, index) {
            // This is the list of roles currently enabled for this route.
            roleFound = _.find(route.roles, {name: role.name});

            // Clone the role object.
            role = angular.copy(role);

            // Set the attribute enabled to `true` if the current `role` is
            // found list of `roles` of the current `routes`.
            if (roleFound) {
              role.enabled = true;
              route.roles[index] = role;
            } else if (role.name && role.name.toLowerCase() === 'admin') {
              // Admin role is always enabled.
              role.enabled = true;
            } else {
              role.enabled = false;
            }
            tmpRoles[index] = role;
          });
          // Set the temporary roles as the `roles` attribute of the object.
          route.roles = angular.copy(tmpRoles);
        });
      });

      return routesGroups;
    }
  }
})();
