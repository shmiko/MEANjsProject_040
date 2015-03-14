'use strict';

//Setting up route
angular.module('dmaps').config(['$stateProvider',
	function($stateProvider) {
		// Dmaps state routing
		$stateProvider.
		state('dmaps', {
			abstract: true,
			url: '/dmaps',
			template: '<ui-view/>'
		}).
		state('dmaps.list', {
			url: '',
			templateUrl: 'modules/dmaps/views/list-dmaps.client.view.html'
		}).
		state('dmaps.create', {
			url: '/create',
			templateUrl: 'modules/dmaps/views/create-dmap.client.view.html'
		}).
		state('dmaps.view', {
			url: '/:dmapId',
			templateUrl: 'modules/dmaps/views/view-dmap.client.view.html'
		}).
		state('dmaps.edit', {
			url: '/:dmapId/edit',
			templateUrl: 'modules/dmaps/views/edit-dmap.client.view.html'
		});
	}
]);