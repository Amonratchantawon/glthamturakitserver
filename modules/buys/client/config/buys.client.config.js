(function() {
    'use strict';

    angular
        .module('buys')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Buys',
            state: 'buys',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'buys', {
            title: 'List Buys',
            state: 'buys.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'buys', {
            title: 'Create Buy',
            state: 'buys.create',
            roles: ['user']
        });
    }
}());