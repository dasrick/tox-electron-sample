'use strict';

/**
 * @ngInject
 */
module.exports = function ($log, $timeout, $translate, AlertService, app, autoUpdater, ipcRenderer, Menu) {
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

  // basic content stuff ===============================================================================================

  if (!angular.isDefined(vm.os)) {
    $log.info('core-controller - trigger get-os-data');
    ipcRenderer.send('get-os-data');
  }

  ipcRenderer.on('send-os-data', function (sender, os) {
    $log.info('core-controller - catch os-data');
    vm.os = os;

    // build the app menu
    // BUT vm.os is nessessary because of platform check
    var appMenu = Menu.buildFromTemplate(getAppMenuTemplate());
    Menu.setApplicationMenu(appMenu);
  });

  // node-env stuff because of auto updater ----------------------------------------------------------------------------

  ipcRenderer.send('get-node-env');
  ipcRenderer.on('send-node-env', function (sender, data) {
    $log.info('core-controller - catch node-env: ', data);
    if (data !== 'development') {
      $log.warn('core-controller - trigger get-release-url');
      ipcRenderer.send('get-release-url');
    }
  });

  // autoUpdater stuff =================================================================================================

  ipcRenderer.on('send-release-url', function (sender, releaseUrl) {
    $log.info('core-controller - releaseUrl: ', releaseUrl);
    $log.info('trigger auto updater');
    autoUpdater.setFeedURL(releaseUrl);
    autoUpdater.checkForUpdates();
  });

  autoUpdater
    .on('error', function () {
      $log.error('core auto-updater on error');
    })
    .on('checking-for-update', function () {
      $log.info('core auto-updater on checking-for-update');
      setUpdateState(true, false, false);
    })
    .on('update-available', function () {
      $log.info('core auto-updater on update-available');
      $timeout(function () {
        setUpdateState(false, true, false);
      }, 1000);
      AlertService.add('info', 'core.msg.autoupdater.update-available');
    })
    .on('update-not-available', function () {
      $log.info('core auto-updater on update-not-available');
      $timeout(function () {
        setUpdateState(false, false, false);
      }, 1000);
    })
    .on('update-downloaded', function () {
      $log.info('core auto-updater on update-downloaded');
      setUpdateState(false, false, true);
      AlertService.add('info', 'core.msg.autoupdater.downloaded');
      vm.app.messageCount++;
    });

  // ipcRenderer
  // // .on('releaseUrl', function (sender, url) {
  // //   console.log('status-controller - releaseUrl: ', url);
  // //   vm.ipcMsg = 'Url: ' + url;
  // // })
  //   .on('error', function (sender, error) {
  //     console.log('status-controller sender: ', sender);
  //     console.log('status-controller error: ', error);
  //
  //     $log.error('core ipcRenderer on error');
  //   })
  //   .on('checking-for-update', function () {
  //     // vm.app.updateCheck = true;
  //     setUpdateState(true, false, false);
  //     $log.info('core ipcRenderer on checking-for-update');
  //   })
  //   .on('update-available', function () {
  //     // vm.app.updateCheck = false;
  //     // vm.app.updateDownload = true;
  //     setUpdateState(false, true, false);
  //     $log.info('core ipcRenderer on update-available');
  //   })
  //   .on('update-not-available', function () {
  //     // vm.app.updateCheck = false;
  //     setUpdateState(false, false, false);
  //     $log.info('core ipcRenderer on update-not-available');
  //   })
  //   .on('update-downloaded', function () {
  //     AlertService.add('info', 'core.msg.autoupdater.downloaded');
  //     // vm.app.updateDownload = false;
  //     // vm.app.updateAvailable = true;
  //     setUpdateState(false, false, true);
  //     $log.info('core ipcRenderer on update-downloaded');
  //     vm.app.messageCount++;
  //   });


  function updateNow() {
    console.log('core controller autoUpdater.quitAndInstall');
    // ipcRenderer.send('update-now');
    autoUpdater.quitAndInstall();

    vm.app.updateAvailable = false;
    vm.app.messageCount--;
  }

  function setUpdateState(check, download, available) {
    vm.app.updateCheck = getValidBoolean(check);
    vm.app.updateDownload = getValidBoolean(download);
    vm.app.updateAvailable = getValidBoolean(available);
  }


  // menu stuff ========================================================================================================

  function getAppMenuTemplate() {
    return [
      getAppMenuApplication(),
      getAppMenuEdit(),
      getAppMenuView(),
      getAppMenuWindow(),
      getAppMenuHelp()
    ];
  }

  function getAppMenuApplication() {
    if (vm.os.platform === 'darwin') {
      var name = app.getName();
      return {
        label: name,
        submenu: [
          {
            label: $translate.instant('core.appmenu.app.about.label') + ' ' + name,
            role: 'about'
          },
          {
            label: $translate.instant('core.appmenu.app.update.label'),
            click: function () {
              autoUpdater.checkForUpdates()
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide ' + name,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
          },
          {
            label: 'Show All',
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
              app.quit()
            }
          }
        ]
      }
    }
  }

  function getAppMenuEdit() {
    return {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    };
  }

  function getAppMenuView() {
    return {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function () {
            if (vm.os.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function () {
            if (vm.os.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        }
      ]
    };
  }

  function getAppMenuWindow() {
    var template = {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }

      ]
    };

    if (vm.os.platform === 'darwin') {
      template.submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      );
    }

    return template;
  }

  function getAppMenuHelp() {
    return {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function () {
            // require('electron').shell.openExternal('http://electron.atom.io'); // ToDo check
          }
        }
      ]
    };
  }

  // helper ============================================================================================================

  /**
   * Will always return a boolean ... fallback is FALSE
   * @param value
   * @returns boolean
   */
  function getValidBoolean(value) {
    if (angular.isUndefined(value) || (typeof value !== 'boolean')) {
      value = false;
    }
    return value;
  }

};
