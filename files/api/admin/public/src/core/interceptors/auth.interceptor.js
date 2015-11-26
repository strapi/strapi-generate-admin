/**
 * Auth interceptor for HTTP and Socket request. This interceptor will add required
 * JWT (Json Web Token) token to each requests. That token is validated in server side
 * application.
 */
(function () {
  'use strict';

  angular.module('frontend.core.interceptors')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$q', '$injector', '$localStorage'];

  function AuthInterceptor($q, $injector, $localStorage) {
    var service = {
      request: request,
      responseError: responseError
    };

    return service;

    /**
     * Interceptor method for $http requests. Main purpose of this method is to add JWT token
     * to every request that application does.
     *
     * @param   {*} config  HTTP request configuration
     *
     * @returns {*}
     */
    function request(config) {
      var token;

      // Yeah we have some user data on local storage.
      if ($localStorage.credentials) {
        token = $localStorage.credentials.jwt || $localStorage.credentials.token;
      }

      // Yeah we have a token.
      if (token) {
        if (!config.data) {
          config.data = {};
        }

        /**
         * Set token to actual data and headers. Note that we need both ways because of socket cannot modify
         * headers anyway. These values are cleaned up in backend side policy (middleware).
         */
        config.data.token = token;
        config.headers.authorization = 'Bearer ' + token;
      }

      return config;
    }

    /**
     * Interceptor method that is triggered whenever response error occurs on $http requests.
     *
     * @param   {*} response
     *
     * @returns {*|Promise}
     */
    function responseError(response) {
      if (response.status === 401) {
        $localStorage.$reset();

        if ($injector.get('configService').getConfig().isNewApp) {
          $injector.get('$state').go('auth.register');
        } else {
          $injector.get('$state').go('auth.login');
        }
      }

      return $q.reject(response);
    }
  }
})();
