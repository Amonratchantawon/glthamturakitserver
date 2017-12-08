'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sell = mongoose.model('Sell'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sell
 */
exports.create = function(req, res) {
  var sell = new Sell(req.body);
  sell.user = req.user;

  sell.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sell);
    }
  });
};

/**
 * Show the current Sell
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sell = req.sell ? req.sell.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sell.isCurrentUserOwner = req.user && sell.user && sell.user._id.toString() === req.user._id.toString();

  res.jsonp(sell);
};

/**
 * Update a Sell
 */
exports.update = function(req, res) {
  var sell = req.sell;

  sell = _.extend(sell, req.body);

  sell.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sell);
    }
  });
};

/**
 * Delete an Sell
 */
exports.delete = function(req, res) {
  var sell = req.sell;

  sell.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sell);
    }
  });
};

/**
 * List of Sells
 */
exports.list = function(req, res) {
  Sell.find().sort('-created').populate('user', 'displayName').exec(function(err, sells) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sells);
    }
  });
};

/**
 * Sell middleware
 */
exports.sellByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sell is invalid'
    });
  }

  Sell.findById(id).populate('user', 'displayName').exec(function (err, sell) {
    if (err) {
      return next(err);
    } else if (!sell) {
      return res.status(404).send({
        message: 'No Sell with that identifier has been found'
      });
    }
    req.sell = sell;
    next();
  });
};
