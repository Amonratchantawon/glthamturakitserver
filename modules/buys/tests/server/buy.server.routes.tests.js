'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Buy = mongoose.model('Buy'),
  Accountchart = mongoose.model('Accountchart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  accountchart,
  buy;

/**
 * Buy routes tests
 */
describe('Buy CRUD tests', function () {

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

    accountchart = new Accountchart({
      name: ' name',
      accountno: 'Account0000',
      parent: 0,
      user: user
    });

    // Save a user to the test db and create new Buy
    user.save(function () {
      accountchart.save(function () {
        buy = {
          docno: 'PV20171100001',
          docdate: new Date(),
          contact: accountchart,
          items: [{
            item: accountchart,
            qty: 1,
            unitprice: 100,
            vat: 1,
            amount: 100
          }],
          amount: 100,
          vatamount: 1,
          totalamount: 100,
          Discount: 0,
          netamount: 100,
        };

        done();
      });
    });
  });

  it('should be able to save a Buy if logged in', function (done) {
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

        // Save a new Buy
        agent.post('/api/buys')
          .send(buy)
          .expect(200)
          .end(function (buySaveErr, buySaveRes) {
            // Handle Buy save error
            if (buySaveErr) {
              return done(buySaveErr);
            }

            // Get a list of Buys
            agent.get('/api/buys')
              .end(function (buysGetErr, buysGetRes) {
                // Handle Buys save error
                if (buysGetErr) {
                  return done(buysGetErr);
                }

                // Get Buys list
                var buys = buysGetRes.body;

                // Set assertions
                (buys[0].user._id).should.equal(userId);
                (buys[0].docno).should.match('PV20171100001');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Buy if not logged in', function (done) {
    agent.post('/api/buys')
      .send(buy)
      .expect(403)
      .end(function (buySaveErr, buySaveRes) {
        // Call the assertion callback
        done(buySaveErr);
      });
  });

  it('should not be able to save an Buy if no docno is provided', function (done) {
    // Invalidate docno field
    buy.docno = '';

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

        // Save a new Buy
        agent.post('/api/buys')
          .send(buy)
          .expect(400)
          .end(function (buySaveErr, buySaveRes) {
            // Set message assertion
            (buySaveRes.body.message).should.match('Please fill docno');

            // Handle Buy save error
            done(buySaveErr);
          });
      });
  });

  it('should be able to update an Buy if signed in', function (done) {
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

        // Save a new Buy
        agent.post('/api/buys')
          .send(buy)
          .expect(200)
          .end(function (buySaveErr, buySaveRes) {
            // Handle Buy save error
            if (buySaveErr) {
              return done(buySaveErr);
            }

            // Update Buy docno
            buy.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Buy
            agent.put('/api/buys/' + buySaveRes.body._id)
              .send(buy)
              .expect(200)
              .end(function (buyUpdateErr, buyUpdateRes) {
                // Handle Buy update error
                if (buyUpdateErr) {
                  return done(buyUpdateErr);
                }

                // Set assertions
                (buyUpdateRes.body._id).should.equal(buySaveRes.body._id);
                (buyUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Buys if not signed in', function (done) {
    // Create new Buy model instance
    var buyObj = new Buy(buy);

    // Save the buy
    buyObj.save(function () {
      // Request Buys
      request(app).get('/api/buys')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Buy if not signed in', function (done) {
    // Create new Buy model instance
    var buyObj = new Buy(buy);

    // Save the Buy
    buyObj.save(function () {
      request(app).get('/api/buys/' + buyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', buy.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Buy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/buys/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Buy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Buy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Buy
    request(app).get('/api/buys/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Buy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Buy if signed in', function (done) {
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

        // Save a new Buy
        agent.post('/api/buys')
          .send(buy)
          .expect(200)
          .end(function (buySaveErr, buySaveRes) {
            // Handle Buy save error
            if (buySaveErr) {
              return done(buySaveErr);
            }

            // Delete an existing Buy
            agent.delete('/api/buys/' + buySaveRes.body._id)
              .send(buy)
              .expect(200)
              .end(function (buyDeleteErr, buyDeleteRes) {
                // Handle buy error error
                if (buyDeleteErr) {
                  return done(buyDeleteErr);
                }

                // Set assertions
                (buyDeleteRes.body._id).should.equal(buySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Buy if not signed in', function (done) {
    // Set Buy user
    buy.user = user;

    // Create new Buy model instance
    var buyObj = new Buy(buy);

    // Save the Buy
    buyObj.save(function () {
      // Try deleting Buy
      request(app).delete('/api/buys/' + buyObj._id)
        .expect(403)
        .end(function (buyDeleteErr, buyDeleteRes) {
          // Set message assertion
          (buyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Buy error error
          done(buyDeleteErr);
        });

    });
  });

  it('should be able to get a single Buy that has an orphaned user reference', function (done) {
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

          // Save a new Buy
          agent.post('/api/buys')
            .send(buy)
            .expect(200)
            .end(function (buySaveErr, buySaveRes) {
              // Handle Buy save error
              if (buySaveErr) {
                return done(buySaveErr);
              }

              // Set assertions on new Buy
              (buySaveRes.body.docno).should.equal(buy.docno);
              should.exist(buySaveRes.body.user);
              should.equal(buySaveRes.body.user._id, orphanId);

              // force the Buy to have an orphaned user reference
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

                    // Get the Buy
                    agent.get('/api/buys/' + buySaveRes.body._id)
                      .expect(200)
                      .end(function (buyInfoErr, buyInfoRes) {
                        // Handle Buy error
                        if (buyInfoErr) {
                          return done(buyInfoErr);
                        }

                        // Set assertions
                        (buyInfoRes.body._id).should.equal(buySaveRes.body._id);
                        (buyInfoRes.body.docno).should.equal(buy.docno);
                        should.equal(buyInfoRes.body.user, undefined);

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
      Accountchart.remove().exec(function () {
        Buy.remove().exec(done);
      });
    });
  });
});
