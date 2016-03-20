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
    updateAvailable: false,
    messageCount: 0
  };


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
      AlertService.add('info', 'checking-for-update');
    })
    .on('update-available', function () {
      console.log('update-available');
      AlertService.add('info', 'update-available');
    })
    .on('update-not-available', function () {
      console.log('update-not-available');
      AlertService.add('info', 'update-not-available');
    })
    .on('update-downloaded', function () {
      console.log('update-downloaded');
      AlertService.add('info', 'update-downloaded');
      vm.app.updateAvailable = true;
      vm.app.messageCount++;
    });

  // ipcRenderer.sendToHost();

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
