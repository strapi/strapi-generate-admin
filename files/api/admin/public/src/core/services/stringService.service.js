(function () {
  'use strict';

  /**
   * String service.
   */
  angular.module('frontend.core.services')
    .factory('stringService', stringService);

  stringService.$inject = [];

  function stringService() {
    var service = {};

    service.random = random;

    return service;

    // Private functions.

    function random(length, chars) {
      var result = '';
      chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      length = length || 10;
      for (var i = length.length - 1; i >= 0; i--) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
      }
      return result;
    }
  }
})();
