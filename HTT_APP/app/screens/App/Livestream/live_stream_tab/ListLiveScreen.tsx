import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import LoadingProgress from '@app/components/LoadingProgress'
import { LIVESTREAM_STATUS } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestJoinLive } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, styleView } from '@app/theme'
import { showConfirm, showMessages } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { View } from 'react-native-animatable'
import { DataUserInfoProps } from '../../Account/Model'
import { updateListProductSelect } from '../../Product/slice/ListProductSlice'
import LiveStreamItem from '../component/LiveStreamItem'
import WarningLive from '../component/WarningLive'
import { LiveStremItemProps } from '../props'
import { updateVideoState } from '../slice/LiveSlice'
import { getListLiveStreamThunk } from '../slice/LiveStreamSlice'
import { styles } from '../styles'

const ListLiveScreen = (props: any) => {
  const { infoStreaming, getStreaming, onStopLive } = props
  const [isLoading, setIsLoading] = useState(false)
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const appDispatch = useAppDispatch()
  const listLiveStreamReducer = useAppSelector(
    state => state.ListLiveStreamReducer
  )
  const payload = {
    status: LIVESTREAM_STATUS.STREAMING,
  }
  const getData = () => {
    appDispatch(getListLiveStreamThunk(payload))
  }

  useEffect(() => {
    getData()
  }, [])

  const renderItem = ({
    item,
    index,
    ...props
  }: {
    item: LiveStremItemProps
    index: number
  }) => {
    const onPressItem = () => {
      SocketHelperLivestream?.socket.connect()
      if (
        listLiveStreamReducer?.data?.length &&
        listLiveStreamReducer?.data[0]?.user_id === userInfo?.id
      ) {
        showConfirm(
          R.strings().notification,
          'Bạn không thể tiếp tục phát live! Vui lòng tạo live mới.',
          () => {
            onStopLive()
          },
          '',
          'Tạo mới'
        )
        return
      }
      callAPIHook({
        API: requestJoinLive,
        payload: item.id,
        useLoading: setIsLoading,
        onSuccess: res => {
          SocketHelperLivestream.socket?.emit(
            `subscribe_livestream_channel`,
            res.data.id
          )
          appDispatch(updateListProductSelect({ data: res.data.products }))
          appDispatch(updateVideoState({ state: 2 }))
          NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_WATCHING, {
            data: res.data,
            appId: res.data.app_id,
            channelId: res.data.channel,
            token: res.data.token_subcriber,
            shopId: item.shop_id,
            livestream_id: item.id,
            tokenUser: userInfo.token,
            LivestreamProducts: res.data.products,
            shop: res.data.Shop,
            count_subcriber: res.data.count_subcriber,
            highlightProduct: res.data.HighlightProduct?.product,
          })
        },
        onError: err => {
          showMessages(
            R.strings().notification,
            'Kênh livestream không tồn tại!',
            getData
          )
        },
      })
    }
    return (
      <LiveStreamItem
        key={item.id}
        item={item}
        index={index}
        onPress={onPressItem}
        status={LIVESTREAM_STATUS.STREAMING}
      />
    )
  }

  if (listLiveStreamReducer.isLoading) return <Loading />
  if (listLiveStreamReducer.error) return <Error reload={getData} />
  return (
    <View style={{ flex: 1 }}>
      {!lodash.isEmpty(infoStreaming) ? <WarningLive /> : null}
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={() => {
          userInfo?.Shop ? getStreaming() : null
          getData()
        }}
        style={styles.vListStream}
        contentContainerStyle={[
          styles.vContentFlat,
          styleView.paddingBottomMain,
        ]}
        data={listLiveStreamReducer.data}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Empty backgroundColor={colors.backgroundColor} onRefresh={getData} />
        }
      />
      {isLoading && <LoadingProgress />}
    </View>
  )
}

export default ListLiveScreen
