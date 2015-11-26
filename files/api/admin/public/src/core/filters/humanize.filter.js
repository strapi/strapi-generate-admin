(function () {
  'use strict';

  /**
   * Humanize text (eg. camelized string to separated words).
   */
  angular.module('frontend.core.filters')
    .filter('humanize', humanize);

  humanize.$inject = ['_'];

  function humanize(_) {
    return function (input) {
      if (typeof input !== 'string') {
        return input;
      }

      return _.capitalize(_.trim(underscored(input).replace(/_id$/, '').replace(/_/g, ' ')));

      // Underscore string mixin
      function underscored(str) {
        return _.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      }
    };
  }
})();
