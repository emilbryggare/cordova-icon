var fs     = require('fs');
var path   = require('path');
var xml2js = require('xml2js');
var ig     = require('imagemagick');
var colors = require('colors');
var _      = require('underscore');
var Q      = require('q');
var wrench = require('wrench');

/**
 * @var {Object} settings - names of the config file and of the icon image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.CONFIG_FILE = 'mobile-config.js';
settings.ICON_FILE   = 'icon.png';
settings.DESTINATION   = 'resources/icons/';
settings.IOS_ICONS = [
  { name : 'iphone_2x.png', size: 120 },
  { name : 'iphone_3x.png', size: 180 },
  { name : 'ipad.png', size: 76 },
  { name : 'ipad_2x.png', size: 152 },
  { name : 'ipad_pro.png', size: 167 },
  { name : 'ios_settings.png', size: 29 },
  { name : 'ios_settings_2x.png', size: 58 },
  { name : 'ios_settings_3x.png', size: 87 },
  { name : 'ios_spotlight.png', size: 40 },
  { name : 'ios_spotlight_2x.png', size: 80 },
];
settings.ANDROID_ICONS = [
  { name : 'android_mdpi.png', size: 48 },
  { name : 'android_hdpi.png', size: 72 },
  { name : 'android_xhdpi.png', size: 96 },
  { name : 'android_xxhdpi.png', size: 144 },
  { name : 'android_xxxhdpi.png', size: 192 },
];
/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (icon) {
  var deferred = Q.defer();
  var srcPath = settings.ICON_FILE;
  var dstPath = settings.DESTINATION + icon.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    wrench.mkdirSyncRecursive(dst);
  }
  ig.resize({
    srcPath: srcPath,
    dstPath: dstPath,
    quality: 1,
    format: 'png',
    width: icon.size,
    height: icon.size
  } , function(err, stdout, stderr){
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      display.success(icon.name + ' created');
    }
  });
  if (icon.height) {
    ig.crop({
      srcPath: srcPath,
      dstPath: dstPath,
      quality: 1,
      format: 'png',
      width: icon.size,
      height: icon.height
    } , function(err, stdout, stderr){
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
        display.success(icon.name + ' cropped');
      }
    });
  }
  return deferred.promise;
};

/**
 * Generates icons based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateIcons = function (platform) {
  display.header('Generating Icons for ' + platform);

  var icons = [];
  if (platform == 'all') {
    icons = settings.IOS_ICONS.concat(settings.ANDROID_ICONS)
  } else if (platform == 'ios') {
    icons = settings.IOS_ICONS;
  } else if (platform == 'android') {
    icons = settings.ANDROID_ICONS;
  }

  var all = [];
  icons.forEach(function (icon) {
    all.push(generateIcon(icon));
  });
  return Promise.all(all);
};

/**
 * Checks if a valid icon file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {
  display.header('Checking Icon');
  var deferred = Q.defer();
  fs.exists(settings.ICON_FILE, function (exists) {
    if (exists) {
      display.success(settings.ICON_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.ICON_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};
/**
 * Receives selected platforms for command line input.
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var getPlatforms = function () {
  display.header('Checking Arguments');
  var deferred = Q.defer();
  var args = process.argv.slice(2);
  switch (args.length) {
    case 0:
      var platform = 'all';
      display.success('Selected all platforms.');
      deferred.resolve(platform);
      break;
    case 1:
      var platform = args[0];
      if (platform == 'ios' || platform == 'android') {
        display.success('Selected ' + args[0]);
        deferred.resolve(platform);
        break;
      }
    default:
      display.error('Usage: meteor-cordova-icon [ios||android].');
      deferred.reject();
      break;
  }
  return deferred.promise;
};

validIconExists()
.then(getPlatforms)
.then(generateIcons)
.catch(function (err) {
  if (err) {
    console.log(err);
  }
}).then(function () {
  console.log('');
});
