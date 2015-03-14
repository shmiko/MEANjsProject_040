'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cal = mongoose.model('Cal'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, cal;

/**
 * Cal routes tests
 */
describe('Cal CRUD tests', function() {
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

		// Save a user to the test db and create new Cal
		user.save(function() {
			cal = {
				name: 'Cal Name'
			};

			done();
		});
	});

	it('should be able to save Cal instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cal
				agent.post('/api/cals')
					.send(cal)
					.expect(200)
					.end(function(calSaveErr, calSaveRes) {
						// Handle Cal save error
						if (calSaveErr) done(calSaveErr);

						// Get a list of Cals
						agent.get('/api/cals')
							.end(function(calsGetErr, calsGetRes) {
								// Handle Cal save error
								if (calsGetErr) done(calsGetErr);

								// Get Cals list
								var cals = calsGetRes.body;

								// Set assertions
								(cals[0].user._id).should.equal(userId);
								(cals[0].name).should.match('Cal Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cal instance if not logged in', function(done) {
		agent.post('/api/cals')
			.send(cal)
			.expect(403)
			.end(function(calSaveErr, calSaveRes) {
				// Call the assertion callback
				done(calSaveErr);
			});
	});

	it('should not be able to save Cal instance if no name is provided', function(done) {
		// Invalidate name field
		cal.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cal
				agent.post('/api/cals')
					.send(cal)
					.expect(400)
					.end(function(calSaveErr, calSaveRes) {
						// Set message assertion
						(calSaveRes.body.message).should.match('Please fill Cal name');
						
						// Handle Cal save error
						done(calSaveErr);
					});
			});
	});

	it('should be able to update Cal instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cal
				agent.post('/api/cals')
					.send(cal)
					.expect(200)
					.end(function(calSaveErr, calSaveRes) {
						// Handle Cal save error
						if (calSaveErr) done(calSaveErr);

						// Update Cal name
						cal.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cal
						agent.put('/api/cals/' + calSaveRes.body._id)
							.send(cal)
							.expect(200)
							.end(function(calUpdateErr, calUpdateRes) {
								// Handle Cal update error
								if (calUpdateErr) done(calUpdateErr);

								// Set assertions
								(calUpdateRes.body._id).should.equal(calSaveRes.body._id);
								(calUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cals if not signed in', function(done) {
		// Create new Cal model instance
		var calObj = new Cal(cal);

		// Save the Cal
		calObj.save(function() {
			// Request Cals
			request(app).get('/api/cals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cal if not signed in', function(done) {
		// Create new Cal model instance
		var calObj = new Cal(cal);

		// Save the Cal
		calObj.save(function() {
			request(app).get('/api/cals/' + calObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cal.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cal instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cal
				agent.post('/api/cals')
					.send(cal)
					.expect(200)
					.end(function(calSaveErr, calSaveRes) {
						// Handle Cal save error
						if (calSaveErr) done(calSaveErr);

						// Delete existing Cal
						agent.delete('/api/cals/' + calSaveRes.body._id)
							.send(cal)
							.expect(200)
							.end(function(calDeleteErr, calDeleteRes) {
								// Handle Cal error error
								if (calDeleteErr) done(calDeleteErr);

								// Set assertions
								(calDeleteRes.body._id).should.equal(calSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cal instance if not signed in', function(done) {
		// Set Cal user 
		cal.user = user;

		// Create new Cal model instance
		var calObj = new Cal(cal);

		// Save the Cal
		calObj.save(function() {
			// Try deleting Cal
			request(app).delete('/api/cals/' + calObj._id)
			.expect(403)
			.end(function(calDeleteErr, calDeleteRes) {
				// Set message assertion
				(calDeleteRes.body.message).should.match('User is not authorized');

				// Handle Cal error error
				done(calDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Cal.remove().exec(function(){
				done();
			});
		});
	});
});
