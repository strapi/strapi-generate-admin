(function () {
  'use strict';

  // Init module.
  angular.module('frontend.core', [
    'frontend.core.dependencies', // Note that this must be loaded first
    'frontend.core.auth',
    'frontend.core.directives',
    'frontend.core.error',
    'frontend.core.filters',
    'frontend.core.interceptors',
    'frontend.core.layout',
    'frontend.core.libraries',
    'frontend.core.models',
    'frontend.core.services',
    'frontend.core.templates'
  ]);
})();
