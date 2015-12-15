(function () {
  'use strict';

  /**
   * Frontend application run hook configuration.
   */
  angular.module('frontend')
    .run(run);

  run.$inject = ['$rootScope',
    '$state',
    '$injector',
    'authService',
    'configService',
    '_',
    '$stateParams',
    'formlyConfig',
    'formlyValidationMessages',
    'Config',
    'initService',
    'userService',
    'layoutService'];

  function run($rootScope,
               $state,
               $injector,
               authService,
               configService,
               _,
               $stateParams,
               formlyConfig,
               formlyValidationMessages,
               Config,
               initService,
               userService,
               layoutService) {

    // Set global variable
    $rootScope.auth = authService;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.configService = configService;
    $rootScope.Config = Config;
    $rootScope.authService = authService;
    $rootScope.user = userService.user;
    $rootScope._ = _;

    // Get app config.
    configService.getApp()
      .then(function () {
        initService.deferred.resolve();
      });

    /**
     * Route state change start event, this is needed for following:
     *  1) Check if user is authenticated to access page, and if not redirect user back to login page
     */
    $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState) {
      if (!authService.authorize(toState.data.access)) {
        event.preventDefault();

        if (configService.getConfig() && configService.getConfig().isNewApp) {
          $state.go('auth.register');
        } else {
          $state.go('auth.login');
        }
      }
    });

    // Check for state change errors.
    $rootScope.$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();

      $injector.get('messageService')
        .error('Error loading the page');

      $state.get('error').error = {
        event: event,
        toState: toState,
        toParams: toParams,
        fromState: fromState,
        fromParams: fromParams,
        error: error
      };

      return $state.go('error');
    });

    /**
     * Route state change success event.
     */
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      // Logic for collapsed menu.
      var expandedGroup = toState.data && toState.data.menuGroup;

      // Specific for users models.
      var userModels = ['user', 'role'];
      if ($state.includes('strapi.explorer.list') && _.includes(userModels, toParams.model)) {
        expandedGroup = 'users';
      }

      // Change the expanded item in the menu.
      layoutService.expand(expandedGroup, true);
    });

    // Formly config.
    formlyConfig.setType({
      name: 'array',
      wrapper: 'bootstrapLabel',
      template: '<textarea class="form-control" ng-model="model[options.key]" array-input></textarea>'
    });

    formlyConfig.setType({
      name: 'json',
      wrapper: 'bootstrapLabel',
      template: '<textarea class="form-control" ng-model="model[options.key]" json-input></textarea>'
    });

    var ngModelAttrs = {
      'dateDisabled': {'attribute': 'date-disabled'},
      'customClass': {'attribute': 'custom-class'},
      'showWeeks': {'attribute': 'show-weeks'},
      'startingDay': {'attribute': 'starting-day'},
      'initDate': {'attribute': 'init-date'},
      'minMode': {'attribute': 'min-mode'},
      'maxMode': {'attribute': 'max-mode'},
      'formatDay': {'attribute': 'format-day'},
      'formatMonth': {'attribute': 'format-month'},
      'formatYear': {'attribute': 'format-year'},
      'formatDayHeader': {'attribute': 'format-day-header'},
      'formatDayTitle': {'attribute': 'format-day-title'},
      'formatMonthTitle': {'attribute': 'format-month-title'},
      'yearRange': {'attribute': 'year-range'},
      'shortcutPropagation': {'attribute': 'shortcut-propagation'},
      'datepickerPopup': {'attribute': 'uib-datepicker-popup'},
      'showButtonBar': {'attribute': 'show-button-bar'},
      'currentText': {'attribute': 'current-text'},
      'clearText': {'attribute': 'clear-text'},
      'closeText': {'attribute': 'close-text'},
      'closeOnDateSelection': {'attribute': 'close-on-date-selection'},
      'datepickerAppendToBody': {'attribute': 'datepicker-append-to-body'},
      'datepickerMode': {'bound': 'datepicker-mode'},
      'minDate': {'bound': 'min-date'},
      'maxDate': {'bound': 'max-date'}
    };

    formlyConfig.setType({
      name: 'datepicker',
      template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
      wrapper: [],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          addonRight: {
            class: 'fa fa-calendar',
            onClick: function (options) {
              options.templateOptions.isOpen = !options.templateOptions.isOpen;
            }
          },
          onFocus: function ($viewValue, $modelValue, scope) {
            scope.to.isOpen = !scope.to.isOpen;
          },
          datepickerOptions: {}
        }
      }
    });
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyConfig.extras.ngModelAttrsManipulatorPreferBound = true;
    formlyValidationMessages.addStringMessage('maxlength', 'Your input is too long!');
    formlyValidationMessages.messages.pattern = function (viewValue) {
      return viewValue + ' is invalid';
    };
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', 'Please insert at least', 'characters', 'Too short');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', 'Please insert less than', 'characters', 'Too long');
    formlyValidationMessages.addTemplateOptionValueMessage('min', 'min', 'Please insert a value higher than', '', 'Too small');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'max', 'Please insert a value lower than', '', 'Too big');
    formlyValidationMessages.addTemplateOptionValueMessage('required', '', '', 'This field is required', 'This field is required');
    formlyValidationMessages.addTemplateOptionValueMessage('email', 'email', 'The provided e-mail looks invalid', '', 'The provided e-mail looks invalid');

    formlyConfig.setType([
      {
        name: 'input',
        templateUrl: 'templates/angular-formly/input-template.html',
        wrapper: ['bootstrapLabel'],
        overwriteOk: true
      }, {
        name: 'textarea',
        templateUrl: 'templates/angular-formly/textarea-template.html',
        wrapper: ['bootstrapLabel'],
        overwriteOk: true
      }, {
        name: 'checkbox',
        templateUrl: 'templates/angular-formly/input-checkbox.html',
        wrapper: ['bootstrapLabel'],
        overwriteOk: true
      }
    ]);

    formlyConfig.setWrapper([
      {
        template: [
          '<div class="formly-template-wrapper form-group"',
          'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
          '<formly-transclude></formly-transclude>',
          '<div class="form-validation"',
          'ng-if="options.validation.errorExistsAndShouldBeVisible"',
          'ng-messages="options.formControl.$error">',
          '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
          '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
          '</div>',
          '</div>',
          '</div>'
        ].join(' ')
      }, {
        template: [
          '<div class="checkbox formly-template-wrapper-for-checkboxes form-group">',
          '<label for="{{::id}}">',
          '<formly-transclude></formly-transclude>',
          '</label>',
          '</div>'
        ].join(' '),
        types: 'checkbox'
      }
    ]);
  }
})();
