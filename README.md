# meteor-cordova-icon

<img src="cordova-icon-resize.png"/>

Automatic icon resizing for Meteor with Cordova. Create an icon in the root folder of your Meteor project and use meteor-cordova-icon to automatically resize and copy it for Android and iOS.

The generated images will be placed in resources/icons/


### Installation

     $ npm install meteor-cordova-icon -g

### Requirements

- ImageMagick installed (*Mac*: `brew install imagemagick`, *Debian/Ubuntu*: `sudo apt-get install imagemagick`, *Windows*: [See here](http://www.imagemagick.org/script/binary-releases.php#windows))

### Usage

Create an `icon.png` file in the root folder of your Meteor project.

Then run:

     $ meteor-cordova-icon

For good results, your file should be:

- square
- for Android and iOS, at least 192\*192px (512\*512px recommended to be future-proof)
- for Windows, at least 1240\*1240px

### Config
Copy relevant contents the configuration below to your mobile-config.js file.

    // mobile-config.js
    App.icons({
      iphone: 'resources/icons/iphone.png',
      iphone_2x: 'resources/icons/iphone_2x.png',
      iphone_3x: 'resources/icons/iphone_3x.png',
      ipad: 'resources/icons/ipad.png',
      ipad_2x: 'resources/icons/ipad_2x.png',
      ipad_pro: 'resources/icons/ipad_pro.png',
      ios_settings: 'resources/icons/ios_settings.png',
      ios_settings_2x: 'resources/icons/ios_settings_2x.png',
      ios_settings_3x: 'resources/icons/ios_settings_3x.png',
      ios_spotlight: 'resources/icons/ios_spotlight.png',
      ios_spotlight_2x: 'resources/icons/ios_spotlight_2x.png',
      android_ldpi: 'resources/icons/android_ldpi.png',
      android_mdpi: 'resources/icons/android_mdpi.png',
      android_hdpi: 'resources/icons/android_hdpi.png',
      android_xhdpi: 'resources/icons/android_xhdpi.png',
      android_xxhdpi: 'resources/icons/android_xxhdpi.png',
      android_xxxhdpi: 'resources/icons/android_xxxhdpi.png',
    });

### Splash screens

Check out [meteor-cordova-splash](https://github.com/emilbryggare/meteor-cordova-splash)

### Acknowledgements
This is a fork of [cordova-icon](https://github.com/AlexDisler/cordova-icon) by Alex Disler. Most of the work was already done by him.

### License

MIT
