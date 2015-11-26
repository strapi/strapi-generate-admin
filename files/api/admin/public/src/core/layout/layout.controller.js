(function () {
  'use strict';

  /**
   * Controllers used for the header and the menu.
   */
  angular.module('frontend.core.layout')
    .controller('HeaderController', HeaderController)
    .controller('MenuController', MenuController);

  HeaderController.$inject = ['userService', 'authService', 'messageService'];

  function HeaderController(userService, authService, messageService) {

    var vm = this;
    vm.user = userService.user;

    vm.logout = logout;

    // Private functions.

    /*
     * Simple helper function which triggers user logout action.
     */
    function logout() {
      authService.logout();
      messageService.success('You have been logged out.');
    }
  }

  MenuController.$inject = ['configService', 'layoutService'];

  function MenuController(configService, layoutService) {

    var vm = this;
    vm.menuLinks = {};
    vm.menuLinks.models = [];
    vm.collapsedBooleans = layoutService.collapsedBooleans;
    vm.expand = layoutService.expand;

    // These items should be ignored in the menu display.
    var ignoredModels = ['role', 'user', 'route', 'passport', 'upload', 'email'];
    angular.forEach(configService.getConfig().models, function (model, key) {
      if (ignoredModels.indexOf(key) === -1) {
        vm.menuLinks.models.push({
          model: key
        });
      }
    });
  }
})();
