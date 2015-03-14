'use strict';

//Setting up route
angular.module('cals').config(['$stateProvider',
	function($stateProvider) {
		// Cals state routing
		$stateProvider.
		state('cals', {
			abstract: true,
			url: '/cals',
			template: '<ui-view/>'
		}).
		state('cals.list', {
			url: '',
			templateUrl: 'modules/cals/views/list-cals.client.view.html'
		}).
		state('cals.create', {
			url: '/create',
			templateUrl: 'modules/cals/views/create-cal.client.view.html'
		}).
		state('cals.view', {
			url: '/:calId',
			templateUrl: 'modules/cals/views/view-cal.client.view.html'
		}).
		state('cals.edit', {
			url: '/:calId/edit',
			templateUrl: 'modules/cals/views/edit-cal.client.view.html'
		});
	}
]);