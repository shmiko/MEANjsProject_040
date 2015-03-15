'use strict';

// Setting up route
angular.module('map').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('map', {
			url: '',
			templateUrl: 'modules/map/marker-clusterer.html'
		});
	}
]);
