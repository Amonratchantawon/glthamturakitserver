'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glmonth = mongoose.model('Glmonth'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  glmonth;

/**
 * Glmonth routes tests
 */
describe('Glmonth CRUD tests', function () {

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

    // Save a user to the test db and create new Glmonth
    user.save(function () {
      glmonth = {
        firstDayText: '1 มกราคม 2559',
        lastDayText: '30 มกราคม 2559',
        startdate: '2016-01-01T00:00:00.000Z',
        enddate: '2016-12-31T00:00:00.000Z',
        type: 'mounth',
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

  it('should be able to save a Glmonth if logged in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Get a list of Glmonths
            agent.get('/api/glmonths')
              .end(function (glmonthsGetErr, glmonthsGetRes) {
                // Handle Glmonths save error
                if (glmonthsGetErr) {
                  return done(glmonthsGetErr);
                }

                // Get Glmonths list
                var glmonths = glmonthsGetRes.body;

                // Set assertions
                (glmonths[0].user._id).should.equal(userId);
                (glmonths[0].firstDayText).should.match('1 มกราคม 2559');
                (glmonths[0].lastDayText).should.match('30 มกราคม 2559');
                (glmonths[0].startdate).should.match('2016-01-01T00:00:00.000Z');
                (glmonths[0].enddate).should.match('2016-12-31T00:00:00.000Z');
                (glmonths[0].type).should.match('mounth');

                (glmonths[0].acceach[0].accountno).should.match('101101');
                (glmonths[0].acceach[0].company).should.match('Cyber Advance System annd Network Co.,Ltd');
                (glmonths[0].acceach[0].date).should.match('2017-11-23T03:15:21.469Z');
                (glmonths[0].acceach[0].enddate).should.match('2016-12-31T00:00:00.000Z');
                (glmonths[0].acceach[0].startdate).should.match('2016-01-01T00:00:00.000Z');
                (glmonths[0].acceach[0].title).should.match('บัญชีแยกประเภทเงินสด');
                (glmonths[0].acceach[0].current.credit).should.match(13289);
                (glmonths[0].acceach[0].current.debit).should.match(13289);

                (glmonths[0].acceach[0].carryforward.accountname).should.match('ยอดยกไป');
                (glmonths[0].acceach[0].carryforward.accountno).should.match('');
                (glmonths[0].acceach[0].carryforward.credit).should.match(0);
                (glmonths[0].acceach[0].carryforward.debit).should.match(13289);
                (glmonths[0].acceach[0].carryforward.description).should.match('');
                (glmonths[0].acceach[0].carryforward.docdate).should.match('');
                (glmonths[0].acceach[0].carryforward.docno).should.match('');
                (glmonths[0].acceach[0].carryforward.document).should.match('');
                (glmonths[0].acceach[0].carryforward.timestamp).should.match('');

                (glmonths[0].acceach[0].bringforward.accountname).should.match('ยอดยกมา');
                (glmonths[0].acceach[0].bringforward.accountno).should.match('');
                (glmonths[0].acceach[0].bringforward.credit).should.match(0);
                (glmonths[0].acceach[0].bringforward.debit).should.match(0);
                (glmonths[0].acceach[0].bringforward.description).should.match('');
                (glmonths[0].acceach[0].bringforward.docdate).should.match('');
                (glmonths[0].acceach[0].bringforward.docno).should.match('');
                (glmonths[0].acceach[0].bringforward.document).should.match('');
                (glmonths[0].acceach[0].bringforward.timestamp).should.match('');

                (glmonths[0].acceach[0].account.accountno).should.match('101101');
                (glmonths[0].acceach[0].account.created).should.match('2017-11-13T07:35:29.292Z');
                (glmonths[0].acceach[0].account.name).should.match('เงินสด');
                (glmonths[0].acceach[0].account.parent).should.match('');
                (glmonths[0].acceach[0].account.status).should.match('active');
                (glmonths[0].acceach[0].account.unitprice).should.match(0);
                (glmonths[0].acceach[0].account.vat).should.match(0);
                (glmonths[0].acceach[0].account.user).should.match(user.id);
                (glmonths[0].acceach[0].account._id).should.match('5a094b41c601191100d6ded8');

                (glmonths[0].acceach[0].account.accounttype.accounttypename).should.match('สินทรัพย์หมุนเวียน');
                (glmonths[0].acceach[0].account.accounttype.accounttypeno).should.match('01');
                (glmonths[0].acceach[0].account.accounttype.created).should.match('2017-11-21T11:31:27.911Z');
                (glmonths[0].acceach[0].account.accounttype.user).should.match(user.id);
                (glmonths[0].acceach[0].account.accounttype._id).should.match('5a140e8f99625713006df61b');


                (glmonths[0].balance.company).should.match('Cyber Advance System annd Network Co.,Ltd');
                (glmonths[0].balance.date).should.match('2017-11-23T03:15:21.478Z');
                (glmonths[0].balance.enddate).should.match('2016-12-31T00:00:00.000Z');
                (glmonths[0].balance.startdate).should.match('2016-01-01T00:00:00.000Z');
                (glmonths[0].balance.title).should.match('งบแสดงฐานะการเงิน');

                (glmonths[0].balance.asset.name).should.match(glmonth.balance.asset.name);
                (glmonths[0].balance.asset.transaction[0].accounttype).should.match(glmonth.balance.asset.transaction[0].accounttype);
                (glmonths[0].balance.asset.transaction[0].summary).should.match(glmonth.balance.asset.transaction[0].summary);
                (glmonths[0].balance.asset.transaction[0].list[0].accountname).should.match(glmonth.balance.asset.transaction[0].list[0].accountname);
                (glmonths[0].balance.asset.transaction[0].list[0].accountno).should.match(glmonth.balance.asset.transaction[0].list[0].accountno);
                (glmonths[0].balance.asset.transaction[0].list[0].amount).should.match(glmonth.balance.asset.transaction[0].list[0].amount);

                (glmonths[0].balance.asset.transaction[0].sumtrans.accountno).should.match(glmonth.balance.asset.transaction[0].sumtrans.accountno);
                // (glmonths[0].balance.asset.transaction[0].sumtrans.amount).should.match(glmonth.balance.asset.transaction[0].sumtrans.amount); //eer amoun


                (glmonths[0].balance.debt.name).should.match(glmonth.balance.debt.name);
                (glmonths[0].balance.debt.transaction[0].accounttype).should.match(glmonth.balance.debt.transaction[0].accounttype);
                (glmonths[0].balance.debt.transaction[0].summary).should.match(glmonth.balance.debt.transaction[0].summary);
                (glmonths[0].balance.debt.transaction[0].sumtrans.accountno).should.match(glmonth.balance.debt.transaction[0].sumtrans.accountno);
                // (glmonths[0].balance.debt.transaction[0].sumtrans.account).should.match(glmonth.balance.debt.transaction[0].sumtrans.account);

                (glmonths[0].daily.company).should.match(glmonth.daily.company);
                (glmonths[0].daily.date).should.match(glmonth.daily.date);
                (glmonths[0].daily.enddate).should.match(glmonth.daily.enddate);
                (glmonths[0].daily.startdate).should.match(glmonth.daily.startdate);
                (glmonths[0].daily.title).should.match(glmonth.daily.title);

                (glmonths[0].daily.transaction[0].docdate).should.match(glmonth.daily.transaction[0].docdate);
                (glmonths[0].daily.transaction[0].docno).should.match(glmonth.daily.transaction[0].docno);
                (glmonths[0].daily.transaction[0].remark).should.match(glmonth.daily.transaction[0].remark);
                (glmonths[0].daily.transaction[0].list[0].accountname).should.match(glmonth.daily.transaction[0].list[0].accountname);
                (glmonths[0].daily.transaction[0].list[0].accountno).should.match(glmonth.daily.transaction[0].list[0].accountno);
                (glmonths[0].daily.transaction[0].list[0].credit).should.match(glmonth.daily.transaction[0].list[0].credit);
                (glmonths[0].daily.transaction[0].list[0].debit).should.match(glmonth.daily.transaction[0].list[0].debit);
                (glmonths[0].daily.transaction[0].list[0].description).should.match(glmonth.daily.transaction[0].list[0].description);
                (glmonths[0].daily.transaction[0].list[0].document).should.match(glmonth.daily.transaction[0].list[0].document);
                (glmonths[0].daily.transaction[0].list[0].timestamp).should.match(glmonth.daily.transaction[0].list[0].timestamp);


                (glmonths[0].gain.company).should.match(glmonth.gain.company);
                (glmonths[0].gain.date).should.match(glmonth.gain.date);
                (glmonths[0].gain.enddate).should.match(glmonth.gain.enddate);
                (glmonths[0].gain.startdate).should.match(glmonth.gain.startdate);
                (glmonths[0].gain.title).should.match(glmonth.gain.title);
                (glmonths[0].gain.transaction[0].accounttype).should.match(glmonth.gain.transaction[0].accounttype);
                (glmonths[0].gain.transaction[0].summary).should.match(glmonth.gain.transaction[0].summary);
                (glmonths[0].gain.transaction[0].list[0].accountname).should.match(glmonth.gain.transaction[0].list[0].accountname);
                (glmonths[0].gain.transaction[0].list[0].accountno).should.match(glmonth.gain.transaction[0].list[0].accountno);
                (glmonths[0].gain.transaction[0].list[0].amount).should.match(glmonth.gain.transaction[0].list[0].amount);


                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to save an Glmonth if not logged in', function (done) {
  //   agent.post('/api/glmonths')
  //     .send(glmonth)
  //     .expect(403)
  //     .end(function (glmonthSaveErr, glmonthSaveRes) {
  //       // Call the assertion callback
  //       done(glmonthSaveErr);
  //     });
  // });

  it('should be able to update an Glmonth if signed in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Update Glmonth name
            glmonth.firstDayText = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Glmonth
            agent.put('/api/glmonths/' + glmonthSaveRes.body._id)
              .send(glmonth)
              .expect(200)
              .end(function (glmonthUpdateErr, glmonthUpdateRes) {
                // Handle Glmonth update error
                if (glmonthUpdateErr) {
                  return done(glmonthUpdateErr);
                }

                // Set assertions
                (glmonthUpdateRes.body._id).should.equal(glmonthSaveRes.body._id);
                (glmonthUpdateRes.body.firstDayText).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Glmonths if not signed in', function (done) {
    // Create new Glmonth model instance
    var glmonthObj = new Glmonth(glmonth);

    // Save the glmonth
    glmonthObj.save(function () {
      // Request Glmonths
      request(app).get('/api/glmonths')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Glmonth if not signed in', function (done) {
    // Create new Glmonth model instance
    var glmonthObj = new Glmonth(glmonth);

    // Save the Glmonth
    glmonthObj.save(function () {
      request(app).get('/api/glmonths/' + glmonthObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('firstDayText', glmonth.firstDayText);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Glmonth with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/glmonths/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Glmonth is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Glmonth which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Glmonth
    request(app).get('/api/glmonths/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Glmonth with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Glmonth if signed in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Delete an existing Glmonth
            agent.delete('/api/glmonths/' + glmonthSaveRes.body._id)
              .send(glmonth)
              .expect(200)
              .end(function (glmonthDeleteErr, glmonthDeleteRes) {
                // Handle glmonth error error
                if (glmonthDeleteErr) {
                  return done(glmonthDeleteErr);
                }

                // Set assertions
                (glmonthDeleteRes.body._id).should.equal(glmonthSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to delete an Glmonth if not signed in', function (done) {
  //   // Set Glmonth user
  //   glmonth.user = user;

  //   // Create new Glmonth model instance
  //   var glmonthObj = new Glmonth(glmonth);

  //   // Save the Glmonth
  //   glmonthObj.save(function () {
  //     // Try deleting Glmonth
  //     request(app).delete('/api/glmonths/' + glmonthObj._id)
  //       .expect(403)
  //       .end(function (glmonthDeleteErr, glmonthDeleteRes) {
  //         // Set message assertion
  //         (glmonthDeleteRes.body.message).should.match('User is not authorized');

  //         // Handle Glmonth error error
  //         done(glmonthDeleteErr);
  //       });

  //   });
  // });

  it('should be able to get a single Glmonth that has an orphaned user reference', function (done) {
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

          // Save a new Glmonth
          agent.post('/api/glmonths')
            .send(glmonth)
            .expect(200)
            .end(function (glmonthSaveErr, glmonthSaveRes) {
              // Handle Glmonth save error
              if (glmonthSaveErr) {
                return done(glmonthSaveErr);
              }

              // Set assertions on new Glmonth
              (glmonthSaveRes.body.firstDayText).should.equal(glmonth.firstDayText);
              should.exist(glmonthSaveRes.body.user);
              should.equal(glmonthSaveRes.body.user._id, orphanId);

              // force the Glmonth to have an orphaned user reference
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

                    // Get the Glmonth
                    agent.get('/api/glmonths/' + glmonthSaveRes.body._id)
                      .expect(200)
                      .end(function (glmonthInfoErr, glmonthInfoRes) {
                        // Handle Glmonth error
                        if (glmonthInfoErr) {
                          return done(glmonthInfoErr);
                        }

                        // Set assertions
                        (glmonthInfoRes.body._id).should.equal(glmonthSaveRes.body._id);
                        (glmonthInfoRes.body.firstDayText).should.equal(glmonth.firstDayText);
                        should.equal(glmonthInfoRes.body.user, undefined);

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
      Glmonth.remove().exec(done);
    });
  });
});
