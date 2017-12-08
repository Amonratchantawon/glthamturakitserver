'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accounttype = mongoose.model('Accounttype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  accounttype;

/**
 * Accounttype routes tests
 */
describe('Accounttype CRUD tests', function () {

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

    // Save a user to the test db and create new Accounttype
    user.save(function () {
      accounttype = {
        accounttypename: 'Accounttype Name',
        accounttypeno:'03',
      };

      done();
    });
  });

  it('should be able to save a Accounttype if logged in', function (done) {
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

        // Save a new Accounttype
        agent.post('/api/accounttypes')
          .send(accounttype)
          .expect(200)
          .end(function (accounttypeSaveErr, accounttypeSaveRes) {
            // Handle Accounttype save error
            if (accounttypeSaveErr) {
              return done(accounttypeSaveErr);
            }

            // Get a list of Accounttypes
            agent.get('/api/accounttypes')
              .end(function (accounttypesGetErr, accounttypesGetRes) {
                // Handle Accounttypes save error
                if (accounttypesGetErr) {
                  return done(accounttypesGetErr);
                }

                // Get Accounttypes list
                var accounttypes = accounttypesGetRes.body;

                // Set assertions
                (accounttypes[0].user._id).should.equal(userId);
                (accounttypes[0].accounttypename).should.match('Accounttype Name');
                (accounttypes[0].accounttypeno).should.match('03');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to save an Accounttype if not logged in', function (done) {
  //   agent.post('/api/accounttypes')
  //     .send(accounttype)
  //     .expect(403)
  //     .end(function (accounttypeSaveErr, accounttypeSaveRes) {
  //       // Call the assertion callback
  //       done(accounttypeSaveErr);
  //     });
  // });

  it('should not be able to save an Accounttype if no name is provided', function (done) {
    // Invalidate name field
    accounttype.accounttypename = '';

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

        // Save a new Accounttype
        agent.post('/api/accounttypes')
          .send(accounttype)
          .expect(400)
          .end(function (accounttypeSaveErr, accounttypeSaveRes) {
            // Set message assertion
            (accounttypeSaveRes.body.message).should.match('Please fill Accounttype name');

            // Handle Accounttype save error
            done(accounttypeSaveErr);
          });
      });
  });

  it('should be able to update an Accounttype if signed in', function (done) {
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

        // Save a new Accounttype
        agent.post('/api/accounttypes')
          .send(accounttype)
          .expect(200)
          .end(function (accounttypeSaveErr, accounttypeSaveRes) {
            // Handle Accounttype save error
            if (accounttypeSaveErr) {
              return done(accounttypeSaveErr);
            }

            // Update Accounttype name
            accounttype.accounttypename = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Accounttype
            agent.put('/api/accounttypes/' + accounttypeSaveRes.body._id)
              .send(accounttype)
              .expect(200)
              .end(function (accounttypeUpdateErr, accounttypeUpdateRes) {
                // Handle Accounttype update error
                if (accounttypeUpdateErr) {
                  return done(accounttypeUpdateErr);
                }

                // Set assertions
                (accounttypeUpdateRes.body._id).should.equal(accounttypeSaveRes.body._id);
                (accounttypeUpdateRes.body.accounttypename).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Accounttypes if not signed in', function (done) {
    // Create new Accounttype model instance
    var accounttypeObj = new Accounttype(accounttype);

    // Save the accounttype
    accounttypeObj.save(function () {
      // Request Accounttypes
      request(app).get('/api/accounttypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Accounttype if not signed in', function (done) {
    // Create new Accounttype model instance
    var accounttypeObj = new Accounttype(accounttype);

    // Save the Accounttype
    accounttypeObj.save(function () {
      request(app).get('/api/accounttypes/' + accounttypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('accounttypename', accounttype.accounttypename);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Accounttype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/accounttypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Accounttype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Accounttype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Accounttype
    request(app).get('/api/accounttypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Accounttype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Accounttype if signed in', function (done) {
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

        // Save a new Accounttype
        agent.post('/api/accounttypes')
          .send(accounttype)
          .expect(200)
          .end(function (accounttypeSaveErr, accounttypeSaveRes) {
            // Handle Accounttype save error
            if (accounttypeSaveErr) {
              return done(accounttypeSaveErr);
            }

            // Delete an existing Accounttype
            agent.delete('/api/accounttypes/' + accounttypeSaveRes.body._id)
              .send(accounttype)
              .expect(200)
              .end(function (accounttypeDeleteErr, accounttypeDeleteRes) {
                // Handle accounttype error error
                if (accounttypeDeleteErr) {
                  return done(accounttypeDeleteErr);
                }

                // Set assertions
                (accounttypeDeleteRes.body._id).should.equal(accounttypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to delete an Accounttype if not signed in', function (done) {
  //   // Set Accounttype user
  //   accounttype.user = user;

  //   // Create new Accounttype model instance
  //   var accounttypeObj = new Accounttype(accounttype);

  //   // Save the Accounttype
  //   accounttypeObj.save(function () {
  //     // Try deleting Accounttype
  //     request(app).delete('/api/accounttypes/' + accounttypeObj._id)
  //       .expect(403)
  //       .end(function (accounttypeDeleteErr, accounttypeDeleteRes) {
  //         // Set message assertion
  //         (accounttypeDeleteRes.body.message).should.match('User is not authorized');

  //         // Handle Accounttype error error
  //         done(accounttypeDeleteErr);
  //       });

  //   });
  // });

  it('should be able to get a single Accounttype that has an orphaned user reference', function (done) {
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

          // Save a new Accounttype
          agent.post('/api/accounttypes')
            .send(accounttype)
            .expect(200)
            .end(function (accounttypeSaveErr, accounttypeSaveRes) {
              // Handle Accounttype save error
              if (accounttypeSaveErr) {
                return done(accounttypeSaveErr);
              }

              // Set assertions on new Accounttype
              (accounttypeSaveRes.body.accounttypename).should.equal(accounttype.accounttypename);
              should.exist(accounttypeSaveRes.body.user);
              should.equal(accounttypeSaveRes.body.user._id, orphanId);

              // force the Accounttype to have an orphaned user reference
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

                    // Get the Accounttype
                    agent.get('/api/accounttypes/' + accounttypeSaveRes.body._id)
                      .expect(200)
                      .end(function (accounttypeInfoErr, accounttypeInfoRes) {
                        // Handle Accounttype error
                        if (accounttypeInfoErr) {
                          return done(accounttypeInfoErr);
                        }

                        // Set assertions
                        (accounttypeInfoRes.body._id).should.equal(accounttypeSaveRes.body._id);
                        (accounttypeInfoRes.body.accounttypename).should.equal(accounttype.accounttypename);
                        should.equal(accounttypeInfoRes.body.user, undefined);

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
      Accounttype.remove().exec(done);
    });
  });
});
