(function () {
  'use strict';

  // Accountcharts controller
  angular
    .module('accountcharts')
    .controller('AccountchartsController', AccountchartsController);

  AccountchartsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'accountchartResolve'];

  function AccountchartsController ($scope, $state, $window, Authentication, accountchart) {
    var vm = this;

    vm.authentication = Authentication;
    vm.accountchart = accountchart;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Accountchart
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.accountchart.$remove($state.go('accountcharts.list'));
      }
    }

    // Save Accountchart
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accountchartForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.accountchart._id) {
        vm.accountchart.$update(successCallback, errorCallback);
      } else {
        vm.accountchart.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accountcharts.view', {
          accountchartId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
