(function () {
  'use strict';

  describe('Accountcharts Route Tests', function () {
    // Initialize global variables
    var $scope,
      AccountchartsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AccountchartsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AccountchartsService = _AccountchartsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('accountcharts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/accountcharts');
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
          AccountchartsController,
          mockAccountchart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('accountcharts.view');
          $templateCache.put('modules/accountcharts/client/views/view-accountchart.client.view.html', '');

          // create mock Accountchart
          mockAccountchart = new AccountchartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accountchart Name'
          });

          // Initialize Controller
          AccountchartsController = $controller('AccountchartsController as vm', {
            $scope: $scope,
            accountchartResolve: mockAccountchart
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:accountchartId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.accountchartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            accountchartId: 1
          })).toEqual('/accountcharts/1');
        }));

        it('should attach an Accountchart to the controller scope', function () {
          expect($scope.vm.accountchart._id).toBe(mockAccountchart._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/accountcharts/client/views/view-accountchart.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AccountchartsController,
          mockAccountchart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('accountcharts.create');
          $templateCache.put('modules/accountcharts/client/views/form-accountchart.client.view.html', '');

          // create mock Accountchart
          mockAccountchart = new AccountchartsService();

          // Initialize Controller
          AccountchartsController = $controller('AccountchartsController as vm', {
            $scope: $scope,
            accountchartResolve: mockAccountchart
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.accountchartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/accountcharts/create');
        }));

        it('should attach an Accountchart to the controller scope', function () {
          expect($scope.vm.accountchart._id).toBe(mockAccountchart._id);
          expect($scope.vm.accountchart._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/accountcharts/client/views/form-accountchart.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AccountchartsController,
          mockAccountchart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('accountcharts.edit');
          $templateCache.put('modules/accountcharts/client/views/form-accountchart.client.view.html', '');

          // create mock Accountchart
          mockAccountchart = new AccountchartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accountchart Name'
          });

          // Initialize Controller
          AccountchartsController = $controller('AccountchartsController as vm', {
            $scope: $scope,
            accountchartResolve: mockAccountchart
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:accountchartId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.accountchartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            accountchartId: 1
          })).toEqual('/accountcharts/1/edit');
        }));

        it('should attach an Accountchart to the controller scope', function () {
          expect($scope.vm.accountchart._id).toBe(mockAccountchart._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/accountcharts/client/views/form-accountchart.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
