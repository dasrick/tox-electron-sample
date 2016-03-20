var fs = require('fs');
var path = require('path');
var electron = require('electron');
var app = electron.app;
var ipcMain = electron.ipcMain;
var BrowserWindow = electron.BrowserWindow;
var windowStateKeeper = require('electron-window-state');

var autoUpdater = require('auto-updater');
var os = require('os');
var platform = os.platform() + '_' + os.arch();
var version = app.getVersion();
var releaseUrl = 'https://tox-electron-sample-nuts.herokuapp.com/update/' + platform + '/' + version;

process.env.NODE_PATH = path.join(__dirname, 'node_modules');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform != 'darwin') {
  app.quit();
  //}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Load the previous state with fallback to defaults
  var mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Mein Title - deng', // ToDo überschreibt den Titel aus der index.html - vllt. brauht man das noch
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    resizable: true,
    center: true,
    show: true,
    frame: true,
    autoHideMenuBar: true,
    //icon: 'assets/icon.png',
    titleBarStyle: 'hidden-inset'
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(path.normalize('file://' + path.join(__dirname, 'index.html')));

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools({detach: true});
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // inject css by dark mode on/off
  mainWindow.webContents.on('dom-ready', function () {
    console.log('main webContents dom-ready');

    var cssFileName = (app.isDarkMode()) ? 'theme.dark.css' : 'theme.light.css';
    var cssFile = fs.readFileSync(path.resolve(__dirname, 'css', cssFileName), 'utf8');
    mainWindow.webContents.insertCSS(cssFile);
  });

  // das menu
  var appMenu = electron.Menu.buildFromTemplate(getAppMenuTemplate());
  electron.Menu.setApplicationMenu(appMenu);


  // === ### =======
  mainWindow.webContents.on('did-finish-load', function () {
    console.log('main webContents did-finish-load');
    console.log('releaseUrl: ' + releaseUrl);
    mainWindow.webContents.send('releaseUrl', releaseUrl);

    ipcMain.on('get-os-data', function () {
      console.log('main webContents send-os-data');
      mainWindow.webContents.send('send-os-data', getOsData());
    });

    if (process.env.NODE_ENV !== 'development') {
      autoUpdater.setFeedURL(releaseUrl);
      autoUpdater
        .on('error', function (error) {
          console.log('auto-updater on error: ', error);
          mainWindow.webContents.send('error', error);
        })
        .on('checking-for-update', function () {
          console.log('checking-for-update');
          mainWindow.webContents.send('checking-for-update');
        })
        .on('update-available', function () {
          console.log('update-available');
          mainWindow.webContents.send('update-available');
        })
        .on('update-not-available', function () {
          console.log('update-not-available');
          mainWindow.webContents.send('update-not-available');
        })
        .on('update-downloaded', function () {
          console.log('update-downloaded');
          mainWindow.webContents.send('update-downloaded');
          // autoUpdater.quitAndInstall();
        });
      autoUpdater.checkForUpdates();
      ipcMain.on('update-now', function () {
        console.log('main ipcMain update-now');
        // event.sender.send('update-now-reply', 'ACK');  // will nich
        autoUpdater.quitAndInstall();
      });
    }
  });
  // === ### =======
});

// OSX only
app.on('platform-theme-changed', function () {
  mainWindow.reload();
});


function getAppMenuTemplate() {
  var template = [
    {
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
    },
    {
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
            if (process.platform == 'darwin')
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
            if (process.platform == 'darwin')
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
    },
    {
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
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function () {
            require('electron').shell.openExternal('http://electron.atom.io')
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    var name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
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
    });
    // Window menu.
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }

  return template
}

function getOsData() {
  return {
    arch: os.arch(),
    cpus: os.cpus(),
    endianness: os.endianness(),
    freemem: os.freemem(),
    homedir: os.homedir(),
    hostname: os.hostname(),
    loadavg: os.loadavg(),
    networkInterfaces: os.networkInterfaces(),
    platform: os.platform(),
    release: os.release(),
    tmpdir: os.tmpdir(),
    totalmem: os.totalmem(),
    type: os.type(),
    uptime: os.uptime()
  };
}