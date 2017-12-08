// Glyears service used to communicate Glyears REST endpoints
(function () {
  'use strict';

  angular
    .module('glyears')
    .factory('GlyearsService', GlyearsService);

  GlyearsService.$inject = ['$resource'];

  function GlyearsService($resource) {
    return $resource('api/glyears/:glyearId', {
      glyearId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
