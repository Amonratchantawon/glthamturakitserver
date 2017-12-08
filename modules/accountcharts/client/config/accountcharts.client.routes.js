(function () {
  'use strict';

  angular
    .module('accountcharts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('accountcharts', {
        abstract: true,
        url: '/accountcharts',
        template: '<ui-view/>'
      })
      .state('accountcharts.list', {
        url: '',
        templateUrl: 'modules/accountcharts/client/views/list-accountcharts.client.view.html',
        controller: 'AccountchartsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Accountcharts List'
        }
      })
      .state('accountcharts.create', {
        url: '/create',
        templateUrl: 'modules/accountcharts/client/views/form-accountchart.client.view.html',
        controller: 'AccountchartsController',
        controllerAs: 'vm',
        resolve: {
          accountchartResolve: newAccountchart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Accountcharts Create'
        }
      })
      .state('accountcharts.edit', {
        url: '/:accountchartId/edit',
        templateUrl: 'modules/accountcharts/client/views/form-accountchart.client.view.html',
        controller: 'AccountchartsController',
        controllerAs: 'vm',
        resolve: {
          accountchartResolve: getAccountchart
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Accountchart {{ accountchartResolve.name }}'
        }
      })
      .state('accountcharts.view', {
        url: '/:accountchartId',
        templateUrl: 'modules/accountcharts/client/views/view-accountchart.client.view.html',
        controller: 'AccountchartsController',
        controllerAs: 'vm',
        resolve: {
          accountchartResolve: getAccountchart
        },
        data: {
          pageTitle: 'Accountchart {{ accountchartResolve.name }}'
        }
      });
  }

  getAccountchart.$inject = ['$stateParams', 'AccountchartsService'];

  function getAccountchart($stateParams, AccountchartsService) {
    return AccountchartsService.get({
      accountchartId: $stateParams.accountchartId
    }).$promise;
  }

  newAccountchart.$inject = ['AccountchartsService'];

  function newAccountchart(AccountchartsService) {
    return new AccountchartsService();
  }
}());
