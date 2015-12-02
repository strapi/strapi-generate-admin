(function () {
  'use strict';

  /**
   * Directive used for infinite scroll (used
   * for relations in the Data Explorer edit view).
   */
  angular.module('frontend.core.directives')
    .directive('infiniteScroll', infiniteScroll);

  infiniteScroll.$inject = ['$rootScope', '$window', '$timeout'];

  function infiniteScroll($rootScope, $window, $timeout) {
    var directive = {
      link: link
    };

    return directive;

    function link(scope, elem, attrs) {
      var checkWhenEnabled;
      var scrollEnabled;
      $window = angular.element($window);
      elem.css('overflow-y', 'auto');
      elem.css('overflow-x', 'hidden');
      elem.css('height', 'inherit');
      scrollEnabled = true;
      checkWhenEnabled = false;
      if (attrs.infiniteScrollDisabled !== null) {
        scope.$watch(attrs.infiniteScrollDisabled, function (value) {
          scrollEnabled = !value;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        });
      }
      $rootScope.$on('refreshStart', function () {
        elem.animate({scrollTop: '0'});
      });
      function handler() {
        var container;
        var elementBottom;
        var remaining;
        var shouldScroll;
        var containerBottom;
        container = angular.element(elem.children()[0]);
        container.offset = offset;
        elem.offset = offset;
        elementBottom = elem.offset().top + elem[0].offsetHeight;
        containerBottom = container.offset().top + container[0].offsetHeight;
        remaining = containerBottom - elementBottom;
        shouldScroll = remaining <= 0;

        if (shouldScroll && scrollEnabled && !scope.$eval(attrs.infiniteScrollLoading)) {
          if ($rootScope.$$phase) {
            return scope.$eval(attrs.infiniteScroll);
          } else {
            return scope.$apply(attrs.infiniteScroll);
          }
        } else if (shouldScroll) {
          checkWhenEnabled = true;
          return checkWhenEnabled;
        }
      }

      elem.on('scroll', handler);
      scope.$on('$destroy', function () {
        return $window.off('scroll', handler);
      });
      return $timeout(function () {
        if (attrs.infiniteScrollImmediateCheck) {
          if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
            return handler();
          }
        } else {
          return handler();
        }
      }, 0);
    }
  }

  /**
   * JQuery mixin
   *
   * @returns {{top: number, left: number}}
   */
  function offset() {
    /* jshint validthis: true */
    var self = this;
    var elem = self[0];

    if (!elem) {
      return;
    }

    var rect = elem.getBoundingClientRect();

    // Make sure element is not hidden (display: none) or disconnected
    return {
      top: rect.top + window.pageYOffset - document.documentElement.clientTop,
      left: rect.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
})();
