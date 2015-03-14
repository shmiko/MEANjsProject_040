'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Cal = mongoose.model('Cal'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Cal
 */
exports.create = function(req, res) {
	var cal = new Cal(req.body);
	cal.user = req.user;

	cal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cal);
		}
	});
};

/**
 * Show the current Cal
 */
exports.read = function(req, res) {
	res.jsonp(req.cal);
};

/**
 * Update a Cal
 */
exports.update = function(req, res) {
	var cal = req.cal ;

	cal = _.extend(cal , req.body);

	cal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cal);
		}
	});
};

/**
 * Delete an Cal
 */
exports.delete = function(req, res) {
	var cal = req.cal ;

	cal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cal);
		}
	});
};

/**
 * List of Cals
 */
exports.list = function(req, res) { Cal.find().sort('-created').populate('user', 'displayName').exec(function(err, cals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cals);
		}
	});
};

/**
 * Cal middleware
 */
exports.calByID = function(req, res, next, id) { Cal.findById(id).populate('user', 'displayName').exec(function(err, cal) {
		if (err) return next(err);
		if (! cal) return next(new Error('Failed to load Cal ' + id));
		req.cal = cal ;
		next();
	});
};