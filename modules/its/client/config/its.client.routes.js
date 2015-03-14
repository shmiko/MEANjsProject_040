'use strict';

//Setting up route
angular.module('its').config(['$stateProvider',
	function($stateProvider) {
		// Its state routing
		$stateProvider.
		state('its', {
			abstract: true,
			url: '/its',
			template: '<ui-view/>'
		}).
		state('its.list', {
			url: '',
			templateUrl: 'modules/its/views/list-its.client.view.html'
		}).
		state('its.create', {
			url: '/create',
			templateUrl: 'modules/its/views/create-it.client.view.html'
		}).
		state('its.view', {
			url: '/:itId',
			templateUrl: 'modules/its/views/view-it.client.view.html'
		}).
		state('its.edit', {
			url: '/:itId/edit',
			templateUrl: 'modules/its/views/edit-it.client.view.html'
		});
	}
]);