'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Customer = mongoose.model('Customer'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a customer
 */
exports.create = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user;

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * Show the current customer
 */
exports.read = function(req, res) {
	res.json(req.customer);
};

/**
 * Update a customer
 */
exports.update = function(req, res) {
	var customer = req.customer;

	//customer.title = req.body.title;
	//customer.content = req.body.content;

	//SS- Adding previous code to pick up the req body
	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * Delete an customer
 */
exports.delete = function(req, res) {
	var customer = req.customer;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * List of Customers
 */
exports.list = function(req, res) {
	Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customers);
		}
	});
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {
	Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (!customer) return next(new Error('Failed to load customer ' + id));
		req.customer = customer;
		next();
	});
};
