'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Company name',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Company address',
  },
  subDistrict: {
    type: String,
    default: '',
    required: 'Please fill Company subDistrict',
  },
  district: {
    type: String,
    default: '',
    required: 'Please fill Company district',
  },
  province: {
    type: String,
    default: '',
    required: 'Please fill Company province',
  },
  postCode: {
    type: String,
    default: '',
    required: 'Please fill Company postCode',
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Company phone',
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

mongoose.model('Company', CompanySchema);
