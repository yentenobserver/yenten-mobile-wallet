# yVault - Yenten coin mobile wallet (android and one day ios)
Yenten mobile wallet for Android (and one day maybe for iOs)

## Prerequisites
* node v14+
* npm
* expo 40+
* expo account and app on your mobile device for dev testing

## Functionality
The app was built with simplicity and ease of installation in mind. Thus current version of the app supports only one yenten address - this is a little different approach than the one used in Yenten core wallet. The creator of the app strongly believes that for the casual Yenten user this is by far the best approach. It's as safe as a regular, full node Yenten wallet, much safer than any "cloud" wallet, but does not require deep technical knowledge to setup the full node and sync with blockchain. 

## Technology 
App is written in React Native and can be built into Android and iOs applications (soon I hope). 
The app uses remote blockchain index/node service.
Private keys are stored solely on the device and transaction signing takes place on the device - only the signed transaction leaves the device.

## Roadmap
The app was built in response to many requests on Yenten community discussion groups. Having an MVP allows to discuss with the community future development of this app but here are some points proposed already:
* multiaddress support
* possibility to send message along with coins

Hope the roadmap will be updated shortly.

## Installation and setup
```
#install expo
npm install --global expo-cli
# install dependencies
npm install
# start local app instance
expo r -c
```
From now on you can use your device to scan expo qrcode and run dev application on your device.

## Distributing Android app
To build apk android app issue following:
```
expo build:android -t apk
```

The resulting apk can be copied to your device or run on android emulator on your computer.


For more details on build please refer to expo documentation:

https://docs.expo.io/distribution/building-standalone-apps/

## App installation (Android)
The app is available in Google Play store at:

https://play.google.com/store/apps/details?id=ml.yvault.app

Explainer videos are available on YouTube
https://www.youtube.com/channel/UCBSUO0iDqyeP9ISKKK1X8_Q

## Support & disclaimer & buy me a coffee
If you have any questions or problems please raise a github issue.

The app is provided as is, without any warranty. I did my best to make it reliable and stable but it's only a community effort as I'm just the lone Yenten supporter. So please always backup/export (yes, you can try the "passport hodl" functionality in the app) your private keys just in case there is a bug in the app and you need to reinstall.

If you like the app you can endorse me and buy me a coffee by sending a couple of YTN coins to:

YgKbeZrDbGy75nHYwtBeW8ngSLbPJdLUmn

