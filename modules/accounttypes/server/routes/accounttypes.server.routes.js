'use strict';

/**
 * Module dependencies
 */
var accounttypesPolicy = require('../policies/accounttypes.server.policy'),
  accounttypes = require('../controllers/accounttypes.server.controller');

module.exports = function(app) {
  // Accounttypes Routes
  app.route('/api/accounttypes')//.all(accounttypesPolicy.isAllowed)
    .get(accounttypes.list)
    .post(accounttypes.create);

  app.route('/api/accounttypes/:accounttypeId')//.all(accounttypesPolicy.isAllowed)
    .get(accounttypes.read)
    .put(accounttypes.update)
    .delete(accounttypes.delete);

  // Finish by binding the Accounttype middleware
  app.param('accounttypeId', accounttypes.accounttypeByID);
};
