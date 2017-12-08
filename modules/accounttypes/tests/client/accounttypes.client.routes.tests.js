(function () {
  'use strict';

  describe('Accounttypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      AccounttypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AccounttypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AccounttypesService = _AccounttypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('accounttypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/accounttypes');
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
          AccounttypesController,
          mockAccounttype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('accounttypes.view');
          $templateCache.put('modules/accounttypes/client/views/view-accounttype.client.view.html', '');

          // create mock Accounttype
          mockAccounttype = new AccounttypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accounttype Name'
          });

          // Initialize Controller
          AccounttypesController = $controller('AccounttypesController as vm', {
            $scope: $scope,
            accounttypeResolve: mockAccounttype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:accounttypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.accounttypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            accounttypeId: 1
          })).toEqual('/accounttypes/1');
        }));

        it('should attach an Accounttype to the controller scope', function () {
          expect($scope.vm.accounttype._id).toBe(mockAccounttype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/accounttypes/client/views/view-accounttype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AccounttypesController,
          mockAccounttype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('accounttypes.create');
          $templateCache.put('modules/accounttypes/client/views/form-accounttype.client.view.html', '');

          // create mock Accounttype
          mockAccounttype = new AccounttypesService();

          // Initialize Controller
          AccounttypesController = $controller('AccounttypesController as vm', {
            $scope: $scope,
            accounttypeResolve: mockAccounttype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.accounttypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/accounttypes/create');
        }));

        it('should attach an Accounttype to the controller scope', function () {
          expect($scope.vm.accounttype._id).toBe(mockAccounttype._id);
          expect($scope.vm.accounttype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/accounttypes/client/views/form-accounttype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AccounttypesController,
          mockAccounttype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('accounttypes.edit');
          $templateCache.put('modules/accounttypes/client/views/form-accounttype.client.view.html', '');

          // create mock Accounttype
          mockAccounttype = new AccounttypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Accounttype Name'
          });

          // Initialize Controller
          AccounttypesController = $controller('AccounttypesController as vm', {
            $scope: $scope,
            accounttypeResolve: mockAccounttype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:accounttypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.accounttypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            accounttypeId: 1
          })).toEqual('/accounttypes/1/edit');
        }));

        it('should attach an Accounttype to the controller scope', function () {
          expect($scope.vm.accounttype._id).toBe(mockAccounttype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/accounttypes/client/views/form-accounttype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
