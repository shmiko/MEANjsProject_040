'use strict';

(function() {
	// Its Controller Spec
	describe('Its Controller Tests', function() {
		// Initialize global variables
		var ItsController,
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

			// Initialize the Its controller.
			ItsController = $controller('ItsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one It object fetched from XHR', inject(function(Its) {
			// Create sample It using the Its service
			var sampleIt = new Its({
				name: 'New It'
			});

			// Create a sample Its array that includes the new It
			var sampleIts = [sampleIt];

			// Set GET response
			$httpBackend.expectGET('api/its').respond(sampleIts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.its).toEqualData(sampleIts);
		}));

		it('$scope.findOne() should create an array with one It object fetched from XHR using a itId URL parameter', inject(function(Its) {
			// Define a sample It object
			var sampleIt = new Its({
				name: 'New It'
			});

			// Set the URL parameter
			$stateParams.itId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/its\/([0-9a-fA-F]{24})$/).respond(sampleIt);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.it).toEqualData(sampleIt);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Its) {
			// Create a sample It object
			var sampleItPostData = new Its({
				name: 'New It'
			});

			// Create a sample It response
			var sampleItResponse = new Its({
				_id: '525cf20451979dea2c000001',
				name: 'New It'
			});

			// Fixture mock form input values
			scope.name = 'New It';

			// Set POST response
			$httpBackend.expectPOST('api/its', sampleItPostData).respond(sampleItResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the It was created
			expect($location.path()).toBe('/its/' + sampleItResponse._id);
		}));

		it('$scope.update() should update a valid It', inject(function(Its) {
			// Define a sample It put data
			var sampleItPutData = new Its({
				_id: '525cf20451979dea2c000001',
				name: 'New It'
			});

			// Mock It in scope
			scope.it = sampleItPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/its\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/its/' + sampleItPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itId and remove the It from the scope', inject(function(Its) {
			// Create new It object
			var sampleIt = new Its({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Its array and include the It
			scope.its = [sampleIt];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/its\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIt);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.its.length).toBe(0);
		}));
	});
}());