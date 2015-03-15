'use strict';

// Setting up route
angular.module('Map').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('map', {
			abstract: true,
			url: '/map',
			template: '<ui-view/>'
		}).
		state('map.list', {
			url: '',
			templateUrl: 'modules/map/views/list-map.client.view.html'
		});
	}
]);
 