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
var mentionsIcon = path.join(__dirname, '../resources/tray-mention.png');

var unreadCount = 0;
var mentionsCount = 0;

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

function updateIcon() {
  if (mentionsCount > 0) {
    tray.setImage(mentionsIcon);
  } else if (unreadCount > 0) {
    tray.setImage(unreadMessagesIcon);
  } else {
    tray.setImage(defaultIcon);
  }
}

function handleUnreadChange(event, arg) {
  var previousCount = unreadCount;
  unreadCount = arg;
  if (previousCount != unreadCount) {
    updateIcon();
  }
}

function handleMentionsChange(event, arg) {
  var previousCount = mentionsCount;
  mentionsCount = arg;
  if (previousCount != mentionsCount) {
    updateIcon();
  }
}

var init = function(mainBrowserWindow) {

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

  ipc.on('mention-count', handleMentionsChange);
  ipc.on('unread-count', handleUnreadChange);
}



module.exports = {
  init: init
};
