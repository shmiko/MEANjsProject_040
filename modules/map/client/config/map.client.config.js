'use strict';

// Configuring the Customers module
angular.module('Map').run(['Menus',
	function(Menus) {
		console.log('adding menu', Menus);
		// Add the customers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Map',
			state: 'map',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'map', {
			title: 'Show Map',
			state: 'map.list'
		});

		
	}
]);
