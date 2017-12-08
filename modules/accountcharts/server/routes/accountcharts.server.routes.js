'use strict';

/**
 * Module dependencies
 */
var accountchartsPolicy = require('../policies/accountcharts.server.policy'),
  accountcharts = require('../controllers/accountcharts.server.controller');

module.exports = function (app) {
  // Accountcharts Routes
  app.route('/api/accountcharts').all(accountchartsPolicy.isAllowed)
    .get(accountcharts.list)
    .post(accountcharts.create);

  app.route('/api/accountcharts/:accountchartId').all(accountchartsPolicy.isAllowed)
    .get(accountcharts.read)
    .put(accountcharts.update)
    .delete(accountcharts.delete);

  app.route('/api/orther/accountcharts')
    .post(accountcharts.createCccountcharts);

  app.route('/api/orther/accountcharts/:accountchartId')
    .get(accountcharts.read)
    .put(accountcharts.update)
    .delete(accountcharts.delete);
  // Finish by binding the Accountchart middleware
  app.param('accountchartId', accountcharts.accountchartByID);
};
