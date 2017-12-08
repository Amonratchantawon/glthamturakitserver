(function () {
  'use strict';

  angular
    .module('sells')
    .controller('SellsListController', SellsListController);

  SellsListController.$inject = ['SellsService'];

  function SellsListController(SellsService) {
    var vm = this;

    vm.sells = SellsService.query();
  }
}());
