'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Accounttype Schema
 */
var AccounttypeSchema = new Schema({
  accounttypeno: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Accounttype no'
  },
  accounttypename: {
    type: String,
    default: '',
    unique: true,    
    required: 'Please fill Accounttype name',
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

mongoose.model('Accounttype', AccounttypeSchema);
