'use strict';

module.exports = function(app) {
	var map = require('../controllers/map.server.controller');
	var mapPolicy = require('../policies/map.server.policy');

	// Its Routes
	app.route('/api/map').all()
		.get(map.list).all(mapPolicy.isAllowed)
		.post(map.create);

	app.route('/api/map/:mapId').all(mapPolicy.isAllowed)
		.get(map.read)
		.put(map.update)
		.delete(map.delete);

	// Finish by binding the It middleware
	app.param('mapId', map.mapByID);
};