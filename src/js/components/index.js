'use strict';
/**
 * @ngInject
 */
module.exports = require('angular')
  .module('components', [
    require('./core').name,
    require('./changelog').name,
    require('./status').name
  ]);
