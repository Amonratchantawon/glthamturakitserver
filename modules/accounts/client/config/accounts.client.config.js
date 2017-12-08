(function() {
    'use strict';

    angular
        .module('accounts')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Accounts',
            state: 'accounts',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'accounts', {
            title: 'List Accounts',
            state: 'accounts.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'accounts', {
            title: 'Create Account',
            state: 'accounts.create',
            roles: ['user']
        });
    }
}());