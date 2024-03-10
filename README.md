# Subscription Tracker

### This repo is a React Native (Expo) app created in a couple of hours because my wife was trying to find a way to keep track of all the subscriptions.

Sometimes you forget about the more expensive ones and you have a huge cost of renewals one month.

### Can you do it using Excel or spreadsheets? yes, but you also can do it by having fun with code


## Requeriments:

- Java 17 JDK
- expo library
- Node 16 or higher

## Local Run

- export JAVA_HOME=
- export ANDROID_HOME="/Users/{user}/Library/Android/sdk"
- Run Android Studio Emulator**
- npx expo prebuild
- npx expo run:android

### More details:

https://docs.expo.dev/guides/local-app-development/#local-app-compilation

## Publish

https://docs.expo.dev/build/setup/

- eas login
- eas build --platform android
- check build status: https://expo.dev/
- eas submit --platform android

https://docs.expo.dev/submit/android/

## Google Play Console

https://play.google.com/console

## Google AdMob

https://apps.admob.com/
