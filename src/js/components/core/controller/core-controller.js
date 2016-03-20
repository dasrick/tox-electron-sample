'use strict';

/**
 * @ngInject
 */
module.exports = function (app, AlertService, ipcRenderer, autoUpdater, $log) {
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

  autoUpdater
    .on('error', function () {
      $log.error('core auto-updater on error');
    })
    .on('checking-for-update', function () {
      $log.info('core auto-updater on checking-for-update');
    })
    .on('update-available', function () {
      $log.info('core auto-updater on update-available');
    })
    .on('update-not-available', function () {
      $log.info('core auto-updater on update-not-available');
    })
    .on('update-downloaded', function () {
      $log.info('core auto-updater on update-downloaded');
    });

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
      // vm.app.updateCheck = true;
      setUpdateState(true, false, false);
    })
    .on('update-available', function () {
      // vm.app.updateCheck = false;
      // vm.app.updateDownload = true;
      setUpdateState(false, true, false);
    })
    .on('update-not-available', function () {
      // vm.app.updateCheck = false;
      setUpdateState(false, false, false);
    })
    .on('update-downloaded', function () {
      AlertService.add('info', 'core.msg.autoupdater.downloaded');
      // vm.app.updateDownload = false;
      // vm.app.updateAvailable = true;
      setUpdateState(false, false, true);
      vm.app.messageCount++;
    });


  function updateNow() {
    console.log('controller ipcRenderer.send update-now');
    ipcRenderer.send('update-now');

    vm.app.updateAvailable = false;
    vm.app.messageCount--;
  }

  function setUpdateState(check, download, available) {
    vm.app.updateCheck = validBoolean(check);
    vm.app.updateDownload = validBoolean(download);
    vm.app.updateAvailable = validBoolean(available);
  }

  function validBoolean(value) {
    if (angular.isUndefined(value) || (typeof value == 'boolean')) {
      value = false;
    }
    return value;
  }


};
