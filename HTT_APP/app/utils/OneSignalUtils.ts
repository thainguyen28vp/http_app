import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import OneSignal from 'react-native-onesignal'
import reactotron from 'ReactotronConfig'
import { APP_ID, DF_NOTIFICATION } from '@app/config/Constants'
import { Dispatch } from 'redux'
import {
  refreshNotification,
  updateCountChat,
  updateCountNotification,
} from '@app/screens/App/Notification/utils/NotificationUtils'

export default abstract class OneSignalUtil {
  private static Dispatch: Dispatch
  private static isInConversation: boolean

  static updateIsInConversation(state: boolean) {
    this.isInConversation = state
  }

  static initialize(Dispatch: Dispatch) {
    this.Dispatch = Dispatch
    OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId(APP_ID)
  }

  static onPushNotification() {
    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      // console.log('Prompt response:', response)
    })

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification()
        this.onShow(notification)
        notificationReceivedEvent.complete(notification)
      }
    )

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      this.onOpened(notification)
    })
  }

  static onShow = (notification: any) => {
    let type = notification.additionalData.df_notification_id

    updateCountNotification(this.Dispatch)
    // refreshNotification(this.Dispatch)

    switch (type) {
      case DF_NOTIFICATION.NEW_MESSAGE:
      return updateCountChat(this.Dispatch)
      default:
        break
    }
  }

  static onOpened = ({ notification }: any) => {
    let data = notification.additionalData
    let type = data?.df_notification_id
    switch (type) {
      case DF_NOTIFICATION.LIKE_POST:
      case DF_NOTIFICATION.LIKE_COMMENT:
      case DF_NOTIFICATION.COMMENT_POST:
      case DF_NOTIFICATION.SEND_COMMENT:
      case DF_NOTIFICATION.NEWS_POST:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
          id: data.data.post_id,
        })
        break
      case DF_NOTIFICATION.ORDER_SHOP:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
          id: data.data.order_id,
          index: data.data.order_status,
        })
        break
      case DF_NOTIFICATION.SHOP_CREATE_LIVESTREAM:
        // NavigationUtil.navigate(SCREEN_ROUTER.MAIN, {
        //   screen: SCREEN_ROUTER_APP.WATCHING_LIVE,
        //   params: { livestream_id: data.data.live_stream_id },
        // })
        break
      case DF_NOTIFICATION.REQUESTED_FLOWER_DELIVERY:
      case DF_NOTIFICATION.APROVE_FLOWER_DELIVERY:
      case DF_NOTIFICATION.REJECT_FLOWER_DELIVERY:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.REQUEST_FLOWER)
        break
      case DF_NOTIFICATION.GIFT_EXCHANGE:
      case DF_NOTIFICATION.REGISTER_USER:
      case DF_NOTIFICATION.REFERRAL_APP:
      case DF_NOTIFICATION.REFERRAL_CODE:
      case DF_NOTIFICATION.PROMOTION_POINT:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)
        break
      case DF_NOTIFICATION.CONFIRM_PURCHASE_GIFT:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.MY_GIFT)
        break
      case DF_NOTIFICATION.NEW_MESSAGE:
        if (!this.isInConversation)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
            conversationId: data.id,
          })
        else
          NavigationUtil.replace(SCREEN_ROUTER_APP.CHAT_DETAIL, {
            conversationId: data.id,
          })
        break
      case DF_NOTIFICATION.COIN:
        NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT, { type: 1 })
        break
      default:
        NavigationUtil.navigate(SCREEN_ROUTER.MAIN, {
          screen: SCREEN_ROUTER_APP.HOME,
        })
    }
  }
}
