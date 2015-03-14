'use strict';

module.exports = function(app) {
	var dmaps = require('../controllers/dmaps.server.controller');
	var dmapsPolicy = require('../policies/dmaps.server.policy');

	// Dmaps Routes
	app.route('/api/dmaps').all()
		.get(dmaps.list).all(dmapsPolicy.isAllowed)
		.post(dmaps.create);

	app.route('/api/dmaps/:dmapId').all(dmapsPolicy.isAllowed)
		.get(dmaps.read)
		.put(dmaps.update)
		.delete(dmaps.delete);

	// Finish by binding the Dmap middleware
	app.param('dmapId', dmaps.dmapByID);
};