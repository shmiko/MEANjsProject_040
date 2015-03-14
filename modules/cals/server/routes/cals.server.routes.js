'use strict';

module.exports = function(app) {
	var cals = require('../controllers/cals.server.controller');
	var calsPolicy = require('../policies/cals.server.policy');

	// Cals Routes
	app.route('/api/cals').all()
		.get(cals.list).all(calsPolicy.isAllowed)
		.post(cals.create);

	app.route('/api/cals/:calId').all(calsPolicy.isAllowed)
		.get(cals.read)
		.put(cals.update)
		.delete(cals.delete);

	// Finish by binding the Cal middleware
	app.param('calId', cals.calByID);
};