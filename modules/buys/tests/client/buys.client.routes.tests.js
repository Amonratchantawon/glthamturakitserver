(function () {
  'use strict';

  describe('Buys Route Tests', function () {
    // Initialize global variables
    var $scope,
      BuysService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BuysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BuysService = _BuysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('buys');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/buys');
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
          BuysController,
          mockBuy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('buys.view');
          $templateCache.put('modules/buys/client/views/view-buy.client.view.html', '');

          // create mock Buy
          mockBuy = new BuysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Buy Name'
          });

          // Initialize Controller
          BuysController = $controller('BuysController as vm', {
            $scope: $scope,
            buyResolve: mockBuy
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:buyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.buyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            buyId: 1
          })).toEqual('/buys/1');
        }));

        it('should attach an Buy to the controller scope', function () {
          expect($scope.vm.buy._id).toBe(mockBuy._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/buys/client/views/view-buy.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BuysController,
          mockBuy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('buys.create');
          $templateCache.put('modules/buys/client/views/form-buy.client.view.html', '');

          // create mock Buy
          mockBuy = new BuysService();

          // Initialize Controller
          BuysController = $controller('BuysController as vm', {
            $scope: $scope,
            buyResolve: mockBuy
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.buyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/buys/create');
        }));

        it('should attach an Buy to the controller scope', function () {
          expect($scope.vm.buy._id).toBe(mockBuy._id);
          expect($scope.vm.buy._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/buys/client/views/form-buy.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BuysController,
          mockBuy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('buys.edit');
          $templateCache.put('modules/buys/client/views/form-buy.client.view.html', '');

          // create mock Buy
          mockBuy = new BuysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Buy Name'
          });

          // Initialize Controller
          BuysController = $controller('BuysController as vm', {
            $scope: $scope,
            buyResolve: mockBuy
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:buyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.buyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            buyId: 1
          })).toEqual('/buys/1/edit');
        }));

        it('should attach an Buy to the controller scope', function () {
          expect($scope.vm.buy._id).toBe(mockBuy._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/buys/client/views/form-buy.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
