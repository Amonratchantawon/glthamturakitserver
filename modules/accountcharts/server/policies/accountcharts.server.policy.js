'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Accountcharts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/accountcharts',
      permissions: '*'
    }, {
      resources: '/api/accountcharts/:accountchartId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/accountcharts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/accountcharts/:accountchartId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/accountcharts',
      permissions: ['get']
    }, {
      resources: '/api/accountcharts/:accountchartId',
      permissions: ['get']
    }, {
      resources: '/api/orther/accountcharts',
      permissions: ['post']
    }, {
      resources: '/api/orther/accountcharts/:accountchartId',
      permissions: ['get']
    }]
  }]);
};
/**
 * Check If Accountcharts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Accountchart is being processed and the current user created it then allow any manipulation
  if (req.accountchart && req.user && req.accountchart.user && req.accountchart.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
