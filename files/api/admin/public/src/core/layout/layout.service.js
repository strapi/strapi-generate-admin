(function () {
  'use strict';

  /*
   * Generic service to return all available menu items for main level navigation.
   */
  angular.module('frontend.core.layout')
    .factory('layoutService', layoutService);

  layoutService.$inject = [];

  function layoutService() {

    var service = {};

    service.collapsedBooleans = {
      dashboard: true,
      explorer: true,
      users: true
    };

    service.expand = expand;

    return service;

    // Private functions.

    /**
     * Expand links in the menu.
     *
     * @param newExpanded
     */

    function expand(newExpanded, disableAutoCollapse) {
      angular.forEach(service.collapsedBooleans, function (value, key) {
        if (key === newExpanded && disableAutoCollapse) {
          service.collapsedBooleans[key] = false;
        } else if (key === newExpanded) {
          service.collapsedBooleans[key] = !service.collapsedBooleans[key];
        } else {
          service.collapsedBooleans[key] = true;
        }
      });
    }
  }
})();
