'use strict';

/**
 * @ngInject
 */
module.exports = function () {
  var vm = this;
  vm.appversion = process.env.appversion;

  console.log('core-controller loaded');
};
