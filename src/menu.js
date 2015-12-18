var Menu = require('menu');
var menuTemplate = require("./menu-template.js");

var menu = {};

menu.load = function(browserWindow){
  appMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(appMenu);
  browserWindow.setMenu(appMenu);
};

module.exports = menu;
