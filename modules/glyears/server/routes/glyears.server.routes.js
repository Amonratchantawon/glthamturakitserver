'use strict';

/**
 * Module dependencies
 */
var glyearsPolicy = require('../policies/glyears.server.policy'),
  glyears = require('../controllers/glyears.server.controller');

module.exports = function (app) {
  // Glyears Routes
  app.route('/api/glyears') //.all(glyearsPolicy.isAllowed)
    .get(glyears.list)
    .post(glyears.create);

  app.route('/api/glyears/:glyearId') //.all(glyearsPolicy.isAllowed)
    .get(glyears.read)
    .put(glyears.update)
    .delete(glyears.delete);

  app.route('/api/glyearsWithList') //.all(glmonthsPolicy.isAllowed)
    .get(glyears.glyearsWithList);

  // Finish by binding the Glyear middleware
  app.param('glyearId', glyears.glyearByID);
};
