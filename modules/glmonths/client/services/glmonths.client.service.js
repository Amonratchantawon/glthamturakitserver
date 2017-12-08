// Glmonths service used to communicate Glmonths REST endpoints
(function () {
  'use strict';

  angular
    .module('glmonths')
    .factory('GlmonthsService', GlmonthsService);

  GlmonthsService.$inject = ['$resource'];

  function GlmonthsService($resource) {
    return $resource('api/glmonths/:glmonthId', {
      glmonthId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
