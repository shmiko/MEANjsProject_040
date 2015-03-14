'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	It = mongoose.model('It'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, it;

/**
 * It routes tests
 */
describe('It CRUD tests', function() {
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

		// Save a user to the test db and create new It
		user.save(function() {
			it = {
				name: 'It Name'
			};

			done();
		});
	});

	it('should be able to save It instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new It
				agent.post('/api/its')
					.send(it)
					.expect(200)
					.end(function(itSaveErr, itSaveRes) {
						// Handle It save error
						if (itSaveErr) done(itSaveErr);

						// Get a list of Its
						agent.get('/api/its')
							.end(function(itsGetErr, itsGetRes) {
								// Handle It save error
								if (itsGetErr) done(itsGetErr);

								// Get Its list
								var its = itsGetRes.body;

								// Set assertions
								(its[0].user._id).should.equal(userId);
								(its[0].name).should.match('It Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save It instance if not logged in', function(done) {
		agent.post('/api/its')
			.send(it)
			.expect(403)
			.end(function(itSaveErr, itSaveRes) {
				// Call the assertion callback
				done(itSaveErr);
			});
	});

	it('should not be able to save It instance if no name is provided', function(done) {
		// Invalidate name field
		it.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new It
				agent.post('/api/its')
					.send(it)
					.expect(400)
					.end(function(itSaveErr, itSaveRes) {
						// Set message assertion
						(itSaveRes.body.message).should.match('Please fill It name');
						
						// Handle It save error
						done(itSaveErr);
					});
			});
	});

	it('should be able to update It instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new It
				agent.post('/api/its')
					.send(it)
					.expect(200)
					.end(function(itSaveErr, itSaveRes) {
						// Handle It save error
						if (itSaveErr) done(itSaveErr);

						// Update It name
						it.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing It
						agent.put('/api/its/' + itSaveRes.body._id)
							.send(it)
							.expect(200)
							.end(function(itUpdateErr, itUpdateRes) {
								// Handle It update error
								if (itUpdateErr) done(itUpdateErr);

								// Set assertions
								(itUpdateRes.body._id).should.equal(itSaveRes.body._id);
								(itUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Its if not signed in', function(done) {
		// Create new It model instance
		var itObj = new It(it);

		// Save the It
		itObj.save(function() {
			// Request Its
			request(app).get('/api/its')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single It if not signed in', function(done) {
		// Create new It model instance
		var itObj = new It(it);

		// Save the It
		itObj.save(function() {
			request(app).get('/api/its/' + itObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', it.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete It instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new It
				agent.post('/api/its')
					.send(it)
					.expect(200)
					.end(function(itSaveErr, itSaveRes) {
						// Handle It save error
						if (itSaveErr) done(itSaveErr);

						// Delete existing It
						agent.delete('/api/its/' + itSaveRes.body._id)
							.send(it)
							.expect(200)
							.end(function(itDeleteErr, itDeleteRes) {
								// Handle It error error
								if (itDeleteErr) done(itDeleteErr);

								// Set assertions
								(itDeleteRes.body._id).should.equal(itSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete It instance if not signed in', function(done) {
		// Set It user 
		it.user = user;

		// Create new It model instance
		var itObj = new It(it);

		// Save the It
		itObj.save(function() {
			// Try deleting It
			request(app).delete('/api/its/' + itObj._id)
			.expect(403)
			.end(function(itDeleteErr, itDeleteRes) {
				// Set message assertion
				(itDeleteRes.body.message).should.match('User is not authorized');

				// Handle It error error
				done(itDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			It.remove().exec(function(){
				done();
			});
		});
	});
});
