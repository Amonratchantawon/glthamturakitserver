(function () {
  'use strict';

  angular
    .module('buys')
    .controller('BuysListController', BuysListController);

  BuysListController.$inject = ['BuysService'];

  function BuysListController(BuysService) {
    var vm = this;

    vm.buys = BuysService.query();
  }
}());
