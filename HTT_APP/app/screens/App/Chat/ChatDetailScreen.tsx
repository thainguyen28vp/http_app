import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react'
import {
  Text,
  View,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  AppState,
} from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import FastImage from 'react-native-fast-image'
import InputToolbar from './component/InputToolbar'
import Loading from '@app/components/Loading'
import { useAppDispatch, useAppSelector } from '@app/store'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getConversationUserInfor,
  getDetailConversation,
  requestReadAllChat,
  requestSendExistConversation,
} from '@app/service/Network/chat/ChatApi'
import {
  DEFAULT_PARAMS,
  MESSAGE_EVENT,
  SOCKET_ON_MESSAGE_CHANNEL_EVENT,
} from '@app/config/Constants'
import { SocketHelper } from '@app/utils/SocketHelper'
import MediaPickerModal from '@app/components/MediaPickerModal'
import FstImage from '@app/components/FstImage/FstImage'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import DateUtil from '@app/utils/DateUtil'
import moment from 'moment'
import { Message } from './model/Message'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { updateCountChat } from '../Notification/utils/NotificationUtils'
import reactotron from 'ReactotronConfig'
import { useToggleInConversation } from './ChatContext'
import { handleResizeImage } from '@app/utils/FuncHelper'
import { updateCountNotRead } from './slice/ChatSlice'
// import ChatStateProvider, { ChatStateContext } from './ChatContext'

