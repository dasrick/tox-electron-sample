var fs = require('fs');
var path = require('path');
var electron = require('electron');
var app = electron.app;
var ipcMain = electron.ipcMain;
var BrowserWindow = electron.BrowserWindow;
var windowStateKeeper = require('electron-window-state');

// var autoUpdater = require('auto-updater');
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

  // === ### =======
  mainWindow.webContents.on('did-finish-load', function () {
    console.log('main webContents did-finish-load');

    // auto-updater only in !development
    // console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    // if (process.env.NODE_ENV !== 'development') {
    //   console.log('send-release-url: ', releaseUrl);
    //   mainWindow.webContents.send('send-release-url', releaseUrl);
    // }
    
    ipcMain.on('get-release-url', function () {
      console.log('main webContents send-release-url');
      mainWindow.webContents.send('send-release-url', releaseUrl);
    });

    ipcMain.on('get-os-data', function () {
      console.log('main webContents send-os-data');
      mainWindow.webContents.send('send-os-data', getOsData());
    });

    ipcMain.on('get-node-env', function () {
      console.log('main webContents send-node-env');
      mainWindow.webContents.send('send-node-env', process.env.NODE_ENV);
    });

    // if (process.env.NODE_ENV !== 'development') {
    //   autoUpdater.setFeedURL(releaseUrl);
    // autoUpdater
    //   .on('error', function (error) {
    //     console.log('auto-updater on error: ', error);
    //     mainWindow.webContents.send('error', error);
    //   })
    //   .on('checking-for-update', function () {
    //     console.log('checking-for-update');
    //     mainWindow.webContents.send('checking-for-update');
    //   })
    //   .on('update-available', function () {
    //     console.log('update-available');
    //     mainWindow.webContents.send('update-available');
    //   })
    //   .on('update-not-available', function () {
    //     console.log('update-not-available');
    //     mainWindow.webContents.send('update-not-available');
    //   })
    //   .on('update-downloaded', function () {
    //     console.log('update-downloaded');
    //     mainWindow.webContents.send('update-downloaded');
    //     // autoUpdater.quitAndInstall();
    //   });
    // autoUpdater.checkForUpdates();
    // ipcMain.on('update-now', function () {
    //   console.log('main ipcMain update-now');
    //   // event.sender.send('update-now-reply', 'ACK');  // will nich
    //   autoUpdater.quitAndInstall();
    // });
    // }
  });
  // === ### =======
});

// OSX only
app.on('platform-theme-changed', function () {
  mainWindow.reload();
});

// current helper to get os-Data into angular ...
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