(function () {
  'use strict';

  angular.module('frontend.core.services')
    .factory('configService', configService);

  configService.$inject = ['$http', 'Config', 'messageService', '$sessionStorage', '$q', '$state', 'authService'];

  function configService($http, Config, messageService, $sessionStorage, $q, $state, authService) {
    var config = {};
    var firstLoad = true;
    var service = {
      getConfig: getConfig,
      getApp: getApp
    };

    return service;

    // Private functions.

    /**
     * Return the private `config` object.
     * @returns {{}}
     */
    function getConfig() {
      return config;
    }

    /**
     * Gey the config of the app from its API.
     *
     * @param {String}   appUrl
     * @param {Boolean}  ignoreError
     * @returns {*}
     */
    function getApp(appUrl, ignoreError) {

      // Init promise.
      var deferred = $q.defer();

      // Set the appUrl in the local storage.
      $sessionStorage.appUrl = appUrl ? appUrl : $sessionStorage.appUrl;
      appUrl = $sessionStorage.appUrl;

      // Set the default appUrl.
      appUrl = appUrl ? appUrl : Config.backendUrl;
      $sessionStorage.appUrl = appUrl;

      // Get the config of the app.
      $http({
        method: 'GET',
        url: appUrl + '/admin/config'
      }).then(function (response) {
        // Set the config.
        config = response.data;

        // Set the backend url in Config object.
        Config.backendUrl = response.data.settings && response.data.settings.url || Config.backendUrl;

        // Set the isNewApp value in configService object.
        config.isNewApp = response.data.settings && response.data.settings.isNewApp;

        config.models = response.data.models;

        // Check if the user is connected.
        if (!config.connected) {
          if (config.isNewApp) {
            $state.go('auth.register');
          } else if ($state.includes('strapi')) {
            $state.go('auth.login');
          }
        }

        deferred.resolve();
      })
        .catch(function (response) {
          if (response.data && response.data.message) {
            // User is not admin.
            $state.go('auth.login');
            if (!ignoreError) {
              messageService.error(response.data && response.data.message, 'Error', {
                timeOut: 60000
              });
            }
            authService.logout();
          } else if (firstLoad) {
            // App is offline.
            messageService.error('Your app looks offline, please start it and reload this page.', 'Error', {
              timeOut: 60000
            });
          }
          firstLoad = false;
          deferred.reject();
        });
      return deferred.promise;
    }
  }
})();
