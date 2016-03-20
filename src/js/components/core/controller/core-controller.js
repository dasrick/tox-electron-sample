'use strict';

/**
 * @ngInject
 */
module.exports = function (app, AlertService, ipcRenderer) {
  var vm = this;
  vm.app = {
    version: app.getVersion()
  };

  // AlertService.add('info', 'fooo info');
  // AlertService.add('warning', 'fooo warning');
  // AlertService.add('danger', 'fooo');
  // AlertService.add('success', 'fooo success');

  ipcRenderer
    // .on('releaseUrl', function (sender, url) {
    //   console.log('status-controller - releaseUrl: ', url);
    //   vm.ipcMsg = 'Url: ' + url;
    // })
    .on('error', function (sender, error, x) {
      console.log('status-controller sender: ', sender);
      console.log('status-controller error: ', error);
      console.log('status-controller x: ', x);
    })
    .on('checking-for-update', function () {
      console.log('checking-for-update');
    })
    .on('update-available', function () {
      console.log('update-available');
      AlertService.add('info', 'update-available');
    })
    .on('update-not-available', function () {
      console.log('update-not-available');
    })
    .on('update-downloaded', function () {
      console.log('update-downloaded');
      AlertService.add('info', 'update-downloaded');
    });
};
