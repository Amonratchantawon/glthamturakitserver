'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
    function($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) {
            $location.path('/');
        }


        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        $scope.signup = function(isValid) {
            $scope.startCall = true;
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                $scope.startCall = false;
                return false;
            }

            $http.post('/api/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.startCall = false;
                $scope.authentication.user = response;

                // toastr.success("<div><div class='toast-title'>สวัสดี</div><div class='toast-message'>" + response.displayName + "</div></div>");
                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function(response) {
                $scope.startCall = false;
                $scope.error = response.message;
            });
        };

        $scope.signin = function(isValid) {
            $scope.startCall = true;
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                $scope.startCall = false;
                return false;
            }

            $http.post('/api/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.startCall = false;
                $scope.authentication.user = response;

                // toastr.success("<div><div class='toast-title'>สวัสดี</div><div class='toast-message'>" + response.displayName + "</div></div>");
                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function(response) {
                $scope.startCall = false;
                $scope.error = response.message;
                if ($scope.error.indexOf('Invalid') !== -1) {
                    $scope.newError = 'ชื่อผู้ใช้หรือรหัสผ่านผิด';
                } else {
                    $scope.newError = $scope.error;
                }
            });
        };

        // OAuth provider request
        $scope.callOauthProvider = function(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        };
    }
]);