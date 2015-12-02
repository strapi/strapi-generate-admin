(function () {
  'use strict';

  /**
   * Service used to get current user data.
   */
  angular.module('frontend.core.auth.services')
    .factory('userService', userService);

  userService.$inject = ['$localStorage'];

  function userService($localStorage) {
    var service = {
      user: user
    };

    return service;

    /**
     * Return user object
     *
     * It's expose globaly, so you can use it everywhere
     *  <div data-ng-show="auth.isAuthenticated()">
     *      Hello, <strong>{{user().email}}</strong>
     *  </div>
     *
     * @return {Object}
     */
    function user() {
      return $localStorage.credentials ? $localStorage.credentials.user : null;
    }
  }
})();
