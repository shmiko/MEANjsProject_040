'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	It = mongoose.model('It'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a It
 */
exports.create = function(req, res) {
	var it = new It(req.body);
	it.user = req.user;

	it.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(it);
		}
	});
};

/**
 * Show the current It
 */
exports.read = function(req, res) {
	res.jsonp(req.it);
};

/**
 * Update a It
 */
exports.update = function(req, res) {
	var it = req.it ;

	it = _.extend(it , req.body);

	it.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(it);
		}
	});
};

/**
 * Delete an It
 */
exports.delete = function(req, res) {
	var it = req.it ;

	it.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(it);
		}
	});
};

/**
 * List of Its
 */
exports.list = function(req, res) { It.find().sort('-created').populate('user', 'displayName').exec(function(err, its) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(its);
		}
	});
};

/**
 * It middleware
 */
exports.itByID = function(req, res, next, id) { It.findById(id).populate('user', 'displayName').exec(function(err, it) {
		if (err) return next(err);
		if (! it) return next(new Error('Failed to load It ' + id));
		req.it = it ;
		next();
	});
};