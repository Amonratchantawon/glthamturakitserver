(function () {
  'use strict';

  // Glmonths controller
  angular
    .module('glmonths')
    .controller('GlmonthsController', GlmonthsController);

  GlmonthsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'glmonthResolve'];

  function GlmonthsController ($scope, $state, $window, Authentication, glmonth) {
    var vm = this;

    vm.authentication = Authentication;
    vm.glmonth = glmonth;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Glmonth
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.glmonth.$remove($state.go('glmonths.list'));
      }
    }

    // Save Glmonth
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.glmonthForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.glmonth._id) {
        vm.glmonth.$update(successCallback, errorCallback);
      } else {
        vm.glmonth.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('glmonths.view', {
          glmonthId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
