'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glyear = mongoose.model('Glyear');

/**
 * Globals
 */
var user,
  glyear;

/**
 * Unit tests
 */
describe('Glyear Model Unit Tests:', function() {
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
      glyear = new Glyear({
        firstDayText: '1 มกราคม 2559',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return glyear.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Glyear.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
