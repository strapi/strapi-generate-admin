(function () {
  'use strict';

  // Init module.
  angular.module('frontend.core.auth', [
    'frontend.core.auth.login',
    'frontend.core.auth.register',
    'frontend.core.auth.forgotPassword',
    'frontend.core.auth.changePassword',
    'frontend.core.auth.services'
  ]);
})();
