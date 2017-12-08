// Sells service used to communicate Sells REST endpoints
(function () {
  'use strict';

  angular
    .module('sells')
    .factory('SellsService', SellsService);

  SellsService.$inject = ['$resource'];

  function SellsService($resource) {
    return $resource('api/sells/:sellId', {
      sellId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
