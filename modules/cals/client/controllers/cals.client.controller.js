'use strict';

// Cals controller
angular.module('cals').controller('CalsController',['$scope', '$stateParams', '$location', 'Authentication', 'Cals','ui.calendar',
	function($scope, $stateParams, $location, Authentication, Cals, ui.calendar ) {
		$scope.authentication = Authentication;
		$scope.eventSources = [];
		
		// Create new Cal
		$scope.create = function() {
			// Create new Cal object
			var cal = new Cals ({
				name: this.name
			});

			// Redirect after save
			cal.$save(function(response) {
				$location.path('cals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cal
		$scope.remove = function( cal ) {
			if ( cal ) { cal.$remove();

				for (var i in $scope.cals ) {
					if ($scope.cals [i] === cal ) {
						$scope.cals.splice(i, 1);
					}
				}
			} else {
				$scope.cal.$remove(function() {
					$location.path('cals');
				});
			}
		};

		// Update existing Cal
		$scope.update = function() {
			var cal = $scope.cal ;

			cal.$update(function() {
				$location.path('cals/' + cal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cals
		$scope.find = function() {
			var lost;
			$scope.cals = Cals.query();
		};

		// Find existing Cal
		$scope.findOne = function() {
			$scope.cal = Cals.get({ 
				calId: $stateParams.calId
			});
		};

		
	}
]);
