(function () {
  'use strict';

  /**
   * Directive used to create links, through collection, in the Data Explorer list views.
   */
  angular.module('frontend.strapi.explorer')
    .directive('goToCollection', goToCollection);

  goToCollection.$inject = ['$state', '_', '$window'];

  function goToCollection($state, _, $window) {
    var directive = {
      restrict: 'A',
      link: function link(scope) {
        scope.goToCollection = function (collection, currentModel, newModel, targetBlank) {
          var where = {
            // Filter according to the list of `ids`.
            id: _.map(collection, function (item) {
              return item.id;
            })
          };

          // Name of the state of the Data Explorer list view.
          var state = 'strapi.explorer.list';

          // State parameters used as params for the link.
          var stateParams = {
            model: newModel,
            where: where
          };

          // Choose behavior according to `targetBlank` parameter
          // (open, or not, in a new tab).
          if (targetBlank) {
            // Build the url.
            var url = $state.href(state, stateParams);
            url += '?where=' + encodeURIComponent(angular.toJson(where));

            // Open the link in a new tab.
            $window.open(url, '_blank');
          } else {
            // Go the state with params.
            $state.go(state, stateParams, {
              inherit: false
            });
          }
        };
      }
    };

    return directive;
  }
})();
