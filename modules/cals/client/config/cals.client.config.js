'use strict';

// Configuring the Cals module
angular.module('cals').run(['Menus',
	function(Menus) {
		// Add the Cals dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Cals',
			state: 'cals',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'cals', {
			title: 'List Cals',
			state: 'cals.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'cals', {
			title: 'Create Cal',
			state: 'cals.create'
		});
	}
]);