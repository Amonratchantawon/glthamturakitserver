'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sell Schema
 */
var SellSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sell name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Sell', SellSchema);
