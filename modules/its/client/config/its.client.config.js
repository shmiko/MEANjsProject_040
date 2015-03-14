'use strict';

// Configuring the Its module
angular.module('its').run(['Menus',
	function(Menus) {
		// Add the Its dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Its',
			state: 'its',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'its', {
			title: 'List Its',
			state: 'its.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'its', {
			title: 'Create It',
			state: 'its.create'
		});
	}
]);