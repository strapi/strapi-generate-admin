(function () {
  'use strict';

  angular.module('frontend.core.services')
    .factory('messageService', messageService);

  messageService.$inject = ['toastr', '_'];

  function messageService(toastr, _) {
    var service = {
      success: success,
      info: info,
      warning: warning,
      error: error
    };

    return service;

    /**
     * Private helper function to make actual message via toastr component.
     *
     * @param   {string}  message         Message content
     * @param   {string}  title           Message title
     * @param   {{}}      options         Message specified options
     * @param   {{}}      defaultOptions  Default options for current message type
     * @param   {string}  type            Message type
     * @private
     */
    function _makeMessage(message, title, options, defaultOptions, type) {
      title = title || '';
      options = options || {};

      toastr[type](message, title, _.assign(defaultOptions, options));
    }

    /**
     * Method to generate 'success' message.
     *
     * @param   {string}  message   Message content
     * @param   {string}  [title]   Message title
     * @param   {{}}      [options] Message options
     */
    function success(message, title, options) {
      var defaultOptions = {
        timeOut: 3000
      };

      _makeMessage(message, title, options, defaultOptions, 'success');
    }

    /**
     * Method to generate 'info' message.
     *
     * @param   {string}  message   Message content
     * @param   {string}  [title]   Message title
     * @param   {{}}      [options] Message options
     */
    function info(message, title, options) {
      var defaultOptions = {
        timeout: 4000
      };

      _makeMessage(message, title, options, defaultOptions, 'info');
    }

    /**
     * Method to generate 'warning' message.
     *
     * @param   {string}  message   Message content
     * @param   {string}  [title]   Message title
     * @param   {{}}      [options] Message options
     */
    function warning(message, title, options) {
      var defaultOptions = {
        timeout: 5000
      };

      _makeMessage(message, title, options, defaultOptions, 'warning');
    }

    /**
     * Method to generate 'error' message.
     *
     * @param   {string}  message   Message content
     * @param   {string}  [title]   Message title
     * @param   {{}}      [options] Message options
     */
    function error(message, title, options) {
      var defaultOptions = {
        timeout: 6000
      };

      _makeMessage(message, title, options, defaultOptions, 'error');
    }
  }
})();
