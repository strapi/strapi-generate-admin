(function () {
  'use strict';

  /**
   * Service used to inject `lodash` library inside a controller, service, directive...
   */
  angular.module('frontend.core.libraries')
    .factory('_', lodashFactory);

  lodashFactory.$inject = ['$window'];

  function lodashFactory($window) {
    var service = $window._;

    return service;
  }
})();
