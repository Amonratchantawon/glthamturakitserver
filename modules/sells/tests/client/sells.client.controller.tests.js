(function () {
  'use strict';

  describe('Sells Controller Tests', function () {
    // Initialize global variables
    var SellsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SellsService,
      mockSell;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SellsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SellsService = _SellsService_;

      // create mock Sell
      mockSell = new SellsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Sell Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sells controller.
      SellsController = $controller('SellsController as vm', {
        $scope: $scope,
        sellResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSellPostData;

      beforeEach(function () {
        // Create a sample Sell object
        sampleSellPostData = new SellsService({
          name: 'Sell Name'
        });

        $scope.vm.sell = sampleSellPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SellsService) {
        // Set POST response
        $httpBackend.expectPOST('api/sells', sampleSellPostData).respond(mockSell);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Sell was created
        expect($state.go).toHaveBeenCalledWith('sells.view', {
          sellId: mockSell._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sells', sampleSellPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Sell in $scope
        $scope.vm.sell = mockSell;
      });

      it('should update a valid Sell', inject(function (SellsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sells\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('sells.view', {
          sellId: mockSell._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SellsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sells\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Sells
        $scope.vm.sell = mockSell;
      });

      it('should delete the Sell and redirect to Sells', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/sells\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('sells.list');
      });

      it('should should not delete the Sell and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
