(function () {
  'use strict';

  describe('Sells Route Tests', function () {
    // Initialize global variables
    var $scope,
      SellsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SellsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SellsService = _SellsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sells');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sells');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SellsController,
          mockSell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sells.view');
          $templateCache.put('modules/sells/client/views/view-sell.client.view.html', '');

          // create mock Sell
          mockSell = new SellsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sell Name'
          });

          // Initialize Controller
          SellsController = $controller('SellsController as vm', {
            $scope: $scope,
            sellResolve: mockSell
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sellId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sellId: 1
          })).toEqual('/sells/1');
        }));

        it('should attach an Sell to the controller scope', function () {
          expect($scope.vm.sell._id).toBe(mockSell._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sells/client/views/view-sell.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SellsController,
          mockSell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sells.create');
          $templateCache.put('modules/sells/client/views/form-sell.client.view.html', '');

          // create mock Sell
          mockSell = new SellsService();

          // Initialize Controller
          SellsController = $controller('SellsController as vm', {
            $scope: $scope,
            sellResolve: mockSell
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sells/create');
        }));

        it('should attach an Sell to the controller scope', function () {
          expect($scope.vm.sell._id).toBe(mockSell._id);
          expect($scope.vm.sell._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sells/client/views/form-sell.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SellsController,
          mockSell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sells.edit');
          $templateCache.put('modules/sells/client/views/form-sell.client.view.html', '');

          // create mock Sell
          mockSell = new SellsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sell Name'
          });

          // Initialize Controller
          SellsController = $controller('SellsController as vm', {
            $scope: $scope,
            sellResolve: mockSell
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sellId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sellId: 1
          })).toEqual('/sells/1/edit');
        }));

        it('should attach an Sell to the controller scope', function () {
          expect($scope.vm.sell._id).toBe(mockSell._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sells/client/views/form-sell.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
