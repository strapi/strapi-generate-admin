(function () {
  'use strict';

  /**
   * Service used when the app is loaded.
   */
  angular.module('frontend.core.services')
    .factory('initService', initService);

  initService.$inject = ['$q'];

  function initService($q) {
    var service = {};
    var deferred = $q.defer();

    service.deferred = deferred;
    service.promise = deferred.promise;

    return service;
  }
})();
