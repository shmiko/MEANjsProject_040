'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dmap Schema
 */
var DmapSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dmap name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Dmap', DmapSchema);