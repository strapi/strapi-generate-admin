(function () {
  'use strict';

  /**
   * Capitalize filter using `lodash` function.
   */
  angular.module('frontend.core.filters')
    .filter('capitalize', capitalize);

  capitalize.$inject = ['_'];

  function capitalize(_) {
    return function (input) {
      if (typeof input !== 'string') {
        return input;
      }
      return _.capitalize(input);
    };
  }
})();
