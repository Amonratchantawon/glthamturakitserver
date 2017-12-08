'use strict';
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hinmrcynu',
    api_key: '594325117479212',
    api_secret: '3Su47NPo-DnkoMCzEFQnhu85GTc'
});

module.exports.cloudinary = cloudinary;