(function () {
  'use strict';

  angular
    .module('glmonths')
    .controller('GlmonthsListController', GlmonthsListController);

  GlmonthsListController.$inject = ['GlmonthsService'];

  function GlmonthsListController(GlmonthsService) {
    var vm = this;

    vm.glmonths = GlmonthsService.query();
  }
}());
