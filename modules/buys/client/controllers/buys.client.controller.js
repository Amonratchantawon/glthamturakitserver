(function () {
  'use strict';

  // Buys controller
  angular
    .module('buys')
    .controller('BuysController', BuysController);

  BuysController.$inject = ['$scope', '$state', '$window', 'Authentication', 'buyResolve'];

  function BuysController ($scope, $state, $window, Authentication, buy) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buy = buy;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Buy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.buy.$remove($state.go('buys.list'));
      }
    }

    // Save Buy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.buyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.buy._id) {
        vm.buy.$update(successCallback, errorCallback);
      } else {
        vm.buy.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('buys.view', {
          buyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
