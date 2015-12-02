(function () {
  'use strict';

  /**
   * Generic models angular module initialize. This module contains all 3rd party dependencies that application needs to
   * actually work.
   *
   * Also note that this module have to be loaded before any other application modules that have dependencies to these
   * "core" modules.
   */
  angular.module('frontend.core.dependencies', [
    'angular-loading-bar',
    'angularMoment',
    'as.sortable',
    'formly',
    'formlyBootstrap',
    'ngAnimate',
    'ngBootbox',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'toastr',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.router',
    'ui.select',
    'ui.utils'
  ]);
})();
