(function () {
  'use strict';

  angular
    .module('glyears')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Glyears',
      state: 'glyears',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'glyears', {
      title: 'List Glyears',
      state: 'glyears.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'glyears', {
      title: 'Create Glyear',
      state: 'glyears.create',
      roles: ['user']
    });
  }
}());
