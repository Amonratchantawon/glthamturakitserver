'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
    docno: {
        type: String,
        default: '',
        required: 'Please fill Account docno',
        unique: true,
        trim: true
    },
    docdate: {
        type: Date,
        required: 'Please fill Account docdate',
        // unique: true,
        default: Date.now
    },
    debits: [{
        account: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        }
    }],
    credits: [{
        account: {
            type: Schema.ObjectId,
            ref: 'Accountchart'
        },
        description: String,
        amount: {
            type: Number,
            default: 0
        }
    }],
    remark: String,
    totaldebit: {
        type: Number,
        default: 0
    },
    totalcredit: {
        type: Number,
        default: 0
    },
    gltype: {
        type: String,
        enum: ['AR', 'AP', 'PV', 'RV', 'JV', 'PR', 'SA']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
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

mongoose.model('Account', AccountSchema);