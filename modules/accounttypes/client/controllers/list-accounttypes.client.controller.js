(function () {
  'use strict';

  angular
    .module('accounttypes')
    .controller('AccounttypesListController', AccounttypesListController);

  AccounttypesListController.$inject = ['AccounttypesService'];

  function AccounttypesListController(AccounttypesService) {
    var vm = this;

    vm.accounttypes = AccounttypesService.query();
  }
}());
