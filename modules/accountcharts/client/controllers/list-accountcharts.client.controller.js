(function () {
  'use strict';

  angular
    .module('accountcharts')
    .controller('AccountchartsListController', AccountchartsListController);

  AccountchartsListController.$inject = ['AccountchartsService'];

  function AccountchartsListController(AccountchartsService) {
    var vm = this;

    vm.accountcharts = AccountchartsService.query();
  }
}());
