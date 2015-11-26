/**
 * Interceptor for $http requests to handle possible errors and show
 * that error to user automatically. Message is shown by application 'Message' service
 * which uses `toastr` library.
 */
(function () {
  'use strict';

  angular.module('frontend.core.interceptors')
    .factory('ErrorInterceptor', ErrorInterceptor);

  ErrorInterceptor.$inject = ['$q', '$injector', '_'];

  function ErrorInterceptor($q, $injector, _) {
    var service = {
      response: responseInterceptor,
      responseError: responseError
    };

    return service;

    /**
     * Interceptor method which is triggered whenever response occurs on $http queries.
     *
     * @param   {*} response
     *
     * @returns {*|Promise}
     */
    function responseInterceptor(response) {
      if (response.data.error &&
        response.data.status &&
        response.data.status !== 200
      ) {
        return $q.reject(response);
      } else {
        return response || $q.when(response);
      }
    }

    /**
     * Interceptor method that is triggered whenever response error occurs on $http requests.
     *
     * @param   {*} response
     *
     * @returns {*|Promise}
     */
    function responseError(response) {
      var message = '';

      // Ignored URLs.
      var ignoredUrlErrors = ['config'];
      var isIgnoredUrl = false;
      angular.forEach(ignoredUrlErrors, function (ignoredUrl) {
        if (_.includes(response.config.url, ignoredUrl)) {
          isIgnoredUrl = true;
        }
      });

      if (isIgnoredUrl || response.config.data.cancelable) {
        return $q.reject(response);
      }

      if (!message && response.data && response.data.invalidAttributes) {
        var invalidFields = [];

        angular.forEach(response.data.invalidAttributes, function (invalidField, key) {
          invalidFields.push(key);
        });

        message = invalidFields.length > 1 ? 'These fields are invalid : ' : 'This field is invalid : ';
        message += invalidFields.join(' ');

      } else if (!message && response.data && response.data.error) {
        message = response.data.error;
      } else if (!message && response.data && response.data.message) {
        message = response.data.message;
      } else if (!message) {
        if (typeof response.data === 'string') {
          message = response.data;
        } else if (response.statusText) {
          message = response.statusText;
        } else {
          message = $injector.get('httpStatusService').getStatusCodeText(response.status);
        }

        message = message || ' <span class="text-small">(HTTP status ' + response.status + ')</span>';
      }

      if (message) {
        $injector.get('messageService').error(message);
      }

      return $q.reject(response);
    }
  }
})();
