'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	map = mongoose.model('Map'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a map
 */
exports.create = function(req, res) {
	var map = new map(req.body);
	map.user = req.user;

	map.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(map);
		}
	});
};

/**
 * Show the current map
 */
exports.read = function(req, res) {
	res.jsonp(req.map);
};

/**
 * Update a map
 */
exports.update = function(req, res) {
	var map = req.map ;

	map = _.extend(map , req.body);

	map.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(map);
		}
	});
};

/**
 * Delete an map
 */
exports.delete = function(req, res) {
	var map = req.map ;

	map.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(map);
		}
	});
};

/**
 * List of maps
 */
exports.list = function(req, res) { map.find().sort('-created').populate('user', 'displayName').exec(function(err, maps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maps);
		}
	});
};

/**
 * map middleware
 */
exports.mapByID = function(req, res, next, id) { map.findById(id).populate('user', 'displayName').exec(function(err, map) {
		if (err) return next(err);
		if (! map) return next(new Error('Failed to load map ' + id));
		req.map = map ;
		next();
	});
};