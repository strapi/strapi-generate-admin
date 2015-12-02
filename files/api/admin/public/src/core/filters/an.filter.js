(function () {
  'use strict';

  /**
   * Filter `an`, used to format singular indefinite article.
   */
  angular.module('frontend.core.filters')
    .filter('an', an);

  an.$inject = ['_'];

  function an(_) {
    return function (nextWord) {
      if (typeof nextWord !== 'string') {
        return nextWord;
      }
      if (!nextWord) {
        return 'a';
      }
      var vowels = ['a', 'e', 'i', 'o'];
      nextWord = _.trim(nextWord);
      return _.contains(vowels, nextWord[0]) ? 'an' : 'a';
    };
  }
})();
