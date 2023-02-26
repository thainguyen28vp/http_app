import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native'
import ChatItem from './component/ChatItem'
import Search from '@app/components/Search'
import { colors } from '@app/theme'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import Loading from '@app/components/Loading'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getListConversation } from '@app/service/Network/chat/ChatApi'
import Empty from '@app/components/Empty/Empty'
import { useAppDispatch, useAppSelector } from '@app/store'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { SocketHelper } from '@app/utils/SocketHelper'
import reactotron from 'ReactotronConfig'
import { updateCountChat } from '../Notification/utils/NotificationUtils'
import { markIsReaded } from './slice/ChatSlice'

const ChatScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listConversation, setListConversation] = useState<any>([])
  const [textSearch, setTextSearch] = useState<string>('')

  const { data } = useAppSelector(state => state.accountReducer)
  const MessageNotRead = useAppSelector(
    state => state.ChatReducer
  ).messageNotRead
  const Dispatch = useAppDispatch()

  const listConversationRef = useRef<any[] | null>()

  const getData = () => {
    updateCountChat(Dispatch)
    callAPIHook({
      API: getListConversation,
      payload: { search: textSearch },
      useLoading: setIsLoading,
      onSuccess: res => {
        listConversationRef.current = res.data
        setListConversation(res.data)
      },
    })
  }

  const renderSocketEvent = (): string => {
    if (!!data?.id && !!data?.shop_id) return `shop_id_${data.shop_id}`
    return `user_id_${data.id}`
  }

  const onUpdateList = useCallback(
    (res: any) => {
      let cloneList = [...listConversationRef.current!]
      const targetIdx = cloneList.findIndex(item => item.id == res.data.id)
      cloneList[targetIdx] = res.data
      cloneList[targetIdx].Messages[0].create_at = new Date().toISOString()

      listConversationRef.current = cloneList
      setListConversation(cloneList)
    },
    [listConversation]
  )

  useEffect(() => {
  }, [listConversation])

  useEffect(() => {
    getData()
  }, [textSearch])

  useEffect(() => {
    SocketHelper.socket?.on(renderSocketEvent(), onUpdateList)

    return () => {
      SocketHelper.socket?.off(renderSocketEvent(), onUpdateList)
    }
  }, [])

  const renderSearch = () => {
    return (
      <View style={styles.searchView}>
        <Search
          containerStyle={styles.searchContainer}
          onSearch={text => setTextSearch(text)}
          placeholder="Tìm kiếm tên"
        />
      </View>
    )
  }

  const renderMessageItem: ListRenderItem<any> = useCallback(
    ({ item }) => {
      const isMessageNotRead = MessageNotRead?.some(
        msg => msg.topic_message_id == item.id
      )

      return (
        <ChatItem
          data={item}
          id={data.id}
          isNotRead={isMessageNotRead}
          shopId={data.shop_id}
          onPress={() => {
            if (isMessageNotRead) Dispatch(markIsReaded(item.id))
            NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
              conversationId: item.id,
              reloadList: () => getData(),
            })
          }}
        />
      )
    },
    [MessageNotRead]
  )

  const renderListConversation = () => {
    if (isLoading) return <Loading />

    return (
      <FlatList
        style={{ marginTop: 1 }}
        refreshing={isLoading}
        onRefresh={getData}
        showsVerticalScrollIndicator={false}
        data={listConversation || []}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderMessageItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
      />
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 1 }} />,
    []
  )

  return (
    <ScreenWrapper back unsafe titleHeader={'Tin nhắn'}>
      {renderSearch()}
      {renderListConversation()}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    height: 40,
    borderRadius: 50,
  },
  searchView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: colors.white,
    width: '100%',
  },
})

export default ChatScreen
