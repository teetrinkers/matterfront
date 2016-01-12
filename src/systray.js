const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const app = require('app');
const path = require('path');

var createMenu = function() {
  var menu = new Menu();
  menu.append(new MenuItem({
    label: 'Quit',
    click: function(item) {
      require('app').quit();
    }
  }));
  return menu;
}

var init = function(mainBrowserWindow) {
// if (process.platform === 'win32') {
  trayIconPath = path.join(__dirname, '../resources/tray.png')
  console.log("trayIconPath: " + trayIconPath);
  trayIcon = new Tray(trayIconPath);
  trayIcon.setToolTip(app.getName());

  var tray_menu = createMenu();
  trayIcon.setContextMenu(tray_menu);

  trayIcon.on('click', function() {
    mainBrowserWindow.show();
  });
  trayIcon.on('balloon-click', function() {
    mainBrowserWindow.show();
  });

  ipc.on('notified', function(event, arg) {
    trayIcon.displayBalloon({
      icon: path.join(__dirname, '../resources/mattermost.png'),
      title: arg.title,
      content: arg.options.body
    });
  });
}



module.exports = {
  init: init
};
