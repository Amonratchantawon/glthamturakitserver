'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', '$window',
    function($scope, Authentication, $state, $window) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        // Some example string
        if (!$scope.authentication.user) {
            $state.go('authentication.signin');
        } else {
            //$scope.helloText = 'สวัสดี คุณ ' + $scope.authentication.user.displayName;
            $state.go('home');
            // window.location.href = '/products';
            // $state.reload('products.list');
            // window.location.reload('/products');
        }
        // $scope.descriptionText = 'คุณต้องการจัดการเรื่องอะไร';

    }
]);