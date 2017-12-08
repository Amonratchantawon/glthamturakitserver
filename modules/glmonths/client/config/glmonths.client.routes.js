(function () {
  'use strict';

  angular
    .module('glmonths')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('glmonths', {
        abstract: true,
        url: '/glmonths',
        template: '<ui-view/>'
      })
      .state('glmonths.list', {
        url: '',
        templateUrl: 'modules/glmonths/client/views/list-glmonths.client.view.html',
        controller: 'GlmonthsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Glmonths List'
        }
      })
      .state('glmonths.create', {
        url: '/create',
        templateUrl: 'modules/glmonths/client/views/form-glmonth.client.view.html',
        controller: 'GlmonthsController',
        controllerAs: 'vm',
        resolve: {
          glmonthResolve: newGlmonth
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Glmonths Create'
        }
      })
      .state('glmonths.edit', {
        url: '/:glmonthId/edit',
        templateUrl: 'modules/glmonths/client/views/form-glmonth.client.view.html',
        controller: 'GlmonthsController',
        controllerAs: 'vm',
        resolve: {
          glmonthResolve: getGlmonth
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Glmonth {{ glmonthResolve.name }}'
        }
      })
      .state('glmonths.view', {
        url: '/:glmonthId',
        templateUrl: 'modules/glmonths/client/views/view-glmonth.client.view.html',
        controller: 'GlmonthsController',
        controllerAs: 'vm',
        resolve: {
          glmonthResolve: getGlmonth
        },
        data: {
          pageTitle: 'Glmonth {{ glmonthResolve.name }}'
        }
      });
  }

  getGlmonth.$inject = ['$stateParams', 'GlmonthsService'];

  function getGlmonth($stateParams, GlmonthsService) {
    return GlmonthsService.get({
      glmonthId: $stateParams.glmonthId
    }).$promise;
  }

  newGlmonth.$inject = ['GlmonthsService'];

  function newGlmonth(GlmonthsService) {
    return new GlmonthsService();
  }
}());
