'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accountchart = mongoose.model('Accountchart'),
  Buy = mongoose.model('Buy');

/**
 * Globals
 */
var user,
  accountchart,
  buy;

/**
 * Unit tests
 */
describe('Buy Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    accountchart = new Accountchart({
      name: ' name',
      accountno: 'Account0000',
      parent: 0,
      user: user
    });

    user.save(function () {
      accountchart.save(function () {
        buy = new Buy({
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
          user: user
        });

        done();
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return buy.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      buy.docno = null;

      return buy.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate', function (done) {
      buy.docdate = null;

      return buy.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without contact', function (done) {
      buy.contact = null;

      return buy.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without items', function (done) {
      buy.items = null;

      return buy.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Buy.remove().exec(function () {
      Accountchart.remove().exec(function () {
        User.remove().exec(function () {
          done();
        });
      });
    });
  });
});
