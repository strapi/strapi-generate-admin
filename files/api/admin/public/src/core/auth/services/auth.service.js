(function () {
  'use strict';

  /**
   * Service containing the main authentication logic.
   */
  angular.module('frontend.core.auth.services')
    .factory('authService', authService);

  authService.$inject = ['$http', '$state', '$localStorage', 'AccessLevels', 'Config', 'messageService', '$location', 'initService', '$injector'];

  function authService($http, $state, $localStorage, AccessLevels, Config, messageService, $location, initService, $injector) {

    var service = {
      authorize: authorize,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      forgotPassword: forgotPassword,
      changePassword: changePassword
    };

    return service;

    /**
     * Method to authorize current user with given access level in application.
     *
     * @param  {Number}  accessLevel Access level to check
     *
     * @return {Boolean}
     */
    function authorize(accessLevel) {
      if (accessLevel === AccessLevels.user) {
        return service.isAuthenticated();
      } else if (accessLevel === AccessLevels.admin) {
        return service.isAuthenticated() && Boolean($localStorage.credentials.user.admin);
      } else {
        return accessLevel === AccessLevels.anon;
      }
    }

    /**
     * Method to check if current user is authenticated or not.
     * This will just simply call 'Storage' service 'get' method and
     * returns it results.
     *
     * @return {Boolean}
     */
    function isAuthenticated() {
      return Boolean($localStorage.credentials);
    }

    /**
     * Method make login request to backend server. Successfully response from
     * server contains user data and JWT token as in JSON object. After successful
     * authentication method will store user data and JWT token to local storage
     * where those can be used.
     *
     * @param  {Object}  credentials
     */
    function login(credentials) {
      return $http.post(Config.backendUrl + '/auth/local', credentials, {
        withCredentials: true
      })
        .then(function (response) {
          var configService = $injector.get('configService');
          configService.getApp(true).then(function () {
            messageService.success('You have been logged in.');
          });

          $localStorage.credentials = response.data;
        });
    }

    /**
     * The backend doesn't care about actual user logout, just delete the token
     * and you're good to go.
     */
    function logout() {
      $localStorage.$reset();
      return $http.post(Config.backendUrl + '/auth/logout', {})
        .then(function () {
          $state.go('auth.login');
        });
    }

    /**
     * HTTP request on server to create new user.
     *
     * @param {Object} user
     */
    function register(user) {
      return $http.post(Config.backendUrl + '/auth/local/register', user)
        .then(function (response) {
          messageService.success('You have been logged in.');

          $localStorage.credentials = response.data;
        });
    }

    /**
     * HTTP request on server to create link with code token to change password.
     *
     * @param {String} email
     */
    function forgotPassword(email) {
      var changePasswordUrl = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/admin/#!/forgot-password/change-password';

      return $http.post(Config.backendUrl + '/auth/forgot-password', {
        email: email,
        url: changePasswordUrl
      })
        .then(function () {
          messageService.success('Request sent, check your emails');

          return false;
        })
        .catch(function () {
          return true;
        });
    }

    /**
     * HTTP request on server to change user password.
     *
     * @param {Object} scope
     */
    function changePassword(scope) {
      return $http.post(Config.backendUrl + '/auth/change-password', scope)
        .then(function (response) {
          messageService.success('Password changed');

          $localStorage.credentials = response.data;

          return false;
        })
        .catch(function () {
          return true;
        });
    }
  }
})();
