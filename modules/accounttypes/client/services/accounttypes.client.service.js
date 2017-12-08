// Accounttypes service used to communicate Accounttypes REST endpoints
(function () {
  'use strict';

  angular
    .module('accounttypes')
    .factory('AccounttypesService', AccounttypesService);

  AccounttypesService.$inject = ['$resource'];

  function AccounttypesService($resource) {
    return $resource('api/accounttypes/:accounttypeId', {
      accounttypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
