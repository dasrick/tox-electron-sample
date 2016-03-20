'use strict';

/**
 * @ngInject
 */
module.exports = function (ipcRenderer) {
  var vm = this;

  console.log('status-controller loaded');

  if (!angular.isDefined(vm.os)) {
    ipcRenderer.send('get-os-data');
  }

  ipcRenderer.on('send-os-data', function (sender, os) {
    vm.os = os;
  })
};
