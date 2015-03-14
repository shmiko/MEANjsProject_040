'use strict';

// Dmaps controller
angular.module('dmaps').controller('DmapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dmaps',
	function($scope, $stateParams, $location, Authentication, Dmaps ) {
		$scope.authentication = Authentication;

		// Create new Dmap
		$scope.create = function() {
			// Create new Dmap object
			var dmap = new Dmaps ({
				name: this.name
			});

			// Redirect after save
			dmap.$save(function(response) {
				$location.path('dmaps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dmap
		$scope.remove = function( dmap ) {
			if ( dmap ) { dmap.$remove();

				for (var i in $scope.dmaps ) {
					if ($scope.dmaps [i] === dmap ) {
						$scope.dmaps.splice(i, 1);
					}
				}
			} else {
				$scope.dmap.$remove(function() {
					$location.path('dmaps');
				});
			}
		};

		// Update existing Dmap
		$scope.update = function() {
			var dmap = $scope.dmap ;

			dmap.$update(function() {
				$location.path('dmaps/' + dmap._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dmaps
		$scope.find = function() {
			$scope.dmaps = Dmaps.query();
		};

		// Find existing Dmap
		$scope.findOne = function() {
			$scope.dmap = Dmaps.get({ 
				dmapId: $stateParams.dmapId
			});
		};
	}
]);