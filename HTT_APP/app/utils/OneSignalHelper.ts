import { Alert } from 'react-native'
import OneSignal from 'react-native-onesignal'
import reactotron from 'reactotron-react-native'
// import reactotron from 'reactotron-react-native'

// const onReceived = async (notification: any, props: any) => {
//   console.log('Notification received: ', notification)
// }
// const onOpened = async (openResult: any, props: any) => {
//   console.log('Message: ', openResult.notification.payload.body)
//   console.log('Data: ', openResult.notification.payload.additionalData)
//   console.log('isActive: ', openResult.notification.isAppInFocus)
//   console.log('openResult: ', openResult)
// }
// const onIds = async (device: any) => {
//   console.log('deviceID', device.userId)
//   // if (device && (await AsyncStorage.getItem(ASYNC_STORAGE.TOKEN))) {
//   //   console.log(device.userId);
//   //   updateDeviceID(device.userId);
//   // }
// }
// const initialization = (appId: string, props: any) => {
//   OneSignal.init(appId)
//   OneSignal.inFocusDisplaying(2)
//   OneSignal.addEventListener('received', (noti: any) => onReceived(noti, props))
//   OneSignal.addEventListener('opened', (noti: any) => onOpened(noti, props))
//   OneSignal.addEventListener('ids', onIds)
// }

// const destruction = () => {
//   OneSignal.removeEventListener('received', onReceived)
//   OneSignal.removeEventListener('opened', onOpened)
//   OneSignal.removeEventListener('ids', onIds)
// }

// export default {
//   initialization,
//   destruction,
// }

//OneSignal Init Code
OneSignal.setLogLevel(6, 0)

const initialization = (appId: string) => {
  OneSignal.setAppId(appId)
}
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log('Prompt response:', response)
})

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    Alert.alert!(JSON.stringify(notificationReceivedEvent))
    let notification = notificationReceivedEvent.getNotification()
    console.log('notification: ', notification)
    const data = notification.additionalData
    console.log('additionalData: ', data)
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification)
  }
)

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log('OneSignal: notification opened:', notification)
})

// OneSignal.

export { initialization }
