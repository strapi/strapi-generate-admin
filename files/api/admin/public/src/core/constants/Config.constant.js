(function () {
  'use strict';

  /**
   * Frontend application backend constant definitions. This is something that you must define in your application.
   *
   * Note that 'Config.backendUrl' is configured in /frontend/config/config.json file and you must change it to match
   * your backend API url.
   */
  angular.module('frontend')
    .constant('Config', {
      backendUrl: window.backendUrl || window.location.origin,
      frontendUrl: window.frontendUrl
    });
})();
