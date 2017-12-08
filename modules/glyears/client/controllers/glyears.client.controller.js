(function () {
  'use strict';

  // Glyears controller
  angular
    .module('glyears')
    .controller('GlyearsController', GlyearsController);

  GlyearsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'glyearResolve'];

  function GlyearsController ($scope, $state, $window, Authentication, glyear) {
    var vm = this;

    vm.authentication = Authentication;
    vm.glyear = glyear;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Glyear
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.glyear.$remove($state.go('glyears.list'));
      }
    }

    // Save Glyear
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.glyearForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.glyear._id) {
        vm.glyear.$update(successCallback, errorCallback);
      } else {
        vm.glyear.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('glyears.view', {
          glyearId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
