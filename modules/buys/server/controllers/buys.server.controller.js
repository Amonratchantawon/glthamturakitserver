'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Buy = mongoose.model('Buy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Buy
 */
exports.create = function(req, res) {
  var buy = new Buy(req.body);
  buy.user = req.user;

  buy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buy);
    }
  });
};

/**
 * Show the current Buy
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var buy = req.buy ? req.buy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  buy.isCurrentUserOwner = req.user && buy.user && buy.user._id.toString() === req.user._id.toString();

  res.jsonp(buy);
};

/**
 * Update a Buy
 */
exports.update = function(req, res) {
  var buy = req.buy;

  buy = _.extend(buy, req.body);

  buy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buy);
    }
  });
};

/**
 * Delete an Buy
 */
exports.delete = function(req, res) {
  var buy = req.buy;

  buy.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buy);
    }
  });
};

/**
 * List of Buys
 */
exports.list = function(req, res) {
  Buy.find().sort('-created').populate('user', 'displayName').exec(function(err, buys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(buys);
    }
  });
};

/**
 * Buy middleware
 */
exports.buyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Buy is invalid'
    });
  }

  Buy.findById(id).populate('user', 'displayName').exec(function (err, buy) {
    if (err) {
      return next(err);
    } else if (!buy) {
      return res.status(404).send({
        message: 'No Buy with that identifier has been found'
      });
    }
    req.buy = buy;
    next();
  });
};
