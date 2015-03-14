'use strict';

module.exports = function(app) {
	var its = require('../controllers/its.server.controller');
	var itsPolicy = require('../policies/its.server.policy');

	// Its Routes
	app.route('/api/its').all()
		.get(its.list).all(itsPolicy.isAllowed)
		.post(its.create);

	app.route('/api/its/:itId').all(itsPolicy.isAllowed)
		.get(its.read)
		.put(its.update)
		.delete(its.delete);

	// Finish by binding the It middleware
	app.param('itId', its.itByID);
};