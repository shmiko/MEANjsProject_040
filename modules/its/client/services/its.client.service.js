'use strict';

//Its service used to communicate Its REST endpoints
angular.module('its').factory('Its', ['$resource',
	function($resource) {
		return $resource('api/its/:itId', { itId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);