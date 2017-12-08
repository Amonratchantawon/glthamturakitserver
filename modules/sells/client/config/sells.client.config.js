(function() {
    'use strict';

    angular
        .module('sells')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Sells',
            state: 'sells',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'sells', {
            title: 'List Sells',
            state: 'sells.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'sells', {
            title: 'Create Sell',
            state: 'sells.create',
            roles: ['user']
        });
    }
}());