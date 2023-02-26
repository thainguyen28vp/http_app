import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import {
  DEFAULT_PARAMS,
  DF_NOTIFICATION,
  NOTIFICATION_TYPE_VIEW,
  ORDER_STATUS_TAB,
} from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  requestReadAllotification,
  requestReadNotification,
} from '@app/service/Network/notification/NotificationApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import moment from 'moment'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Notification } from './model/Notification'
import {
  clearNotifyCount,
  readAllNotification,
  readNotification,
  requestListNotificationThunk,
  setCountNotify,
} from './slice/NotificationSlice'
import { updateCountNotification } from './utils/NotificationUtils'
import { useScrollToTop } from '@react-navigation/native'
import { requestJoinLive } from '@app/service/Network/livestream/LiveStreamApi'
import { SocketHelper } from '@app/utils/SocketHelper'
import { updateListProductSelect } from '../Product/slice/ListProductSlice'
import { updateVideoState } from '../Livestream/slice/LiveSlice'
import LoadingProgress from '@app/components/LoadingProgress'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import reactotron from 'ReactotronConfig'

const { width } = dimensions

const NOTIFICATION_ICON = {
  [DF_NOTIFICATION.ORDER_SHOP]: R.images.ic_order_notify,
  [DF_NOTIFICATION.COMMENT_POST]: R.images.ic_chat_notify,
  [DF_NOTIFICATION.LIKE_POST]: R.images.ic_chat_notify,
  [DF_NOTIFICATION.LIKE_COMMENT]: R.images.ic_chat_notify,
  [DF_NOTIFICATION.SHOP_CREATE_LIVESTREAM]: R.images.ic_livestream_notify,
  [DF_NOTIFICATION.ALL]: R.images.ic_all_notify,
  [DF_NOTIFICATION.REGISTER_USER]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.NEWS_POST]: R.images.ic_chat_notify,
  [DF_NOTIFICATION.GIFT_EXCHANGE]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.PROMOTION_POINT]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.REFERRAL_APP]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.REFERRAL_CODE]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.CONFIRM_PURCHASE_GIFT]: R.images.ic_gift_notify,
  [DF_NOTIFICATION.SEND_COMMENT]: R.images.ic_chat_notify,
  [DF_NOTIFICATION.COIN]: R.images.img_coin_user,
  [DF_NOTIFICATION.NEWS]: R.images.img_newspaper,
  [DF_NOTIFICATION.SUBTRACT_POINT]: R.images.img_point_payment,
  [DF_NOTIFICATION.REJECT_FLOWER_DELIVERY]: R.images.ic_shop,
  [DF_NOTIFICATION.APROVE_FLOWER_DELIVERY]: R.images.ic_shop,
}

