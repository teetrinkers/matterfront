var fs = require('fs');
var mkdirp = require('mkdirp').sync;
var nconf = require('nconf')
var path = require('path-extra');

var settings = {};

var getSettingsDir = function(homedir){
  homedir = homedir || path.homedir();
  return path.join(homedir, '.matterfront');
};

var getStatePath = function(homedir){
  var settingsDir = getSettingsDir(homedir);
  return path.join(settingsDir, 'state.json');
};

var getConfigPath = function(homedir){
  var settingsDir = getSettingsDir(homedir);
  return path.join(settingsDir, 'config.json');
};

var defaults = {
  teams: [{
    name: "subshell",
    url: "http://chat.subshell.com/subshell"
  }],
  window: {
    width: 1024,
    height: 600
  },
  "chrome-args": {},
  "showTrayIcon": true
};

settings.load = function(homedir){
  var statePath = getStatePath(homedir);
  var configPath = getConfigPath(homedir);

  nconf.argv();
  nconf.file("state", statePath);
  nconf.file("config", configPath);
  nconf.defaults(defaults);
};

settings.get = function(key){
  return nconf.get(key);
};

settings.set = function(key, value){
  nconf.set(key, value);
};

settings.append = function(key, value){
  var array = nconf.get(key) || [];
  array.push(value);
  nconf.set(key, array);
  return settings._current;
};

settings.saveState = function(homedir){
  var settingsDir = getSettingsDir(homedir);
  mkdirp(settingsDir);

  var statePath = getStatePath(homedir);
  var state = {
    teams: nconf.get("teams"),
    window: nconf.get("window")
  };
  var content = JSON.stringify(state, null, '\t');
  fs.writeFileSync(statePath, content);
};

module.exports = settings;
