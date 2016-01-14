(function () {
  'use strict';

  /**
   * Configuration for frontend application.
   */
  angular.module('frontend')
    .config(config);

  config.$inject = ['$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$uibTooltipProvider',
    'cfpLoadingBarProvider',
    'toastrConfig',
    '$urlMatcherFactoryProvider'];

  function config($stateProvider,
                  $locationProvider,
                  $urlRouterProvider,
                  $httpProvider,
                  $uibTooltipProvider,
                  cfpLoadingBarProvider,
                  toastrConfig,
                  $urlMatcherFactoryProvider) {

    // $http config.
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Add interceptors for $httpProvider.
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.interceptors.push('ErrorInterceptor');

    // Set tooltip options.
    $uibTooltipProvider.options({
      appendToBody: true
    });

    // Disable spinner from cfpLoadingBar.
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 200;

    // Extend default toastr configuration with application specified configuration.
    angular.extend(
      toastrConfig, {
        allowHtml: true,
        closeButton: true,
        extendedTimeOut: 3000
      }
    );

    // HTML5 urls are disabled.
    $locationProvider
      .html5Mode({
        enabled: false,
        requireBase: false
      })
      .hashPrefix('!');

    // Main state provider for frontend application.
    $stateProvider
      .state('frontend', {
        views: {},
        resolve: {
          _config: ['initService', function (initService) {
            return initService.promise;
          }]
        }
      });

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');

    // Strict Mode.
    $urlMatcherFactoryProvider.strictMode(false);
  }
})();
