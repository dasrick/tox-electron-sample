'use strict';

/**
 * @ngInject
 */
module.exports = function (app, AlertService, ipcRenderer, autoUpdater, $log, Menu, $translate) {
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


  if (!angular.isDefined(vm.os)) {
    ipcRenderer.send('get-os-data');
  }

  ipcRenderer.on('send-os-data', function (sender, os) {
    vm.os = os;

    // build the app menu
    var appMenu = Menu.buildFromTemplate(getAppMenuTemplate());
    Menu.setApplicationMenu(appMenu);
  });

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

};
