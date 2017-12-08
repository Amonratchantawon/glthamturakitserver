(function () {
  'use strict';

  angular
    .module('buys')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('buys', {
        abstract: true,
        url: '/buys',
        template: '<ui-view/>'
      })
      .state('buys.list', {
        url: '',
        templateUrl: 'modules/buys/client/views/list-buys.client.view.html',
        controller: 'BuysListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Buys List'
        }
      })
      .state('buys.create', {
        url: '/create',
        templateUrl: 'modules/buys/client/views/form-buy.client.view.html',
        controller: 'BuysController',
        controllerAs: 'vm',
        resolve: {
          buyResolve: newBuy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Buys Create'
        }
      })
      .state('buys.edit', {
        url: '/:buyId/edit',
        templateUrl: 'modules/buys/client/views/form-buy.client.view.html',
        controller: 'BuysController',
        controllerAs: 'vm',
        resolve: {
          buyResolve: getBuy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Buy {{ buyResolve.name }}'
        }
      })
      .state('buys.view', {
        url: '/:buyId',
        templateUrl: 'modules/buys/client/views/view-buy.client.view.html',
        controller: 'BuysController',
        controllerAs: 'vm',
        resolve: {
          buyResolve: getBuy
        },
        data: {
          pageTitle: 'Buy {{ buyResolve.name }}'
        }
      });
  }

  getBuy.$inject = ['$stateParams', 'BuysService'];

  function getBuy($stateParams, BuysService) {
    return BuysService.get({
      buyId: $stateParams.buyId
    }).$promise;
  }

  newBuy.$inject = ['BuysService'];

  function newBuy(BuysService) {
    return new BuysService();
  }
}());
