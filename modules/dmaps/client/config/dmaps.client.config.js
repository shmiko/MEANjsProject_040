'use strict';

// Configuring the Dmaps module
angular.module('dmaps').run(['Menus',
	function(Menus) {
		// Add the Dmaps dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Dmaps',
			state: 'dmaps',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'dmaps', {
			title: 'List Dmaps',
			state: 'dmaps.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'dmaps', {
			title: 'Create Dmap',
			state: 'dmaps.create'
		});
	}
]);