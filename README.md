#  VsIgnite
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native App Utilizing [Ignite](https://github.com/infinitered/ignite)

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `yarn` or `npm i`

## :arrow_up: Appcenter Setup

 **Step 1:** Create Account in AppCenter website

 **Step 2:** Create new apps for specific iOS and Android platforms in appcenter dashboard

 **Step 3:** for android change APP_SCRET in android/app/src/main/assets/appcenter-config.json

 **Step 4:** for android add key Staging and Production in android/app/build.gradle

 **Step 5:** for iOS running command cd ios && pod install && cd ..

 **Step 6:** open project via xcode

 **Step 7:** Change YOUR_SCRET in AppCenter-Config.plist in the IOS folder

## :arrow_up: Instabug Setup

**Step 1:** Create account in instabug website

**Step 2:** Change INSTABUGLIVETOKEN AND INSTABUGBETATOKEN in all .env file(env, staging, production) from your instabug project dashboard

## :arrow_up: Firebase and Push Notification Setup

**Step 1:** Create android and ios project in firebase console

**Step 2:** Download and replace current google-services.json and GoogleService-Info.plist with your project file

**Step 3:** For ios, you need to link APNS with FCM, follow this docs to enable push notifications in ios,(Linking APNs with FCM (iOS) section) https://rnfirebase.io/messaging/usage/ios-setup

**Step 4:** You now can test sending noticiations from your firebase dashboard


## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `cd ios && pod install && cd .. && react-native run-ios`
  * for Android
    * Run Genymotion
    * run `react-native run-android`

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [husky](https://github.com/typicode/husky). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file:

```
API_URL=https://myapi.com
GOOGLE_MAPS_API_KEY=abcdefgh
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_URL  // 'https://myapi.com'
Secrets.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
```

The `.env` file is ignored by git keeping those secrets out of your repo.

### Get started:
1. Copy .env.example to .env
2. Add your config variables
3. Follow instructions at [https://github.com/luggit/react-native-config#setup](https://github.com/luggit/react-native-config#setup)
4. Done!
