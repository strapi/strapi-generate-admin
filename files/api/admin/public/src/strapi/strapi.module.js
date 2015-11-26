(function () {
  'use strict';

  // Init module.
  angular.module('frontend.strapi', [
    'frontend.strapi.dashboard',
    'frontend.strapi.explorer',
    'frontend.strapi.users'
  ]);
})();
