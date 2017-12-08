(function () {
  'use strict';

  angular
    .module('glyears')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('glyears', {
        abstract: true,
        url: '/glyears',
        template: '<ui-view/>'
      })
      .state('glyears.list', {
        url: '',
        templateUrl: 'modules/glyears/client/views/list-glyears.client.view.html',
        controller: 'GlyearsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Glyears List'
        }
      })
      .state('glyears.create', {
        url: '/create',
        templateUrl: 'modules/glyears/client/views/form-glyear.client.view.html',
        controller: 'GlyearsController',
        controllerAs: 'vm',
        resolve: {
          glyearResolve: newGlyear
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Glyears Create'
        }
      })
      .state('glyears.edit', {
        url: '/:glyearId/edit',
        templateUrl: 'modules/glyears/client/views/form-glyear.client.view.html',
        controller: 'GlyearsController',
        controllerAs: 'vm',
        resolve: {
          glyearResolve: getGlyear
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Glyear {{ glyearResolve.name }}'
        }
      })
      .state('glyears.view', {
        url: '/:glyearId',
        templateUrl: 'modules/glyears/client/views/view-glyear.client.view.html',
        controller: 'GlyearsController',
        controllerAs: 'vm',
        resolve: {
          glyearResolve: getGlyear
        },
        data: {
          pageTitle: 'Glyear {{ glyearResolve.name }}'
        }
      });
  }

  getGlyear.$inject = ['$stateParams', 'GlyearsService'];

  function getGlyear($stateParams, GlyearsService) {
    return GlyearsService.get({
      glyearId: $stateParams.glyearId
    }).$promise;
  }

  newGlyear.$inject = ['GlyearsService'];

  function newGlyear(GlyearsService) {
    return new GlyearsService();
  }
}());
