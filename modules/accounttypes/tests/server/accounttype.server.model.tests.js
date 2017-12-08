'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accounttype = mongoose.model('Accounttype');

/**
 * Globals
 */
var user,
  accounttype;

/**
 * Unit tests
 */
describe('Accounttype Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      accounttype = new Accounttype({
        accounttypename: 'Accounttype Name',
        accounttypeno:'03',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return accounttype.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without account name', function (done) {
      accounttype.accounttypename = '';

      return accounttype.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to show an error when try to save without account type no', function (done) {
      accounttype.accounttypeno = '';

      return accounttype.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });




  afterEach(function (done) {
    Accounttype.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
