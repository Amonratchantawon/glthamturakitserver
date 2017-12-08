(function() {
    'use strict';

    angular
        .module('accountcharts')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Accountcharts',
            state: 'accountcharts',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'accountcharts', {
            title: 'List Accountcharts',
            state: 'accountcharts.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'accountcharts', {
            title: 'Create Accountchart',
            state: 'accountcharts.create',
            roles: ['user']
        });
    }
}());