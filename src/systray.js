const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const app = require('app');
const path = require('path');

var tray;

var defaultIcon = path.join(__dirname, '../resources/tray.png')
var unreadMessagesIcon = path.join(__dirname, '../resources/tray-unread.png');

var hasUnreadMessages = false;

var createMenu = function() {
  var menu = new Menu();
  menu.append(new MenuItem({
    label: 'Quit',
    click: function(item) {
      app.quit();
    }
  }));
  return menu;
}

function handleUnreadChange(event, arg) {
  var count = arg;
  if (count > 0 && !hasUnreadMessages) {
    hasUnreadMessages = true;
    tray.setImage(unreadMessagesIcon);
  } else if (!count && hasUnreadMessages) {
    hasUnreadMessages = false;
    tray.setImage(defaultIcon);
  }
}

var init = function(mainBrowserWindow) {
  if (process.platform !== 'win32') {
    return;
  }

  tray = new Tray(defaultIcon);
  tray.setToolTip(app.getName());

  var tray_menu = createMenu();
  tray.setContextMenu(tray_menu);

  tray.on('click', function() {
    mainBrowserWindow.show();
  });
  tray.on('balloon-click', function() {
    mainBrowserWindow.show();
  });

  ipc.on('notified', function(event, arg) {
    tray.displayBalloon({
      icon: path.join(__dirname, '../resources/mattermost.png'),
      title: arg.title,
      content: arg.options.body
    });
  });

  ipc.on('mention-count', handleUnreadChange);
  ipc.on('unread-count', handleUnreadChange);
}



module.exports = {
  init: init
};
