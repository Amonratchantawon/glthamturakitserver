'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company');

/**
 * Globals
 */
var user,
  company;

/**
 * Unit tests
 */
describe('Company Model Unit Tests:', function () {
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
      company = new Company({
        name: 'Company Name',
        address: '6/636 หมู่ 5',
        subDistrict: 'xxx',
        district: 'xxx',
        province: 'xxxx',
        postCode: '10220',
        phone:'0935325XXX',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return company.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      company.name = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without villageNo', function (done) {
      company.address = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without subDistrict', function (done) {
      company.subDistrict = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without district', function (done) {
      company.district = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without province', function (done) {
      company.province = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without postalCode', function (done) {
      company.postCode = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without phone', function (done) {
      company.phone = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Company.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
