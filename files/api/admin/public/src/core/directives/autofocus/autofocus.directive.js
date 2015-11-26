(function () {
  'use strict';

  angular.module('frontend.core.directives')
    .directive('autofocus', autofocus);

  autofocus.$inject = ['$timeout'];

  function autofocus($timeout) {
    var directive = {
      restrict: 'A',
      link: function ($scope, $element) {
        $timeout(function () {
          $element[0].focus();
        });
      }
    };

    return directive;
  }
})();
