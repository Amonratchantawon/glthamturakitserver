(function () {
  'use strict';

  angular
    .module('glyears')
    .controller('GlyearsListController', GlyearsListController);

  GlyearsListController.$inject = ['GlyearsService'];

  function GlyearsListController(GlyearsService) {
    var vm = this;

    vm.glyears = GlyearsService.query();
  }
}());
