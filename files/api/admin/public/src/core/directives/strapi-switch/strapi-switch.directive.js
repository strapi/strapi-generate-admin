(function () {
  'use strict';

  /**
   * Directive used to create switch buttons.
   */
  angular.module('frontend.core.directives')
    .directive('strapiSwitch', strapiSwitch);

  strapiSwitch.$inject = [];

  function strapiSwitch() {
    var directive = {
      restrict: 'AE',
      replace: true,
      transclude: true,
      link: function (scope, elem, attrs) {
        scope.isDisabled = function () {
          return scope.$eval(attrs.ngDisabled);
        };
      },
      template: function (element, attrs) {
        var html = '';
        html += '<span';
        html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
        html += attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
        html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled: isDisabled() }"';
        html += '>';
        html += '<small></small>';
        html += '<input type="checkbox"';
        html += attrs.id ? ' id="' + attrs.id + '"' : '';
        html += attrs.name ? ' name="' + attrs.name + '"' : '';
        html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
        html += ' style="display:none" />';
        html += '<span class="switch-text">';
        // Adding new container for switch text
        html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : '';
        // Switch text on value set by user in directive html markup
        html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';
        // Switch text off value set by user in directive html markup
        html += '</span>';
        return html;
      }
    };

    return directive;
  }
})();

