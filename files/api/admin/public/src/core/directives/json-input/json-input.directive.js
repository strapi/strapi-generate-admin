(function () {
  'use strict';

  /**
   * Directive used to format text to json
   * (using JSON.parse function to parse text value).
   */
  angular.module('frontend.core.directives')
    .directive('jsonInput', jsonInput);

  jsonInput.$inject = [];

  function jsonInput() {

    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attr, ctrl) {
        ctrl.$parsers.push(function (input) {
          try {
            var obj = JSON.parse(input);
            ctrl.$setValidity('jsonInput', true);
            return obj;
          } catch (e) {
            ctrl.$setValidity('jsonInput', false);
            return null;
          }
        });
        ctrl.$formatters.push(function (data) {
          if (data === null) {
            ctrl.$setValidity('jsonInput', false);
            return '';
          }
          try {
            var str = JSON.stringify(data);
            ctrl.$setValidity('jsonInput', true);
            return str;
          } catch (e) {
            ctrl.$setValidity('codeme', false);
            return '';
          }
        });
      }
    };

    return directive;
  }
})();
