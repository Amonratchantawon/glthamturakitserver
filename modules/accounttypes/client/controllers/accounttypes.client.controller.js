(function () {
  'use strict';

  // Accounttypes controller
  angular
    .module('accounttypes')
    .controller('AccounttypesController', AccounttypesController);

  AccounttypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'accounttypeResolve'];

  function AccounttypesController ($scope, $state, $window, Authentication, accounttype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.accounttype = accounttype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Accounttype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.accounttype.$remove($state.go('accounttypes.list'));
      }
    }

    // Save Accounttype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accounttypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.accounttype._id) {
        vm.accounttype.$update(successCallback, errorCallback);
      } else {
        vm.accounttype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accounttypes.view', {
          accounttypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
