'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Accountchart Schema
 */
var AccountchartSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Account name',
        unique: true,
        trim: true
    },
    accountno: {
        type: String,
        default: '',
        required: 'Please fill Account no',
        unique: true,
        trim: true
    },
    vat: Number,
    unitprice: Number,
    status: {
        type: String,
        default: 'active'
    },
    parent: String,
    accounttype: {
        type: Schema.ObjectId,
        ref: 'Accounttype',
        required: 'Please fill Account type'
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

mongoose.model('Accountchart', AccountchartSchema);
