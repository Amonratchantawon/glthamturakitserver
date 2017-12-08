'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glyear = mongoose.model('Glyear'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  glyear;

/**
 * Glyear routes tests
 */
describe('Glyear CRUD tests', function () {

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

    // Save a user to the test db and create new Glyear
    user.save(function () {
      glyear = {
        firstDayText: '1 มกราคม 2559',
        lastDayText: '31 ธันวาคม 2559',
        startdate: '2016-01-01T00:00:00.000Z',
        enddate: '2016-12-31T00:00:00.000Z',
        type: 'year',
        acceach: [
          {
            accountno: '101101',
            company: 'Cyber Advance System annd Network Co.,Ltd',
            date: '2017-11-23T03:15:21.469Z',
            enddate: '2016-12-31T00:00:00.000Z',
            startdate: '2016-01-01T00:00:00.000Z',
            title: 'บัญชีแยกประเภทเงินสด',
            current: {
              credit: 13289,
              debit: 13289
            },
            carryforward: {
              accountname: "ยอดยกไป",
              accountno: "",
              credit: 0,
              debit: 13289,
              description: "",
              docdate: "",
              docno: "",
              document: "",
              timestamp: ""
            },
            bringforward: {
              accountname: "ยอดยกมา",
              accountno: "",
              credit: 0,
              debit: 0,
              description: "",
              docdate: "",
              docno: "",
              document: "",
              timestamp: ""
            },
            account: {
              accounttype: {
                accounttypename: 'สินทรัพย์หมุนเวียน',
                accounttypeno: '01',
                created: '2017-11-21T11:31:27.911Z',
                user: user,
                _id: '5a140e8f99625713006df61b'
              },
              accountno: '101101',
              created: '2017-11-13T07:35:29.292Z',
              name: 'เงินสด',
              parent: '',
              status: 'active',
              unitprice: 0,
              user: user,
              vat: 0,
              _id: "5a094b41c601191100d6ded8"
            }
          },
        ],
        balance: {
          company: 'Cyber Advance System annd Network Co.,Ltd',
          date: '2017-11-23T03:15:21.478Z',
          enddate: '2016-12-31T00:00:00.000Z',
          startdate: '2016-01-01T00:00:00.000Z',
          title: 'งบแสดงฐานะการเงิน',
          asset: {
            name: '- สินทรัพย์ -',
            transaction: [
              {
                accounttype: 'ที่ดิน อาคารและอุปกรณ์',
                summary: 0,
                sumtrans: {
                  accountno: '- รวมหนี้สิน -',
                  amount: 0
                },
                list: [{
                  accountname: 'ส่วนปรับปรุงสำนักงาน',
                  accountno: '102003',
                  amount: 0
                }]
              }
            ]
          },
          debt: {
            name: '- หนี้สินและส่วนของผู้ถือหุ้น -',
            transaction: [{
              accounttype: 'หนี้สินหมุนเวียน',
              summary: 0,
              sumtrans: {
                accountno: '- รวมหนี้สิน -',
                amount: 0
              },
              list: [{
                accountname: 'เงินกู้ยืมจากกรรมการ',
                accountno: '201201',
                amount: 0
              }]
            }]
          }
        },
        daily: {
          company: 'Cyber Advance System annd Network Co.,Ltd',
          date: '2017-11-23T03:15:21.478Z',
          enddate: '2016-12-31T00:00:00.000Z',
          startdate: '2016-01-01T00:00:00.000Z',
          title: 'งบแสดงฐานะการเงิน',
          transaction: [{
            docdate: '2016-01-04T00:00:00.000Z',
            docno: 'PV59010401',
            remark: 'ค่ากระดาษถ่ายเอกสาร',
            list: [{
              accountname: "ค่าเครื่องเขียนแบบพิมพ์",
              accountno: "605003",
              credit: 0,
              debit: 168.22,
              description: "ค่ากระดาษถ่ายเอกสาร",
              document: "",
              timestamp: "",
            }]
          }]
        },

        gain: {
          company: 'Cyber Advance System annd Network Co.,Ltd',
          date: '2017-11-23T03:15:21.478Z',
          enddate: '2016-12-31T00:00:00.000Z',
          startdate: '2016-01-01T00:00:00.000Z',
          title: 'งบกำไรขาดทุน',
          transaction: [{
            accounttype: 'รายได้จากการดำเนินงาน',
            summary: 0,
            list: [{
              accountname: 'รายได้จากการขาย',
              accountno: '401001',
              amount: 0
            }]
          }]
        }
      };

      done();
    });
  });

  it('should be able to save a Glyear if logged in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Get a list of Glyears
            agent.get('/api/glyears')
              .end(function (glyearsGetErr, glyearsGetRes) {
                // Handle Glyears save error
                if (glyearsGetErr) {
                  return done(glyearsGetErr);
                }

                // Get Glyears list
                var glyears = glyearsGetRes.body;

                // Set assertions
                (glyears[0].user._id).should.equal(userId);
                (glyears[0].firstDayText).should.match('1 มกราคม 2559');
                (glyears[0].lastDayText).should.match('31 ธันวาคม 2559');
                (glyears[0].startdate).should.match('2016-01-01T00:00:00.000Z');
                (glyears[0].enddate).should.match('2016-12-31T00:00:00.000Z');
                (glyears[0].type).should.match('year');

                (glyears[0].acceach[0].accountno).should.match('101101');
                (glyears[0].acceach[0].company).should.match('Cyber Advance System annd Network Co.,Ltd');
                (glyears[0].acceach[0].date).should.match('2017-11-23T03:15:21.469Z');
                (glyears[0].acceach[0].enddate).should.match('2016-12-31T00:00:00.000Z');
                (glyears[0].acceach[0].startdate).should.match('2016-01-01T00:00:00.000Z');
                (glyears[0].acceach[0].title).should.match('บัญชีแยกประเภทเงินสด');
                (glyears[0].acceach[0].current.credit).should.match(13289);
                (glyears[0].acceach[0].current.debit).should.match(13289);

                (glyears[0].acceach[0].carryforward.accountname).should.match('ยอดยกไป');
                (glyears[0].acceach[0].carryforward.accountno).should.match('');
                (glyears[0].acceach[0].carryforward.credit).should.match(0);
                (glyears[0].acceach[0].carryforward.debit).should.match(13289);
                (glyears[0].acceach[0].carryforward.description).should.match('');
                (glyears[0].acceach[0].carryforward.docdate).should.match('');
                (glyears[0].acceach[0].carryforward.docno).should.match('');
                (glyears[0].acceach[0].carryforward.document).should.match('');
                (glyears[0].acceach[0].carryforward.timestamp).should.match('');

                (glyears[0].acceach[0].bringforward.accountname).should.match('ยอดยกมา');
                (glyears[0].acceach[0].bringforward.accountno).should.match('');
                (glyears[0].acceach[0].bringforward.credit).should.match(0);
                (glyears[0].acceach[0].bringforward.debit).should.match(0);
                (glyears[0].acceach[0].bringforward.description).should.match('');
                (glyears[0].acceach[0].bringforward.docdate).should.match('');
                (glyears[0].acceach[0].bringforward.docno).should.match('');
                (glyears[0].acceach[0].bringforward.document).should.match('');
                (glyears[0].acceach[0].bringforward.timestamp).should.match('');

                (glyears[0].acceach[0].account.accountno).should.match('101101');
                (glyears[0].acceach[0].account.created).should.match('2017-11-13T07:35:29.292Z');
                (glyears[0].acceach[0].account.name).should.match('เงินสด');
                (glyears[0].acceach[0].account.parent).should.match('');
                (glyears[0].acceach[0].account.status).should.match('active');
                (glyears[0].acceach[0].account.unitprice).should.match(0);
                (glyears[0].acceach[0].account.vat).should.match(0);
                (glyears[0].acceach[0].account.user).should.match(user.id);
                (glyears[0].acceach[0].account._id).should.match('5a094b41c601191100d6ded8');

                (glyears[0].acceach[0].account.accounttype.accounttypename).should.match('สินทรัพย์หมุนเวียน');
                (glyears[0].acceach[0].account.accounttype.accounttypeno).should.match('01');
                (glyears[0].acceach[0].account.accounttype.created).should.match('2017-11-21T11:31:27.911Z');
                (glyears[0].acceach[0].account.accounttype.user).should.match(user.id);
                (glyears[0].acceach[0].account.accounttype._id).should.match('5a140e8f99625713006df61b');


                (glyears[0].balance.company).should.match('Cyber Advance System annd Network Co.,Ltd');
                (glyears[0].balance.date).should.match('2017-11-23T03:15:21.478Z');
                (glyears[0].balance.enddate).should.match('2016-12-31T00:00:00.000Z');
                (glyears[0].balance.startdate).should.match('2016-01-01T00:00:00.000Z');
                (glyears[0].balance.title).should.match('งบแสดงฐานะการเงิน');

                (glyears[0].balance.asset.name).should.match(glyear.balance.asset.name);
                (glyears[0].balance.asset.transaction[0].accounttype).should.match(glyear.balance.asset.transaction[0].accounttype);
                (glyears[0].balance.asset.transaction[0].summary).should.match(glyear.balance.asset.transaction[0].summary);
                (glyears[0].balance.asset.transaction[0].list[0].accountname).should.match(glyear.balance.asset.transaction[0].list[0].accountname);
                (glyears[0].balance.asset.transaction[0].list[0].accountno).should.match(glyear.balance.asset.transaction[0].list[0].accountno);
                (glyears[0].balance.asset.transaction[0].list[0].amount).should.match(glyear.balance.asset.transaction[0].list[0].amount);

                (glyears[0].balance.asset.transaction[0].sumtrans.accountno).should.match(glyear.balance.asset.transaction[0].sumtrans.accountno);
                // (glyears[0].balance.asset.transaction[0].sumtrans.amount).should.match(glyear.balance.asset.transaction[0].sumtrans.amount); //eer amoun


                (glyears[0].balance.debt.name).should.match(glyear.balance.debt.name);
                (glyears[0].balance.debt.transaction[0].accounttype).should.match(glyear.balance.debt.transaction[0].accounttype);
                (glyears[0].balance.debt.transaction[0].summary).should.match(glyear.balance.debt.transaction[0].summary);
                (glyears[0].balance.debt.transaction[0].sumtrans.accountno).should.match(glyear.balance.debt.transaction[0].sumtrans.accountno);
                // (glyears[0].balance.debt.transaction[0].sumtrans.account).should.match(glyear.balance.debt.transaction[0].sumtrans.account);

                (glyears[0].daily.company).should.match(glyear.daily.company);
                (glyears[0].daily.date).should.match(glyear.daily.date);
                (glyears[0].daily.enddate).should.match(glyear.daily.enddate);
                (glyears[0].daily.startdate).should.match(glyear.daily.startdate);
                (glyears[0].daily.title).should.match(glyear.daily.title);

                (glyears[0].daily.transaction[0].docdate).should.match(glyear.daily.transaction[0].docdate);
                (glyears[0].daily.transaction[0].docno).should.match(glyear.daily.transaction[0].docno);
                (glyears[0].daily.transaction[0].remark).should.match(glyear.daily.transaction[0].remark);
                (glyears[0].daily.transaction[0].list[0].accountname).should.match(glyear.daily.transaction[0].list[0].accountname);
                (glyears[0].daily.transaction[0].list[0].accountno).should.match(glyear.daily.transaction[0].list[0].accountno);
                (glyears[0].daily.transaction[0].list[0].credit).should.match(glyear.daily.transaction[0].list[0].credit);
                (glyears[0].daily.transaction[0].list[0].debit).should.match(glyear.daily.transaction[0].list[0].debit);
                (glyears[0].daily.transaction[0].list[0].description).should.match(glyear.daily.transaction[0].list[0].description);
                (glyears[0].daily.transaction[0].list[0].document).should.match(glyear.daily.transaction[0].list[0].document);
                (glyears[0].daily.transaction[0].list[0].timestamp).should.match(glyear.daily.transaction[0].list[0].timestamp);


                (glyears[0].gain.company).should.match(glyear.gain.company);
                (glyears[0].gain.date).should.match(glyear.gain.date);
                (glyears[0].gain.enddate).should.match(glyear.gain.enddate);
                (glyears[0].gain.startdate).should.match(glyear.gain.startdate);
                (glyears[0].gain.title).should.match(glyear.gain.title);
                (glyears[0].gain.transaction[0].accounttype).should.match(glyear.gain.transaction[0].accounttype);
                (glyears[0].gain.transaction[0].summary).should.match(glyear.gain.transaction[0].summary);
                (glyears[0].gain.transaction[0].list[0].accountname).should.match(glyear.gain.transaction[0].list[0].accountname);
                (glyears[0].gain.transaction[0].list[0].accountno).should.match(glyear.gain.transaction[0].list[0].accountno);
                (glyears[0].gain.transaction[0].list[0].amount).should.match(glyear.gain.transaction[0].list[0].amount);


                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to save an Glyear if not logged in', function (done) {
  //   agent.post('/api/glyears')
  //     .send(glyear)
  //     .expect(403)
  //     .end(function (glyearSaveErr, glyearSaveRes) {
  //       // Call the assertion callback
  //       done(glyearSaveErr);
  //     });
  // });

  it('should be able to update an Glyear if signed in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Update Glyear name
            glyear.firstDayText = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Glyear
            agent.put('/api/glyears/' + glyearSaveRes.body._id)
              .send(glyear)
              .expect(200)
              .end(function (glyearUpdateErr, glyearUpdateRes) {
                // Handle Glyear update error
                if (glyearUpdateErr) {
                  return done(glyearUpdateErr);
                }

                // Set assertions
                (glyearUpdateRes.body._id).should.equal(glyearSaveRes.body._id);
                (glyearUpdateRes.body.firstDayText).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Glyears if not signed in', function (done) {
    // Create new Glyear model instance
    var glyearObj = new Glyear(glyear);

    // Save the glyear
    glyearObj.save(function () {
      // Request Glyears
      request(app).get('/api/glyears')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Glyear if not signed in', function (done) {
    // Create new Glyear model instance
    var glyearObj = new Glyear(glyear);

    // Save the Glyear
    glyearObj.save(function () {
      request(app).get('/api/glyears/' + glyearObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('firstDayText', glyear.firstDayText);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Glyear with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/glyears/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Glyear is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Glyear which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Glyear
    request(app).get('/api/glyears/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Glyear with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Glyear if signed in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Delete an existing Glyear
            agent.delete('/api/glyears/' + glyearSaveRes.body._id)
              .send(glyear)
              .expect(200)
              .end(function (glyearDeleteErr, glyearDeleteRes) {
                // Handle glyear error error
                if (glyearDeleteErr) {
                  return done(glyearDeleteErr);
                }

                // Set assertions
                (glyearDeleteRes.body._id).should.equal(glyearSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to delete an Glyear if not signed in', function (done) {
  //   // Set Glyear user
  //   glyear.user = user;

  //   // Create new Glyear model instance
  //   var glyearObj = new Glyear(glyear);

  //   // Save the Glyear
  //   glyearObj.save(function () {
  //     // Try deleting Glyear
  //     request(app).delete('/api/glyears/' + glyearObj._id)
  //       .expect(403)
  //       .end(function (glyearDeleteErr, glyearDeleteRes) {
  //         // Set message assertion
  //         (glyearDeleteRes.body.message).should.match('User is not authorized');

  //         // Handle Glyear error error
  //         done(glyearDeleteErr);
  //       });

  //   });
  // });

  it('should be able to get a single Glyear that has an orphaned user reference', function (done) {
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

          // Save a new Glyear
          agent.post('/api/glyears')
            .send(glyear)
            .expect(200)
            .end(function (glyearSaveErr, glyearSaveRes) {
              // Handle Glyear save error
              if (glyearSaveErr) {
                return done(glyearSaveErr);
              }

              // Set assertions on new Glyear
              (glyearSaveRes.body.firstDayText).should.equal(glyear.firstDayText);
              should.exist(glyearSaveRes.body.user);
              should.equal(glyearSaveRes.body.user._id, orphanId);

              // force the Glyear to have an orphaned user reference
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

                    // Get the Glyear
                    agent.get('/api/glyears/' + glyearSaveRes.body._id)
                      .expect(200)
                      .end(function (glyearInfoErr, glyearInfoRes) {
                        // Handle Glyear error
                        if (glyearInfoErr) {
                          return done(glyearInfoErr);
                        }

                        // Set assertions
                        (glyearInfoRes.body._id).should.equal(glyearSaveRes.body._id);
                        (glyearInfoRes.body.firstDayText).should.equal(glyear.firstDayText);
                        should.equal(glyearInfoRes.body.user, undefined);

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
      Glyear.remove().exec(done);
    });
  });
});
