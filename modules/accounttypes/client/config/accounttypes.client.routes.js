(function () {
  'use strict';

  angular
    .module('accounttypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('accounttypes', {
        abstract: true,
        url: '/accounttypes',
        template: '<ui-view/>'
      })
      .state('accounttypes.list', {
        url: '',
        templateUrl: 'modules/accounttypes/client/views/list-accounttypes.client.view.html',
        controller: 'AccounttypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Accounttypes List'
        }
      })
      .state('accounttypes.create', {
        url: '/create',
        templateUrl: 'modules/accounttypes/client/views/form-accounttype.client.view.html',
        controller: 'AccounttypesController',
        controllerAs: 'vm',
        resolve: {
          accounttypeResolve: newAccounttype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Accounttypes Create'
        }
      })
      .state('accounttypes.edit', {
        url: '/:accounttypeId/edit',
        templateUrl: 'modules/accounttypes/client/views/form-accounttype.client.view.html',
        controller: 'AccounttypesController',
        controllerAs: 'vm',
        resolve: {
          accounttypeResolve: getAccounttype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Accounttype {{ accounttypeResolve.name }}'
        }
      })
      .state('accounttypes.view', {
        url: '/:accounttypeId',
        templateUrl: 'modules/accounttypes/client/views/view-accounttype.client.view.html',
        controller: 'AccounttypesController',
        controllerAs: 'vm',
        resolve: {
          accounttypeResolve: getAccounttype
        },
        data: {
          pageTitle: 'Accounttype {{ accounttypeResolve.name }}'
        }
      });
  }

  getAccounttype.$inject = ['$stateParams', 'AccounttypesService'];

  function getAccounttype($stateParams, AccounttypesService) {
    return AccounttypesService.get({
      accounttypeId: $stateParams.accounttypeId
    }).$promise;
  }

  newAccounttype.$inject = ['AccounttypesService'];

  function newAccounttype(AccounttypesService) {
    return new AccounttypesService();
  }
}());
