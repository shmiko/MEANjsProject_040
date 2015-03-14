'use strict';

//Cals service used to communicate Cals REST endpoints
angular.module('cals').factory('Cals', ['$resource',
	function($resource) {
		return $resource('api/cals/:calId', { calId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);