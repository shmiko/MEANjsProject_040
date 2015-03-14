'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Dmap = mongoose.model('Dmap'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Dmap
 */
exports.create = function(req, res) {
	var dmap = new Dmap(req.body);
	dmap.user = req.user;

	dmap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dmap);
		}
	});
};

/**
 * Show the current Dmap
 */
exports.read = function(req, res) {
	res.jsonp(req.dmap);
};

/**
 * Update a Dmap
 */
exports.update = function(req, res) {
	var dmap = req.dmap ;

	dmap = _.extend(dmap , req.body);

	dmap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dmap);
		}
	});
};

/**
 * Delete an Dmap
 */
exports.delete = function(req, res) {
	var dmap = req.dmap ;

	dmap.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dmap);
		}
	});
};

/**
 * List of Dmaps
 */
exports.list = function(req, res) { Dmap.find().sort('-created').populate('user', 'displayName').exec(function(err, dmaps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dmaps);
		}
	});
};

/**
 * Dmap middleware
 */
exports.dmapByID = function(req, res, next, id) { Dmap.findById(id).populate('user', 'displayName').exec(function(err, dmap) {
		if (err) return next(err);
		if (! dmap) return next(new Error('Failed to load Dmap ' + id));
		req.dmap = dmap ;
		next();
	});
};