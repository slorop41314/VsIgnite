import firebase, { RNFirebase } from "react-native-firebase";

const ANDROID_CHANNEL_ID = 'VsIgnite'
const ANDROID_CHANNEL_NAME = 'VsIgnite Channel'
const ANDROID_CHANNEL_DESCRIPTION = 'VsIgnite apps test channel'

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
    console.tron.error({message})
  });
}

export function setupNotificationListener() {
  const channel = new firebase.notifications.Android.Channel(ANDROID_CHANNEL_ID, ANDROID_CHANNEL_NAME, firebase.notifications.Android.Importance.Max)
  channel.setDescription(ANDROID_CHANNEL_DESCRIPTION);
  channel.enableLights(true);
  channel.enableVibration(true);
  channel.setVibrationPattern([500])
  channel.setSound('default')
  channel.setLockScreenVisibility(firebase.notifications.Android.Visibility.Public)
  channel.setBypassDnd(true)

  // Create the channel
  firebase.notifications().android.createChannel(channel);
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
    displayNotification(notification)
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

export function displayNotification(message) {
  let notification = new firebase.notifications.Notification(message);

  notification.android.setChannelId(ANDROID_CHANNEL_ID)
  notification.android.setAutoCancel(true)
  notification.android.setPriority(firebase.notifications.Android.Priority.High)
  notification.android.setOngoing(false)
  notification.android.setVibrate([300])
  // change small icon
  // notification.android.setSmallIcon('ic_stat_2')
  notification.setSound('default')
  firebase.notifications().displayNotification(notification);
}