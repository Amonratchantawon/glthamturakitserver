(function () {
  'use strict';

  angular
    .module('sells')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sells', {
        abstract: true,
        url: '/sells',
        template: '<ui-view/>'
      })
      .state('sells.list', {
        url: '',
        templateUrl: 'modules/sells/client/views/list-sells.client.view.html',
        controller: 'SellsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sells List'
        }
      })
      .state('sells.create', {
        url: '/create',
        templateUrl: 'modules/sells/client/views/form-sell.client.view.html',
        controller: 'SellsController',
        controllerAs: 'vm',
        resolve: {
          sellResolve: newSell
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sells Create'
        }
      })
      .state('sells.edit', {
        url: '/:sellId/edit',
        templateUrl: 'modules/sells/client/views/form-sell.client.view.html',
        controller: 'SellsController',
        controllerAs: 'vm',
        resolve: {
          sellResolve: getSell
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sell {{ sellResolve.name }}'
        }
      })
      .state('sells.view', {
        url: '/:sellId',
        templateUrl: 'modules/sells/client/views/view-sell.client.view.html',
        controller: 'SellsController',
        controllerAs: 'vm',
        resolve: {
          sellResolve: getSell
        },
        data: {
          pageTitle: 'Sell {{ sellResolve.name }}'
        }
      });
  }

  getSell.$inject = ['$stateParams', 'SellsService'];

  function getSell($stateParams, SellsService) {
    return SellsService.get({
      sellId: $stateParams.sellId
    }).$promise;
  }

  newSell.$inject = ['SellsService'];

  function newSell(SellsService) {
    return new SellsService();
  }
}());
