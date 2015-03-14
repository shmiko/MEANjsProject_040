'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dmap = mongoose.model('Dmap'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dmap;

/**
 * Dmap routes tests
 */
describe('Dmap CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dmap
		user.save(function() {
			dmap = {
				name: 'Dmap Name'
			};

			done();
		});
	});

	it('should be able to save Dmap instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dmap
				agent.post('/api/dmaps')
					.send(dmap)
					.expect(200)
					.end(function(dmapSaveErr, dmapSaveRes) {
						// Handle Dmap save error
						if (dmapSaveErr) done(dmapSaveErr);

						// Get a list of Dmaps
						agent.get('/api/dmaps')
							.end(function(dmapsGetErr, dmapsGetRes) {
								// Handle Dmap save error
								if (dmapsGetErr) done(dmapsGetErr);

								// Get Dmaps list
								var dmaps = dmapsGetRes.body;

								// Set assertions
								(dmaps[0].user._id).should.equal(userId);
								(dmaps[0].name).should.match('Dmap Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dmap instance if not logged in', function(done) {
		agent.post('/api/dmaps')
			.send(dmap)
			.expect(403)
			.end(function(dmapSaveErr, dmapSaveRes) {
				// Call the assertion callback
				done(dmapSaveErr);
			});
	});

	it('should not be able to save Dmap instance if no name is provided', function(done) {
		// Invalidate name field
		dmap.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dmap
				agent.post('/api/dmaps')
					.send(dmap)
					.expect(400)
					.end(function(dmapSaveErr, dmapSaveRes) {
						// Set message assertion
						(dmapSaveRes.body.message).should.match('Please fill Dmap name');
						
						// Handle Dmap save error
						done(dmapSaveErr);
					});
			});
	});

	it('should be able to update Dmap instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dmap
				agent.post('/api/dmaps')
					.send(dmap)
					.expect(200)
					.end(function(dmapSaveErr, dmapSaveRes) {
						// Handle Dmap save error
						if (dmapSaveErr) done(dmapSaveErr);

						// Update Dmap name
						dmap.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dmap
						agent.put('/api/dmaps/' + dmapSaveRes.body._id)
							.send(dmap)
							.expect(200)
							.end(function(dmapUpdateErr, dmapUpdateRes) {
								// Handle Dmap update error
								if (dmapUpdateErr) done(dmapUpdateErr);

								// Set assertions
								(dmapUpdateRes.body._id).should.equal(dmapSaveRes.body._id);
								(dmapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dmaps if not signed in', function(done) {
		// Create new Dmap model instance
		var dmapObj = new Dmap(dmap);

		// Save the Dmap
		dmapObj.save(function() {
			// Request Dmaps
			request(app).get('/api/dmaps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dmap if not signed in', function(done) {
		// Create new Dmap model instance
		var dmapObj = new Dmap(dmap);

		// Save the Dmap
		dmapObj.save(function() {
			request(app).get('/api/dmaps/' + dmapObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dmap.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dmap instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dmap
				agent.post('/api/dmaps')
					.send(dmap)
					.expect(200)
					.end(function(dmapSaveErr, dmapSaveRes) {
						// Handle Dmap save error
						if (dmapSaveErr) done(dmapSaveErr);

						// Delete existing Dmap
						agent.delete('/api/dmaps/' + dmapSaveRes.body._id)
							.send(dmap)
							.expect(200)
							.end(function(dmapDeleteErr, dmapDeleteRes) {
								// Handle Dmap error error
								if (dmapDeleteErr) done(dmapDeleteErr);

								// Set assertions
								(dmapDeleteRes.body._id).should.equal(dmapSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dmap instance if not signed in', function(done) {
		// Set Dmap user 
		dmap.user = user;

		// Create new Dmap model instance
		var dmapObj = new Dmap(dmap);

		// Save the Dmap
		dmapObj.save(function() {
			// Try deleting Dmap
			request(app).delete('/api/dmaps/' + dmapObj._id)
			.expect(403)
			.end(function(dmapDeleteErr, dmapDeleteRes) {
				// Set message assertion
				(dmapDeleteRes.body.message).should.match('User is not authorized');

				// Handle Dmap error error
				done(dmapDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Dmap.remove().exec(function(){
				done();
			});
		});
	});
});
