// Accountcharts service used to communicate Accountcharts REST endpoints
(function () {
  'use strict';

  angular
    .module('accountcharts')
    .factory('AccountchartsService', AccountchartsService);

  AccountchartsService.$inject = ['$resource'];

  function AccountchartsService($resource) {
    return $resource('api/accountcharts/:accountchartId', {
      accountchartId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
