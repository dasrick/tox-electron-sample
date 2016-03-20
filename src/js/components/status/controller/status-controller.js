'use strict';

var os = require('os');

/**
 * @ngInject
 */
module.exports = function (ipcRenderer) {
  var vm = this;
  // vm.os = {};

  console.log('status-controller loaded');

  ipcRenderer.on('send-os-data', function (sender, os) {
    vm.os = os;
  })
};
