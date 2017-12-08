'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Glmonth = mongoose.model('Glmonth'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Glmonth
 */
exports.create = function (req, res) {
  var glmonth = new Glmonth(req.body);
  glmonth.user = req.user;

  glmonth.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glmonth);
    }
  });
};

/**
 * Show the current Glmonth
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var glmonth = req.glmonth ? req.glmonth.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  glmonth.isCurrentUserOwner = req.user && glmonth.user && glmonth.user._id.toString() === req.user._id.toString();

  res.jsonp(glmonth);
};

/**
 * Update a Glmonth
 */
exports.update = function (req, res) {
  var glmonth = req.glmonth;

  glmonth = _.extend(glmonth, req.body);

  glmonth.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glmonth);
    }
  });
};

/**
 * Delete an Glmonth
 */
exports.delete = function (req, res) {
  var glmonth = req.glmonth;

  glmonth.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glmonth);
    }
  });
};

/**
 * List of Glmonths
 */
exports.list = function (req, res) {
  Glmonth.find().sort('-created').populate('user', 'displayName').exec(function (err, glmonths) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glmonths);
    }
  });
};

/**
 * Glmonth middleware
 */
exports.glmonthByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Glmonth is invalid'
    });
  }

  Glmonth.findById(id).populate('user', 'displayName').exec(function (err, glmonth) {
    if (err) {
      return next(err);
    } else if (!glmonth) {
      return res.status(404).send({
        message: 'No Glmonth with that identifier has been found'
      });
    }
    req.glmonth = glmonth;
    next();
  });
};

exports.glmonthsWithList = function (req, res) {
  Glmonth.find().select('enddate statementname').sort('startdate').populate('user', 'displayName').exec(function (err, glmonths) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(glmonths);
    }
  });
};
