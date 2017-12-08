'use strict';

/**
 * Module dependencies
 */
var glmonthsPolicy = require('../policies/glmonths.server.policy'),
  glmonths = require('../controllers/glmonths.server.controller');

module.exports = function (app) {
  // Glmonths Routes
  app.route('/api/glmonths') //.all(glmonthsPolicy.isAllowed)
    .get(glmonths.list)
    .post(glmonths.create);

  app.route('/api/glmonths/:glmonthId') //.all(glmonthsPolicy.isAllowed)
    .get(glmonths.read)
    .put(glmonths.update)
    .delete(glmonths.delete);

  app.route('/api/glmonthsWithList') //.all(glmonthsPolicy.isAllowed)
    .get(glmonths.glmonthsWithList);

  // Finish by binding the Glmonth middleware
  app.param('glmonthId', glmonths.glmonthByID);
};