const ChatDetailScreen = (props: any) => {
  const conversationId = props.route.params?.conversationId
  const reloadList = props.route.params?.reloadList

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [conversationDetail, setConversationDetail] = useState<Array<Message>>(
    []
  )
  const [conversationUserInfor, setConversationUserInfor] = useState<any>({
    user: undefined,
    shop: undefined,
  })

  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const [img, setImg] = useState<any>()

  const paging = useRef<any>()
  const conversationDataRef = useRef<any[] | null>()
  const inputRef = useRef<TextInput>(null)
  const previousTimeRef = useRef()

  const AccountData = useAppSelector(state => state.accountReducer)
  const Dispatch = useAppDispatch()
  const currentId = AccountData.data.account_id
  const currentShopId = AccountData.data.account_id

  const navigation = useNavigation()

  const toggleIsInConversation = useToggleInConversation()

  const targetInfor =
    currentId == conversationUserInfor?.user?.account_id
      ? conversationUserInfor.shop
      : conversationUserInfor.user

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      conversationDetail.length <= paging.current?.totalItemCount! &&
      !isLoadMore
    ) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const handleOnSendPress = (res: any) => {
    const body = new FormData()
    if (!!res.content && !res.img) body.append('content', `${res.content}`)
    else if (!res.content && !!res.img)
      body.append('message_media', {
        name: `images${new Date().getTime()}.jpg`,
        type: 'image/jpeg',
        uri: res.img,
      })
    else {
      body.append('content', `${res.content}`)
      body.append('message_media', {
        name: `images${new Date().getTime()}.jpg`,
        type: 'image/jpeg',
        uri: res.img,
      })
    }

    setImg(undefined)

    callAPIHook({
      API: requestSendExistConversation,
      payload: { topic_message_id: conversationId, body },
      onSuccess(res) {
        var newConversationData: any = [...conversationDataRef.current!]
        newConversationData.unshift({
          ...res.data,
          create_at: new Date().getTime(),
        })
        conversationDataRef.current = newConversationData
        setConversationDetail(newConversationData)
      },
    })
  }

  const onBack = async () => {
    // await callAPIHook({
    //   API: requestReadAllChat,
    //   payload: { topic_message_id: conversationId },
    //   onSuccess: res => {
    //     Dispatch(updateCountNotRead(0))
    //   },
    // })
    Dispatch(updateCountNotRead(0))
    NavigationUtil.goBack()
  }

  const getConversationData = () => {
    callAPIHook({
      API: getDetailConversation,
      payload: { topic_message_id: conversationId, body },
      useLoading:
        body.page == DEFAULT_PARAMS.PAGE ? setIsLoading : setIsLoadMore,
      onSuccess: res => {
        paging.current = res.paging
        let listClone: any
        if (body.page != DEFAULT_PARAMS.PAGE) {
          listClone = [...conversationDetail, ...res.data]
        } else {
          listClone = [...res.data]
        }
        conversationDataRef.current = listClone
        setConversationDetail(listClone)
      },
    })
  }

  const handleAppStateChange = (nextState: any) => {
    SocketHelper.socket.emit(
      SOCKET_ON_MESSAGE_CHANNEL_EVENT.SUBSCRIBE_MESSAGE_CHANNEL,
      conversationId
    )
  }

  const getUserData = () => {
    callAPIHook({
      API: getConversationUserInfor,
      payload: { id: conversationId },
      onSuccess: res => {
        setConversationUserInfor({
          user: res.data.User,
          shop: res.data.Shop,
        })
      },
    })
  }

  const handleOnPicker = async (res: any) => {
    // let url = await handleResizeImage(res.data[0])
    // setImg(url)
    setImg(res.data[0])
  }

  const handleOnMessage = useCallback((res: any) => {
    var newConversationData: any = [...conversationDataRef.current!]
    switch (res.type_action) {
      case MESSAGE_EVENT.SEND_MESSAGE:
        if (AccountData?.data?.account_id !== res?.data?.account_id) {
          newConversationData.unshift({
            ...res.data,
            create_at: new Date().getTime(),
          })
          conversationDataRef.current = newConversationData
          setConversationDetail(newConversationData)
          return
        }
    }

    // updateCountChat(Dispatch)
  }, [])

  useFocusEffect(
    useCallback(() => {
      toggleIsInConversation(true)
      SocketHelper?.socket?.emit(
        SOCKET_ON_MESSAGE_CHANNEL_EVENT.SUBSCRIBE_MESSAGE_CHANNEL,
        conversationId
      )

      return () => {
        toggleIsInConversation(false)
        SocketHelper?.socket?.emit(
          SOCKET_ON_MESSAGE_CHANNEL_EVENT.UNSUBSCRIBE_MESSAGE_CHANNEL,
          conversationId
        )
      }
    }, [conversationId])
  )

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false })
  }, [navigation])

  useEffect(() => {
    getUserData()
    SocketHelper.socket?.on(`topic_message_${conversationId}`, handleOnMessage)
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
      SocketHelper.socket?.off(
        `topic_message_${conversationId}`,
        handleOnMessage
      )
    }
  }, [])

  useEffect(() => {
    getConversationData()
  }, [body])

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    const targetAvt = targetInfor?.profile_picture_url
    // const isOwnerMessage =
    // currentId == item.user_id || currentShopId == item.shop_id
    const isOwnerMessage = currentId == item.account_id
    if (index == 0) previousTimeRef.current = item.create_at

    let previousTime = moment(previousTimeRef.current)
    let currentTime = moment(item.create_at)
    let isSameDay = previousTime.isSame(currentTime, 'day')

    if (!isSameDay && index != 0) {
      previousTimeRef.current = item.create_at
    }

    const renderTimeDiff = (time: string) => (cond: boolean) => {
      if (cond) {
        return (
          <View style={styles.timeDiffView}>
            <View style={styles.lineHorizontal} />
            <View
              style={{
                backgroundColor: '#CCCCCC',
                padding: 3,
                borderRadius: 20,
              }}
              children={
                <Text
                  style={styles.timeDiff}
                  children={`${DateUtil.formatDisplayDate(time)}`}
                />
              }
            />
            <View style={styles.lineHorizontal} />
          </View>
        )
      }
    }

    return (
      <View style={{ alignItems: 'center' }}>
        {renderTimeDiff(item.create_at)(index == conversationDetail.length - 1)}
        <View style={{ ...styleView.rowItem }}>
          {isOwnerMessage && <View style={{ flex: 1 }} />}
          {!isOwnerMessage && (
            <FastImage
              style={styles.targetAvt}
              source={!!targetAvt ? { uri: targetAvt } : R.images.img_user}
            />
          )}
          <View
            style={{
              minHeight: 40,
              marginRight: 10,
              marginLeft: 10,
              maxWidth: '65%',
            }}
          >
            <View
              style={[
                styles.wrapperOwnConversation,
                {
                  backgroundColor: isOwnerMessage
                    ? 'rgba(18, 144, 204, .4)'
                    : 'rgba(0, 0, 0, 0.06)',
                },
              ]}
            >
              {!!item.message_media_url && (
                <Button
                  onPress={() =>
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.MEDIA_VIEWER, {
                      data: [{ url: item.message_media_url, type: 0 }],
                      index: 0,
                    })
                  }
                  children={
                    <FstImage
                      style={styles.conversationImg}
                      source={{ uri: item.message_media_url }}
                    />
                  }
                />
              )}
              {!!item.content && (
                <Text
                  selectable
                  style={[
                    styles.conversationContent,
                    { marginTop: !!item.message_media_url ? 10 : 0 },
                    {
                      alignSelf:
                        !!item.message_media_url && isOwnerMessage
                          ? 'flex-end'
                          : 'flex-start',
                    },
                  ]}
                  children={item.content?.replace(/\s{2,}/g, ' ').trim()}
                />
              )}
            </View>
            <Text
              style={[
                styles.replyTime,
                { alignSelf: isOwnerMessage ? 'flex-start' : 'flex-end' },
              ]}
              children={DateUtil.formatTime(item.create_at)}
            />
          </View>
          {!isOwnerMessage && <View style={{ flex: 1 }} />}
        </View>
        {renderTimeDiff(conversationDetail[index - 1]?.create_at)(
          !isSameDay && index != 0
        )}
      </View>
    )
  }

  const renderConversationDetail = () => {
    if (isLoading) return <Loading />

    return (
      <FlatList
        data={conversationDetail}
        renderItem={renderItem}
        inverted
        style={{ backgroundColor: colors.white }}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 30 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        ItemSeparatorComponent={renderItemSeparator}
        ListFooterComponent={
          isLoadMore ? (
            <ActivityIndicator style={{ marginVertical: 10 }} />
          ) : null
        }
      />
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 10 }} />,
    []
  )

  return (
    <ScreenWrapper
      back
      unsafe
      titleHeader={`${targetInfor?.name || 'Quản trị viên'}`}
      borderBottomHeader={'rgba(0, 0, 0, .1)'}
      onBack={onBack}
    >
      {renderConversationDetail()}
      <InputToolbar
        onSend={handleOnSendPress}
        ref={inputRef}
        imgInfor={img}
        onCameraPress={() => setIsVisible(true)}
        onClearAsset={() => setImg(undefined)}
      />
      <MediaPickerModal
        isVisible={isVisible}
        useVisible={setIsVisible}
        onPicker={handleOnPicker}
        // onPicker={handleOnSendPress}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  targetAvt: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  wrapperOwnConversation: {
    ...styleView.centerItem,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  conversationContent: {
    ...fonts.regular16,
    color: '#262626',
  },
  conversationImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 5,
  },
  replyTime: {
    ...fonts.regular10,
    color: '#8C8C8C',
    marginLeft: 3,
    marginTop: 3,
  },
  timeDiffView: {
    ...styleView.rowItem,
    alignItems: 'center',
    marginVertical: 15,
  },
  timeDiff: {
    ...fonts.regular12,
    marginHorizontal: 5,
    color: colors.white,
  },
  lineHorizontal: { width: '30%', height: 1, backgroundColor: '#cccccc' },
})

export default ChatDetailScreen
