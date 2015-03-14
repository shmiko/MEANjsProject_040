'use strict';

(function() {
	// Dmaps Controller Spec
	describe('Dmaps Controller Tests', function() {
		// Initialize global variables
		var DmapsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Dmaps controller.
			DmapsController = $controller('DmapsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dmap object fetched from XHR', inject(function(Dmaps) {
			// Create sample Dmap using the Dmaps service
			var sampleDmap = new Dmaps({
				name: 'New Dmap'
			});

			// Create a sample Dmaps array that includes the new Dmap
			var sampleDmaps = [sampleDmap];

			// Set GET response
			$httpBackend.expectGET('api/dmaps').respond(sampleDmaps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dmaps).toEqualData(sampleDmaps);
		}));

		it('$scope.findOne() should create an array with one Dmap object fetched from XHR using a dmapId URL parameter', inject(function(Dmaps) {
			// Define a sample Dmap object
			var sampleDmap = new Dmaps({
				name: 'New Dmap'
			});

			// Set the URL parameter
			$stateParams.dmapId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/dmaps\/([0-9a-fA-F]{24})$/).respond(sampleDmap);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dmap).toEqualData(sampleDmap);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dmaps) {
			// Create a sample Dmap object
			var sampleDmapPostData = new Dmaps({
				name: 'New Dmap'
			});

			// Create a sample Dmap response
			var sampleDmapResponse = new Dmaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Dmap'
			});

			// Fixture mock form input values
			scope.name = 'New Dmap';

			// Set POST response
			$httpBackend.expectPOST('api/dmaps', sampleDmapPostData).respond(sampleDmapResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dmap was created
			expect($location.path()).toBe('/dmaps/' + sampleDmapResponse._id);
		}));

		it('$scope.update() should update a valid Dmap', inject(function(Dmaps) {
			// Define a sample Dmap put data
			var sampleDmapPutData = new Dmaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Dmap'
			});

			// Mock Dmap in scope
			scope.dmap = sampleDmapPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/dmaps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dmaps/' + sampleDmapPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dmapId and remove the Dmap from the scope', inject(function(Dmaps) {
			// Create new Dmap object
			var sampleDmap = new Dmaps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dmaps array and include the Dmap
			scope.dmaps = [sampleDmap];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/dmaps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDmap);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dmaps.length).toBe(0);
		}));
	});
}());