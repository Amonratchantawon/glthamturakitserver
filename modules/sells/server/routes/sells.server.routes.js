'use strict';

/**
 * Module dependencies
 */
var sellsPolicy = require('../policies/sells.server.policy'),
  sells = require('../controllers/sells.server.controller');

module.exports = function(app) {
  // Sells Routes
  app.route('/api/sells').all(sellsPolicy.isAllowed)
    .get(sells.list)
    .post(sells.create);

  app.route('/api/sells/:sellId').all(sellsPolicy.isAllowed)
    .get(sells.read)
    .put(sells.update)
    .delete(sells.delete);

  // Finish by binding the Sell middleware
  app.param('sellId', sells.sellByID);
};
