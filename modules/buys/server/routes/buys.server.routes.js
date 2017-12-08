'use strict';

/**
 * Module dependencies
 */
var buysPolicy = require('../policies/buys.server.policy'),
  buys = require('../controllers/buys.server.controller');

module.exports = function(app) {
  // Buys Routes
  app.route('/api/buys').all(buysPolicy.isAllowed)
    .get(buys.list)
    .post(buys.create);

  app.route('/api/buys/:buyId').all(buysPolicy.isAllowed)
    .get(buys.read)
    .put(buys.update)
    .delete(buys.delete);

  // Finish by binding the Buy middleware
  app.param('buyId', buys.buyByID);
};
