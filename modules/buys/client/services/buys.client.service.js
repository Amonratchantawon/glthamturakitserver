// Buys service used to communicate Buys REST endpoints
(function () {
  'use strict';

  angular
    .module('buys')
    .factory('BuysService', BuysService);

  BuysService.$inject = ['$resource'];

  function BuysService($resource) {
    return $resource('api/buys/:buyId', {
      buyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
