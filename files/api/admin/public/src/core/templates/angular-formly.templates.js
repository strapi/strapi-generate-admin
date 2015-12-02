(function () {
  'use strict';

  /**
   * Templates for the `angular-formly` module.
   */
  angular.module('frontend.core.templates')
    .run(['$templateCache', function ($templateCache) {

      $templateCache.put('templates/angular-formly/input-template.html',
        '<input type=\"{{options.templateOptions.type || \'text\'}}\"' +
        '	       class=\"form-control\"' +
        '	       id=\"{{id}}\"' +
        '	       formly-dynamic-name=\"id\"' +
        '	       formly-custom-validation=\"options.validators\"' +
        '	       placeholder=\"{{options.templateOptions.placeholder}}\"' +
        '	       aria-describedby=\"{{id}}_description\"' +
        '	       ng-required=\"options.templateOptions.required\"' +
        '	       ng-disabled=\"options.templateOptions.disabled\"' +
        '	       ng-model=\"model[options.key]\">');

      $templateCache.put('templates/angular-formly/textarea-template.html',
        '<textarea' +
        '	       class=\"form-control\"' +
        '	       id=\"{{id}}\"' +
        '	       formly-dynamic-name=\"id\"' +
        '	       formly-custom-validation=\"options.validators\"' +
        '	       placeholder=\"{{options.templateOptions.placeholder}}\"' +
        '	       aria-describedby=\"{{id}}_description\"' +
        '	       ng-required=\"options.templateOptions.required\"' +
        '	       ng-disabled=\"options.templateOptions.disabled\"' +
        '	       ng-model=\"model[options.key]\"><\/textarea>');

      $templateCache.put('templates/angular-formly/input-checkbox.html',
        '<input type=\"checkbox\"' +
        '             id=\"{{id}}\"' +
        '             formly-dynamic-name=\"id\"' +
        '             formly-custom-validation=\"options.validators\"' +
        '             aria-describedby=\"{{id}}_description\"' +
        '             ng-required=\"options.templateOptions.required\"' +
        '             ng-disabled=\"options.templateOptions.disabled\"' +
        '             ng-model=\"model[options.key]\">' +
        '      {{options.templateOptions.label || \'Checkbox\'}}' +
        '      {{options.templateOptions.required ? \'*\' : \'\'}}');

      $templateCache.put('templates/angular-formly/input-checkbox.html',
        '<formly-transclude></formly-transclude>' +
        '<div ng-messages=\"fc.$error\" ng-if=\"form.$submitted || options.formControl.$touched\" class=\"error-messages\">' +
        '<div ng-message=\"{{ ::name }}\" ng-repeat=\"(name, message) in ::options.validation.messages\" class=\"message\">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>');

    }]);
})();
