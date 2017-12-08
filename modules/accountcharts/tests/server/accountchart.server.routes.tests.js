'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Accountchart = mongoose.model('Accountchart'),
    express = require(path.resolve('./config/lib/express')),
    Accounttype = mongoose.model('Accounttype');


/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    accountchart,
    accounttype;

/**
 * Accountchart routes tests
 */
describe('Accountchart CRUD tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
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

        accounttype = new Accounttype({
            accounttypename: 'Accounttype Name',
            accounttypeno: '01',
            user: user
        });

        // Save a user to the test db and create new Accountchart
        user.save(function () {
            accounttype.save(function () {
                accountchart = {
                    name: 'Account name',
                    accountno: '10000',
                    parent: '0',
                    accounttype: accounttype,
                    user: user
                };
                done();
            });
        });
    });

    it('should be able to save a Accountchart if logged in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Accountchart
                agent.post('/api/accountcharts')
                    .send(accountchart)
                    .expect(200)
                    .end(function (accountchartSaveErr, accountchartSaveRes) {
                        // Handle Accountchart save error
                        if (accountchartSaveErr) {
                            return done(accountchartSaveErr);
                        }

                        // Get a list of Accountcharts
                        agent.get('/api/accountcharts')
                            .end(function (accountchartsGetErr, accountchartsGetRes) {
                                // Handle Accountcharts save error
                                if (accountchartsGetErr) {
                                    return done(accountchartsGetErr);
                                }

                                // Get Accountcharts list
                                var accountcharts = accountchartsGetRes.body;

                                // Set assertions
                                (accountcharts[0].user._id).should.equal(userId);
                                (accountcharts[0].name).should.match('Account name');
                                (accountcharts[0].accountno).should.match('10000');
                                (accountcharts[0].accounttype._id).should.match(accounttype.id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Accountchart if not logged in', function (done) {
        agent.post('/api/accountcharts')
            .send(accountchart)
            .expect(403)
            .end(function (accountchartSaveErr, accountchartSaveRes) {
                // Call the assertion callback
                done(accountchartSaveErr);
            });
    });

    it('should not be able to save an Accountchart if no name is provided', function (done) {
        // Invalidate name field
        accountchart.name = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Accountchart
                agent.post('/api/accountcharts')
                    .send(accountchart)
                    .expect(400)
                    .end(function (accountchartSaveErr, accountchartSaveRes) {
                        // Set message assertion
                        (accountchartSaveRes.body.message).should.match('Please fill Account name');

                        // Handle Accountchart save error
                        done(accountchartSaveErr);
                    });
            });
    });

    it('should not be able to save an Accountchart if no accountno is provided', function (done) {
        // Invalidate name field
        accountchart.accountno = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Accountchart
                agent.post('/api/accountcharts')
                    .send(accountchart)
                    .expect(400)
                    .end(function (accountchartSaveErr, accountchartSaveRes) {
                        // Set message assertion
                        (accountchartSaveRes.body.message).should.match('Please fill Account no');

                        // Handle Accountchart save error
                        done(accountchartSaveErr);
                    });
            });
    });

    it('should be able to update an Accountchart if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Accountchart
                agent.post('/api/accountcharts')
                    .send(accountchart)
                    .expect(200)
                    .end(function (accountchartSaveErr, accountchartSaveRes) {
                        // Handle Accountchart save error
                        if (accountchartSaveErr) {
                            return done(accountchartSaveErr);
                        }

                        // Update Accountchart name
                        accountchart.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Accountchart
                        agent.put('/api/accountcharts/' + accountchartSaveRes.body._id)
                            .send(accountchart)
                            .expect(200)
                            .end(function (accountchartUpdateErr, accountchartUpdateRes) {
                                // Handle Accountchart update error
                                if (accountchartUpdateErr) {
                                    return done(accountchartUpdateErr);
                                }

                                // Set assertions
                                (accountchartUpdateRes.body._id).should.equal(accountchartSaveRes.body._id);
                                (accountchartUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Accountcharts if not signed in', function (done) {
        // Create new Accountchart model instance
        var accountchartObj = new Accountchart(accountchart);

        // Save the accountchart
        accountchartObj.save(function () {
            // Request Accountcharts
            request(app).get('/api/accountcharts')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Accountchart if not signed in', function (done) {
        // Create new Accountchart model instance
        var accountchartObj = new Accountchart(accountchart);

        // Save the Accountchart
        accountchartObj.save(function () {
            request(app).get('/api/accountcharts/' + accountchartObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('name', accountchart.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Accountchart with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/accountcharts/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Accountchart is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Accountchart which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Accountchart
        request(app).get('/api/accountcharts/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Accountchart with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Accountchart if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Accountchart
                agent.post('/api/accountcharts')
                    .send(accountchart)
                    .expect(200)
                    .end(function (accountchartSaveErr, accountchartSaveRes) {
                        // Handle Accountchart save error
                        if (accountchartSaveErr) {
                            return done(accountchartSaveErr);
                        }

                        // Delete an existing Accountchart
                        agent.delete('/api/accountcharts/' + accountchartSaveRes.body._id)
                            .send(accountchart)
                            .expect(200)
                            .end(function (accountchartDeleteErr, accountchartDeleteRes) {
                                // Handle accountchart error error
                                if (accountchartDeleteErr) {
                                    return done(accountchartDeleteErr);
                                }

                                // Set assertions
                                (accountchartDeleteRes.body._id).should.equal(accountchartSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Accountchart if not signed in', function (done) {
        // Set Accountchart user
        accountchart.user = user;

        // Create new Accountchart model instance
        var accountchartObj = new Accountchart(accountchart);

        // Save the Accountchart
        accountchartObj.save(function () {
            // Try deleting Accountchart
            request(app).delete('/api/accountcharts/' + accountchartObj._id)
                .expect(403)
                .end(function (accountchartDeleteErr, accountchartDeleteRes) {
                    // Set message assertion
                    (accountchartDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Accountchart error error
                    done(accountchartDeleteErr);
                });

        });
    });

    it('should be able to get a single Accountchart that has an orphaned user reference', function (done) {
        // Create orphan user creds
        var _creds = {
            username: 'orphan',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create orphan user
        var _orphan = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'orphan@test.com',
            username: _creds.username,
            password: _creds.password,
            provider: 'local'
        });

        _orphan.save(function (err, orphan) {
            // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    // Get the userId
                    var orphanId = orphan._id;

                    // Save a new Accountchart
                    agent.post('/api/accountcharts')
                        .send(accountchart)
                        .expect(200)
                        .end(function (accountchartSaveErr, accountchartSaveRes) {
                            // Handle Accountchart save error
                            if (accountchartSaveErr) {
                                return done(accountchartSaveErr);
                            }

                            // Set assertions on new Accountchart
                            (accountchartSaveRes.body.name).should.equal(accountchart.name);
                            should.exist(accountchartSaveRes.body.user);
                            should.equal(accountchartSaveRes.body.user._id, orphanId);

                            // force the Accountchart to have an orphaned user reference
                            orphan.remove(function () {
                                // now signin with valid user
                                agent.post('/api/auth/signin')
                                    .send(credentials)
                                    .expect(200)
                                    .end(function (err, res) {
                                        // Handle signin error
                                        if (err) {
                                            return done(err);
                                        }

                                        // Get the Accountchart
                                        agent.get('/api/accountcharts/' + accountchartSaveRes.body._id)
                                            .expect(200)
                                            .end(function (accountchartInfoErr, accountchartInfoRes) {
                                                // Handle Accountchart error
                                                if (accountchartInfoErr) {
                                                    return done(accountchartInfoErr);
                                                }

                                                // Set assertions
                                                (accountchartInfoRes.body._id).should.equal(accountchartSaveRes.body._id);
                                                (accountchartInfoRes.body.name).should.equal(accountchart.name);
                                                should.equal(accountchartInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Accounttype.remove().exec(function () {
                Accountchart.remove().exec(done);
            });
        });
    });
});
