'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glmonth = mongoose.model('Glmonth');

/**
 * Globals
 */
var user,
  glmonth;

/**
 * Unit tests
 */
describe('Glmonth Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      glmonth = new Glmonth({
        firstDayText: '1 มกราคม 2559',
        lastDayText:'30 มกราคม 2559',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return glmonth.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Glmonth.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