const NotificationScreen = () => {
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const [loading, setIsLoading] = useState(false)
  const [loadingReadNoti, setIsLoadingNoti] = useState(false)

  const { data, isLoading, isLoadMore, isLastPage, error } = useAppSelector(
    state => state.NotificationReducer
  )
  const listRef = useRef<FlatList>(null)

  const Dispatch = useAppDispatch()

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (!onEndReachedCalledDuringMomentum && !isLastPage && !isLoadMore) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const onRefreshData = () => {
    setBody({ page: DEFAULT_PARAMS.PAGE })
    updateCountNotification(Dispatch)
  }

  const getData = () => {
    Dispatch(requestListNotificationThunk({ body, loadOnTop: false }))
  }

  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        listRef.current?.scrollToOffset({ animated: true, offset: 0 })
        setTimeout(() => {
          Dispatch(requestListNotificationThunk({ body, loadOnTop: true }))
        }, 300)
      },
    })
  )

  const onNavigation = (item: Notification, index: number) => {
    if (item.is_read == NOTIFICATION_TYPE_VIEW.NOT_VIEW) {
      callAPIHook({
        API: requestReadNotification,
        payload: { id: item.id },
        onSuccess: res => {
          Dispatch(readNotification(index))
          updateCountNotification(Dispatch)
        },
      })
    }

    switch (item.df_notification_id) {
      case DF_NOTIFICATION.ORDER_SHOP:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
          id: item.data.order_id,
          index: ORDER_STATUS_TAB.CONFIRMED,
        })
      case DF_NOTIFICATION.SHOP_CREATE_LIVESTREAM:
        callAPIHook({
          API: requestJoinLive,
          payload: item.data.live_stream_id,
          useLoading: setIsLoading,
          onSuccess: res => {
            SocketHelperLivestream?.socket.connect()
            // SocketHelper.socket?.emit(
            //   `subscribe_livestream_channel`,
            //   res.data.id
            // )
            SocketHelperLivestream.socket?.emit(
              `subscribe_livestream_channel`,
              res.data.id
            )
            Dispatch(
              updateListProductSelect({ data: res.data.LivestreamProducts })
            )
            Dispatch(updateVideoState({ state: 2 }))
            // NavigationUtil.navigate(SCREEN_ROUTER_APP.WATCHING_LIVE, {
            //   type: 'join',
            //   uid: item.user_id,
            //   appId: res.data.app_id,
            //   channelId: res.data.channel,
            //   token: res.data.token_subcriber,
            //   shopId: item.shop_id,
            //   livestream_id: item.id,
            //   tokenUser: userInfo.token || userInfo?.app_token,
            //   LivestreamProducts: res.data.LivestreamProducts,
            //   shop: res.data.Shop,
            //   count_subcriber: res.data.count_subcriber,
            //   highlightProduct: res.data.HighlightProduct,
            // })
            NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_WATCHING, {
              data: res.data,
              appId: res.data.app_id,
              channelId: res.data.channel,
              token: res.data.token_subcriber,
              shopId: item?.shop_id,
              livestream_id: item.data.live_stream_id,
              LivestreamProducts: res.data.LivestreamProducts,
              shop: res.data.Shop,
              count_subcriber: res.data.count_subcriber,
              highlightProduct: res.data.HighlightProduct,
            })
          },
          onError: err => {},
        })
        return
      // return NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_WATCHING, {
      //   livestream_id: item.data.live_stream_id,
      // })
      case DF_NOTIFICATION.LIKE_POST:
      case DF_NOTIFICATION.LIKE_COMMENT:
      case DF_NOTIFICATION.COMMENT_POST:
      case DF_NOTIFICATION.NEWS_POST:
      case DF_NOTIFICATION.SEND_COMMENT:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
          id: item.data.post_id,
        })
      case DF_NOTIFICATION.GIFT_EXCHANGE:
      case DF_NOTIFICATION.REGISTER_USER:
      case DF_NOTIFICATION.REFERRAL_APP:
      case DF_NOTIFICATION.REFERRAL_CODE:
      case DF_NOTIFICATION.PROMOTION_POINT:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)
      case DF_NOTIFICATION.CONFIRM_PURCHASE_GIFT:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.MY_GIFT)
      case DF_NOTIFICATION.COIN:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT, {
          type: 1,
        })
      case DF_NOTIFICATION.NEWS:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
          type: 2,
          item,
          id: item?.data?.id,
        })
      case DF_NOTIFICATION.SUBTRACT_POINT:
      case DF_NOTIFICATION.ADD_POINT:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)
      case DF_NOTIFICATION.APROVE_FLOWER_DELIVERY:
      case DF_NOTIFICATION.REJECT_FLOWER_DELIVERY:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.REQUEST_FLOWER, {
          type: 1,
        })
    }
  }

  useEffect(() => {
    getData()
  }, [body])

  const renderItem: ListRenderItem<Notification> = useCallback(
    ({ item, index }) => {
      return (
        <Button
          onPress={() => onNavigation(item, index)}
          children={
            <View
              style={{
                ...styleView.rowItem,
                backgroundColor: Boolean(item.is_read)
                  ? colors.white
                  : '#FFF5F5',
                padding: 15,
              }}
            >
              <FastImage
                style={styles.notifyIcon}
                source={NOTIFICATION_ICON[item.df_notification_id]}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...fonts.regular16,
                  }}
                  numberOfLines={3}
                  children={item.content || item.title}
                />
                <Text
                  style={styles.time}
                  children={moment(item?.created_at).fromNow()}
                />
              </View>
            </View>
          }
        />
      )
    },
    []
  )

  const renderItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  )

  const renderKey = useCallback((_, index) => `${index}`, [])

  const renderBody = () => {
    if (error) return <Error reload={getData} />
    return (
      <FlatList
        ref={listRef}
        contentContainerStyle={styleView.paddingBottomMain}
        showsVerticalScrollIndicator={false}
        data={data}
        refreshing={isLoading}
        onRefresh={onRefreshData}
        renderItem={renderItem}
        keyExtractor={renderKey}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReached={handleLoadMore}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
        ItemSeparatorComponent={renderItemSeparator}
        ListFooterComponent={
          isLoadMore ? <ActivityIndicator style={styles.loadMore} /> : null
        }
      />
    )
  }

  const rightComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          callAPIHook({
            API: requestReadAllotification,
            useLoading: setIsLoadingNoti,
            onSuccess(res) {
              Dispatch(readAllNotification({}))
              Dispatch(clearNotifyCount())
            },
            onError(err) {},
          })
        }}
      >
        <FastImage
          source={R.images.img_read_all_noti}
          style={{ width: 23, height: 23, right: 5 }}
          tintColor={colors.primary}
        />
      </TouchableOpacity>
    )
  }

  return (
    <ScreenWrapper
      unsafe
      isLoading={isLoading}
      backgroundColor={colors.white}
      titleHeader={'Thông báo'}
      rightComponent={rightComponent()}
    >
      {renderBody()}
      {loading || (loadingReadNoti && <LoadingProgress />)}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  separator: {
    width: width - 40,
    height: 1,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
  },
  notifyIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  time: {
    ...fonts.regular14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 10,
  },
  loadMore: { marginVertical: 10 },
})

export default NotificationScreen
