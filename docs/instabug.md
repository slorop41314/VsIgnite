## iOS Setup

1. Run `cd ios && pod install && cd ..` to install all the necessary CocoaPods dependencies.

## Using Instabug

### iOS

1. Place INSTABUG_APP_TOKEN in the `/index.js` file
    ```javascript
    Instabug.startWithToken('INSTABUG_APP_TOKEN', [Instabug.invocationEvent.shake]);
    ```

### android
1. Place INSTABUG_APP_TOKEN in the `/android/app/src/main/java/[...]/MainApplication.java` file

    ```java
       @Override
          public void onCreate() {
            new RNInstabugReactnativePackage
                    .Builder("INSTABUG_APP_TOKEN", MainApplication.this)
                    .setInvocationEvent("shake")
                    .setPrimaryColor("#1D82DC")
                    .setFloatingEdge("left")
                    .setFloatingButtonOffsetFromTop(250)
                    .build();
            super.onCreate();
            SoLoader.init(this, /* native exopackage */ false);
          }
      ```
