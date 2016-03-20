'use strict';

/**
 * @ngInject
 */
module.exports = function (app, AlertService, ipcRenderer) {
  var vm = this;
  // methods
  vm.updateNow = updateNow;
  // vars
  vm.app = {
    version: app.getVersion(),
    updateCheck: false,
    updateDownload: false,
    updateAvailable: false,
    messageCount: 0
  };

  ipcRenderer
  // .on('releaseUrl', function (sender, url) {
  //   console.log('status-controller - releaseUrl: ', url);
  //   vm.ipcMsg = 'Url: ' + url;
  // })
    .on('error', function (sender, error) {
      console.log('status-controller sender: ', sender);
      console.log('status-controller error: ', error);
    })
    .on('checking-for-update', function () {
      // AlertService.add('info', 'checking-for-update');
      vm.app.updateCheck = true;
    })
    .on('update-available', function () {
      // AlertService.add('info', 'update-available');
      vm.app.updateCheck = false;
      vm.app.updateDownload = true;
    })
    .on('update-not-available', function () {
      // AlertService.add('info', 'update-not-available');
      vm.app.updateCheck = false;
    })
    .on('update-downloaded', function () {
      AlertService.add('info', 'core.msg.autoupdater.downloaded');
      vm.app.updateDownload = false;
      vm.app.updateAvailable = true;
      vm.app.messageCount++;
    });


  function updateNow() {
    console.log('controller ipcRenderer.send update-now');
    ipcRenderer.send('update-now');

    vm.app.updateAvailable = false;
    vm.app.messageCount--;
  }

  // ipcRenderer.on('update-now-reply', function(event, arg) {
  //   console.log('controller ipcRenderer.on update-now-reply');
  // });
};
