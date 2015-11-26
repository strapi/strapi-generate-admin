(function () {
  'use strict';

  /**
   * Service used to open a confirmation modal.
   *
   * The main function is `open` and return a promise according to the user's choice.
   */
  angular.module('frontend.core.services')
    .factory('confirmationModal', confirmationModal);

  confirmationModal.$inject = ['$uibModal'];

  function confirmationModal($uibModal) {
    var service = {
      open: openModal
    };

    return service;

    /**
     * Open a confirmation modal
     *
     * @param {Object} options
     * @returns {Promise}
     */
    function openModal(options) {
      // Params options.
      options = angular.isObject(options) ? options : {};
      options.size = options.size || 'md';
      options.title = options.title || 'Please confirm';
      options.content = options.content || 'Are you sure you want to proceed this action ?';

      var modalInstance = $uibModal.open({
        animation: options.animation || true,
        templateUrl: '/frontend/core/services/partials/confirmation-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.options = options;

          // Confirm.
          $scope.ok = function () {
            $uibModalInstance.close('ok');
          };

          // Cancel.
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };

        }],
        size: options.size,
        resolve: {
          items: function () {
            return [];
          }
        }
      });

      // Return the modal promise which will be resolve or rejected
      // when the user clicks on one of the buttons.
      return modalInstance.result;
    }
  }
})();
