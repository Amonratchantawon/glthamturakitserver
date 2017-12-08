'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accounttype = mongoose.model('Accounttype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Accounttype
 */
exports.create = function (req, res) {
  var accounttype = new Accounttype(req.body);
  accounttype.user = req.user ? req.user : req.body.user;

  accounttype.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accounttype);
    }
  });
};

/**
 * Show the current Accounttype
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var accounttype = req.accounttype ? req.accounttype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accounttype.isCurrentUserOwner = req.user && accounttype.user && accounttype.user._id.toString() === req.user._id.toString();

  res.jsonp(accounttype);
};

/**
 * Update a Accounttype
 */
exports.update = function (req, res) {
  var accounttype = req.accounttype;

  accounttype = _.extend(accounttype, req.body);

  accounttype.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accounttype);
    }
  });
};

/**
 * Delete an Accounttype
 */
exports.delete = function (req, res) {
  var accounttype = req.accounttype;

  accounttype.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accounttype);
    }
  });
};

/**
 * List of Accounttypes
 */
exports.list = function (req, res) {
  Accounttype.find().sort('accounttypeno').populate('user', 'displayName').exec(function (err, accounttypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accounttypes);
    }
  });
};

/**
 * Accounttype middleware
 */
exports.accounttypeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accounttype is invalid'
    });
  }

  Accounttype.findById(id).populate('user', 'displayName').exec(function (err, accounttype) {
    if (err) {
      return next(err);
    } else if (!accounttype) {
      return res.status(404).send({
        message: 'No Accounttype with that identifier has been found'
      });
    }
    req.accounttype = accounttype;
    next();
  });
};
