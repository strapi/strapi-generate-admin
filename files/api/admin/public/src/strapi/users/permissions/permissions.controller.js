(function () {
  'use strict';

  angular.module('frontend.strapi.users.permissions')
    .controller('UsersPermissionsController', UsersPermissionsController);

  UsersPermissionsController.$inject = ['usersPermissionsService', '_routesAndRoles'];

  function UsersPermissionsController(usersPermissionsService, _routesAndRoles) {

    var vm = this;
    var routesBackup;
    vm.roles = [];
    vm.collapsedBooleans = {};
    vm.collapse = collapse;
    vm.update = update;
    vm.cancel = cancel;
    vm.getRouteClass = getRouteClass;
    vm.colWidth = 0;
    vm.getRoleModel = getRoleModel;

    _init();

    // Private functions.

    function _init() {
      vm.routes = _routesAndRoles.routes;
      vm.roles = _routesAndRoles.roles;
      routesBackup = angular.copy(vm.routes);
      vm.colWidth = 98 / (vm.roles.length + 3) + '%';

      // Collapse.
      collapse();
    }

    /**
     * Update the routes.
     */

    function update() {
      usersPermissionsService.updateRoutes(vm.routes)
        .then(function (response) {
          vm.routes = usersPermissionsService.formatRoutes(response.data, vm.roles);
          routesBackup = angular.copy(vm.routes);
        });
    }

    /**
     * Helper for verbs class.
     *
     * @param verb
     * @returns {*}
     */

    function getRouteClass(verb) {
      verb = angular.isString(verb) ? verb.toLowerCase() : '';

      var classes = {
        get: 'bg-primary',
        post: 'bg-success',
        put: 'bg-warning',
        patch: 'bg-warning',
        delete: 'bg-danger',
        options: 'bg-default'
      };

      return classes[verb];
    }

    /**
     * Cancel function.
     */

    function cancel() {
      vm.routes = angular.copy(routesBackup);
    }

    /**
     * Return the model of the route.
     *
     * @param route
     * @param index
     * @returns {*}
     */
    function getRoleModel(route, index) {
      return index === 0 ? route.isPublic : route.roles[index].enabled;
    }

    /**
     * Collapse.
     *
     * @param newExpanded
     */

    function collapse(newExpanded) {
      angular.forEach(vm.routes, function (group, name) {
        if (name === newExpanded) {
          vm.collapsedBooleans[name] = !vm.collapsedBooleans[name];
        } else {
          vm.collapsedBooleans[name] = true;
        }
      });
    }
  }
})();
