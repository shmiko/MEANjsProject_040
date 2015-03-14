'use strict';

//Dmaps service used to communicate Dmaps REST endpoints
angular.module('dmaps').factory('Dmaps', ['$resource',
	function($resource) {
		return $resource('api/dmaps/:dmapId', { dmapId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);