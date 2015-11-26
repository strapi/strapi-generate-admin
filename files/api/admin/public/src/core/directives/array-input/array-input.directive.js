(function () {
  'use strict';

  /**
   * Directive used to format text to array
   * (using the `,` symbol as separator).
   */
  angular.module('frontend.core.directives')
    .directive('arrayInput', arrayInput);

  arrayInput.$inject = ['_'];

  function arrayInput(_) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, elem, attr, ctrl) {
      ctrl.$parsers.push(function (input) {
        ctrl.$setValidity('arrayInput', true);
        if (typeof input === 'string') {
          return input.split(',');
        }
      });
      ctrl.$formatters.push(function (data) {
        if (data === null) {
          ctrl.$setValidity('arrayInput', false);
          return [];
        }
        if (_.isArray(data)) {
          ctrl.$setValidity('arrayInput', true);
          return data;
        } else {
          ctrl.$setValidity('arrayInput', false);
          return '';
        }
      });
    }
  }
})();
