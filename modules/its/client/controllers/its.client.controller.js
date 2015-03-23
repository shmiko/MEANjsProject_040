'use strict';

// Its controller
angular.module('its').controller('ItsController', ['$scope', '$stateParams', '$location', 'Authentication', 
	function($scope, $stateParams, $location, Authentication) {
		$scope.authentication = Authentication;

		// Create new It
		$scope.create = function() {
			// Create new It object
			var it = new Its ({
				name: this.name
			});

			// Redirect after save
			it.$save(function(response) {
				$location.path('its/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing It
		$scope.remove = function( it ) {
			if ( it ) { it.$remove();

				for (var i in $scope.its ) {
					if ($scope.its [i] === it ) {
						$scope.its.splice(i, 1);
					}
				}
			} else {
				$scope.it.$remove(function() {
					$location.path('its');
				});
			}
		};

		// Update existing It
		$scope.update = function() {
			var it = $scope.it ;

			it.$update(function() {
				$location.path('its/' + it._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Its
		$scope.find = function() {
			$scope.its = Its.query();
		};

		// Find existing It
		$scope.findOne = function() {
			$scope.it = Its.get({ 
				itId: $stateParams.itId
			});
		};
	}
]);