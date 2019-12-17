import firebase from "react-native-firebase";

export function setupNotificationPermission() {
  return new Promise(async (resolve, reject) => {
    try {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        // user has permissions
        resolve(true)
      } else {
        // user doesn't have permission
        await firebase.messaging().requestPermission();
        resolve(true)
      }
    } catch (error) {
      resolve(false)
    }
  })
}

export function setupTokenRegistration() {
  return new Promise(async (resolve, reject) => {
    try {
      firebase.messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {
            // user has a device token
            resolve(fcmToken)
          } else {
            resolve(undefined)
            // user doesn't have a device token yet
          }
        });

      firebase.messaging().onTokenRefresh(fcmToken => {
        // Process your token as required
        resolve(fcmToken)
      });
    } catch (error) {
      reject(error)
    }
  })
}

export function setupMessageListener() {
  firebase.messaging().onMessage((message) => {
    // Process your message as required
  });
}

export function setupNotificationListener() {
  // Get initial notification
  firebase.notifications().getInitialNotification()
    .then((notificationOpen) => {
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        handlePressNotification(notification)
      }
    });

  // On display notification listener
  firebase.notifications().onNotificationDisplayed((notification) => {
    // Process your notification as required
    // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
  });

  // On receive notitication listener
  firebase.notifications().onNotification((notification) => {
    // Process your notification as required
    console.tron.error({ notification })
  });

  // On open notification listener
  firebase.notifications().onNotificationOpened((notificationOpen) => {
    // Get the action triggered by the notification being opened
    const action = notificationOpen.action;
    // Get information about the notification that was opened
    const notification = notificationOpen.notification;
    handlePressNotification(notification)
  });
}

export function handlePressNotification(notification) {
  console.tron.warn({ notification })
}