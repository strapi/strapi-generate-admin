(function () {
  'use strict';

  /**
   * Capitalize filter using `plural` function from `pluralize` library.
   */
  angular.module('frontend.core.filters')
    .filter('pluralize', pluralize);

  pluralize.$inject = ['_', 'pluralizeFactory'];

  function pluralize(_, pluralizeFactory) {
    return function (input) {
      return pluralizeFactory.plural(input);
    };
  }
})();
