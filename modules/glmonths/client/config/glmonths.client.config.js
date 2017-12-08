(function () {
  'use strict';

  angular
    .module('glmonths')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Glmonths',
      state: 'glmonths',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'glmonths', {
      title: 'List Glmonths',
      state: 'glmonths.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'glmonths', {
      title: 'Create Glmonth',
      state: 'glmonths.create',
      roles: ['user']
    });
  }
}());
