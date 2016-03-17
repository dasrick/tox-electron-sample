var fs = require('fs');
var path = require('path');
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

//const injectBundle = require('./inject-onload.js');

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
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Mein Title - deng', // ToDo überschreibt den Titel aus der index.html - vllt. brauht man das noch
    width: 800,
    height: 600,
    resizable: true,
    center: true,
    show: true,
    frame: true,
    autoHideMenuBar: true,
    //icon: 'assets/icon.png',
    titleBarStyle: 'hidden-inset'
  });

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

  mainWindow.webContents.on('dom-ready', function () {
    var cssFileName = (app.isDarkMode()) ? 'theme.dark.css' : 'theme.light.css';
    var cssFile = fs.readFileSync(path.resolve(__dirname, 'css', cssFileName), 'utf8');
    mainWindow.webContents.insertCSS(cssFile);
    //mainWindow.webContents.executeJavaScript(`injectBundle.getBadgeJS()`);
  });

});

// OSX only
//console.log('dark mode: ', app.isDarkMode());
app.on('platform-theme-changed', function () {
  mainWindow.reload();
});