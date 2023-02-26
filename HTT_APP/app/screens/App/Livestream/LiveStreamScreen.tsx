import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { ENABLE_LIVE } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestStopLiveStream } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts } from '@app/theme'
import { showConfirm } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useState } from 'react'
import { View } from 'react-native'
import 'react-native-get-random-values'
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view'
import { DataUserInfoProps } from '../Account/Model'
import {
  updateCheckedAll,
  updateListProductSelectEmpty,
} from '../Product/slice/ListProductSlice'
import ListHistoryLiveScreen from './live_stream_tab/ListHistoryLiveScreen'
import ListLiveScreen from './live_stream_tab/ListLiveScreen'
import ListMyLiveScreen from './live_stream_tab/ListMyLiveScreen'
import { getListLiveStreamThunk } from './slice/LiveStreamSlice'
import { getStreamLiveThunk } from './slice/StreamingSlice'
import { styles } from './styles'
import { STATUS_LIST_LIVE } from './YoutubeWatchingScreen'
import lodash from 'lodash'
import reactotron from 'reactotron-react-native'
// import { STATUS_LIST_LIVE } from './WatchingScreen'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const listLiveStreamReducer = useAppSelector(
    state => state.ListLiveStreamReducer
  )

  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const infoStreaming = useAppSelector<any>(
    state => state.StreamingReducer.data
  )
  const checkShop = userInfo?.livestream_enable == ENABLE_LIVE.ON
  const appDispatch = useAppDispatch()

  const onStopLive = async () => {
    callAPIHook({
      API: requestStopLiveStream,
      payload: listLiveStreamReducer?.data[0]?.id,
      useLoading: setIsLoading,
      onSuccess: async res => {
        appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
        NavigationUtil.navigate(SCREEN_ROUTER_APP.CREATE_LIVE)
      },
      onError: err => {},
    })
  }
  const createLive = () => {
    appDispatch(updateListProductSelectEmpty({}))
    appDispatch(updateCheckedAll({ checkAll: false }))
    if (
      listLiveStreamReducer?.data?.length &&
      listLiveStreamReducer?.data[0]?.user_id === userInfo?.id
    ) {
      showConfirm(
        R.strings().notification,
        'Livestream của bạn hiện đang được phát, bạn có muốn huỷ để tạo mới livestream không?',
        () => {
          onStopLive()
        },
        '',
        'Tạo mới'
      )
      return
    }
    NavigationUtil.navigate(SCREEN_ROUTER_APP.CREATE_LIVE)
    // setTimeout(() => {
    // NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_LIVE)
    // }, 300)
  }
  React.useEffect(() => {
    // userInfo?.Shop?.id ? appDispatch(getStreamLiveThunk()) : null
  }, [])

  const renderBody = () => (
    <View style={styles.container}>
      <ScrollableTabView
        style={{ flex: 1 }}
        renderTabBar={() => (
          <ScrollableTabBar
            underlineStyle={{ backgroundColor: 'transparent' }}
            style={{ backgroundColor: colors.white }}
            activeTextColor={colors.primary}
            inactiveTextColor={'#373E50'}
            textStyle={{ ...fonts.regular15 }}
          />
        )}
      >
        <ListLiveScreen
          tabLabel={R.strings().live_streaming}
          infoStreaming={infoStreaming}
          getStreaming={() => appDispatch(getStreamLiveThunk())}
          onStopLive={onStopLive}
        />
        <ListHistoryLiveScreen
          tabLabel={R.strings().history_live}
          infoStreaming={infoStreaming}
          getStreaming={() => appDispatch(getStreamLiveThunk())}
        />
        {userInfo?.Shop?.id && (
          <ListMyLiveScreen
            tabLabel={R.strings().my_live}
            infoStreaming={infoStreaming}
            getStreaming={() => appDispatch(getStreamLiveThunk())}
          />
        )}
      </ScrollableTabView>
      {checkShop ? (
        <Button
          onPress={createLive}
          style={styles.vBtnCreate}
          children={
            <FstImage source={R.images.img_create} style={styles.vImgScreate} />
          }
        />
      ) : null}
      {isLoading && <LoadingProgress />}
    </View>
  )
  return (
    <ScreenWrapper
      unsafe
      titleHeader={R.strings().live_stream}
      backgroundColor={colors.backgroundColor}
      children={renderBody()}
    />
  )
}
