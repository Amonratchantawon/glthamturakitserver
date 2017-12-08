(function () {
  'use strict';

  angular
    .module('accounttypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Accounttypes',
      state: 'accounttypes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'accounttypes', {
      title: 'List Accounttypes',
      state: 'accounttypes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'accounttypes', {
      title: 'Create Accounttype',
      state: 'accounttypes.create',
      roles: ['user']
    });
  }
}());
