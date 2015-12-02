(function () {
  'use strict';

  /**
   * Service used to inject `pluralize` library inside a controller, service, directive...
   */
  angular.module('frontend.core.libraries')
    .factory('pluralizeFactory', pluralizeFactory);

  pluralizeFactory.$inject = ['$window'];

  function pluralizeFactory($window) {
    return $window.pluralize;
  }
})();
