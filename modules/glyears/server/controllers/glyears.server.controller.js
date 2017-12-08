'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Glyear = mongoose.model('Glyear'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Glyear
 */
exports.create = function(req, res) {
  var glyear = new Glyear(req.body);
  glyear.user = req.user;

  glyear.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glyear);
    }
  });
};

/**
 * Show the current Glyear
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var glyear = req.glyear ? req.glyear.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  glyear.isCurrentUserOwner = req.user && glyear.user && glyear.user._id.toString() === req.user._id.toString();

  res.jsonp(glyear);
};

/**
 * Update a Glyear
 */
exports.update = function(req, res) {
  var glyear = req.glyear;

  glyear = _.extend(glyear, req.body);

  glyear.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glyear);
    }
  });
};

/**
 * Delete an Glyear
 */
exports.delete = function(req, res) {
  var glyear = req.glyear;

  glyear.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glyear);
    }
  });
};

/**
 * List of Glyears
 */
exports.list = function(req, res) {
  Glyear.find().sort('-created').populate('user', 'displayName').exec(function(err, glyears) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glyears);
    }
  });
};

/**
 * Glyear middleware
 */
exports.glyearByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Glyear is invalid'
    });
  }

  Glyear.findById(id).populate('user', 'displayName').exec(function (err, glyear) {
    if (err) {
      return next(err);
    } else if (!glyear) {
      return res.status(404).send({
        message: 'No Glyear with that identifier has been found'
      });
    }
    req.glyear = glyear;
    next();
  });
};

exports.glyearsWithList = function (req, res) {
  Glyear.find().select('enddate statementname').sort('startdate').populate('user', 'displayName').exec(function (err, glyears) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glyears);
    }
  });
};
