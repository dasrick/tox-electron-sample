'use strict';

/**
 * @ngInject
 */
module.exports = function (ipcRenderer) {
  var vm = this;

  vm.hello = 'world';

  vm.ipcMsg = '.';
  console.log('status-controller loaded');

  ipcRenderer
    .on('releaseUrl', function (sender, url) {
      console.log('status-controller - releaseUrl: ', url);
      vm.ipcMsg = 'Url: ' + url;
    })
    .on('error', function (sender, error) {
      console.log('status-controller error: ', error);
      vm.ipcMsg = 'error';
      vm.hello = error;
    })
    .on('checking-for-update', function () {
      console.log('checking-for-update');
      vm.ipcMsg = 'checking-for-update';
    })
    .on('update-available', function () {
      console.log('update-available');
      vm.ipcMsg = 'update-available';
    })
    .on('update-not-available', function () {
      console.log('update-not-available');
      vm.ipcMsg = 'update-not-available';
    })
    .on('update-downloaded', function () {
      console.log('update-downloaded');
      vm.ipcMsg = 'update-downloaded';
    });
};
