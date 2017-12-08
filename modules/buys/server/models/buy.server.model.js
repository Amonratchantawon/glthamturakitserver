'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Buy Schema
 */
var BuySchema = new Schema({
  docno: {
    type: String,
    required: 'Please fill docno'
  },
  docdate: {
    type: Date,
    required: 'Please fill docdate',
    default: Date.now
  },
  contact: {
    type: Schema.ObjectId,
    ref: 'Accountchart',
    required: 'Please fill contact'
  },
  items: {
    type: [{
      item: {
        type: Schema.ObjectId,
        ref: 'Accountchart'
      },
      qty: {
        type: Number
      },
      unitprice: {
        type: Number
      },
      vat: {
        type: Number
      },
      amount: {
        type: Number
      }
    }],
    required: 'Please fill items',
  },
  amount: {
    type: Number
  },
  vatamount: {
    type: Number
  },
  totalamount: {
    type: Number
  },
  Discount: {
    type: Number
  },
  netamount: {
    type: Number
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

mongoose.model('Buy', BuySchema);
