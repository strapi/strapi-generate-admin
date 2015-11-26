(function () {
  'use strict';

  /**
   * Controller for generic error handling.
   */
  angular.module('frontend.core.error')
    .controller('ErrorController', ErrorController);

  ErrorController.$inject = ['$state', '_', '_error'];

  function ErrorController($state, _, _error) {
    if (_.isUndefined(_error)) {
      return $state.go('auth.login');
    }

    var vm = this;

    vm.error = _error;
    vm.error.message = angular.copy(_error.error.message);

    vm.goToPrevious = goToPrevious;

    // Helper function to change current state to previous one
    function goToPrevious() {
      $state.go(vm.error.fromState.name, vm.error.fromParams);
    }
  }
})();
