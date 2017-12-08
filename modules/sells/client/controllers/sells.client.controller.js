(function () {
  'use strict';

  // Sells controller
  angular
    .module('sells')
    .controller('SellsController', SellsController);

  SellsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sellResolve'];

  function SellsController ($scope, $state, $window, Authentication, sell) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sell = sell;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sell
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sell.$remove($state.go('sells.list'));
      }
    }

    // Save Sell
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sellForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sell._id) {
        vm.sell.$update(successCallback, errorCallback);
      } else {
        vm.sell.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sells.view', {
          sellId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
