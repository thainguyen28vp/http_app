import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import { LIVESTREAM_STATUS } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch, useAppSelector } from '@app/store'
import { styleView } from '@app/theme'
import lodash from 'lodash'
import React from 'react'
import { FlatList } from 'react-native'
import { View } from 'react-native-animatable'
import LiveStreamItem from '../component/LiveStreamItem'
import WarningLive from '../component/WarningLive'
import { getListHistoryLiveThunk } from '../slice/HistoryLiveSlice'
import { styles } from '../styles'

const ListHistoryLiveScreen = ({ infoStreaming }: { infoStreaming: {} }) => {
  const appDispatch = useAppDispatch()
  const HistoryLiveReducer = useAppSelector(state => state.HistoryLiveReducer)
  const payload = {
    status: LIVESTREAM_STATUS.FINISHED,
  }
  const getData = () => {
    // appDispatch(getListLiveStreamThunk(payload))
    appDispatch(getListHistoryLiveThunk(payload))
  }

  React.useEffect(() => {
    getData()
  }, [])

  if (HistoryLiveReducer.isLoading) return <Loading />
  if (HistoryLiveReducer.error) return <Error reload={getData} />
  if (!HistoryLiveReducer?.data.length)
    return (
      <View style={{ flex: 1 }}>
        {!lodash.isEmpty(infoStreaming) ? <WarningLive /> : null}
        <Empty onRefresh={getData} />
      </View>
    )
  return (
    <View style={{ flex: 1 }}>
      {!lodash.isEmpty(infoStreaming) ? <WarningLive /> : null}
      <FlatList
        contentContainerStyle={[
          styles.vContentFlat,
          styleView.paddingBottomMain,
        ]}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={getData}
        style={styles.vListStream}
        data={HistoryLiveReducer?.data}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
      />
    </View>
  )
}

export default ListHistoryLiveScreen

const renderItem = ({ item, index }: { item: any; index: any }) => {
  const onPressItem = () => {
    NavigationUtil.navigate(SCREEN_ROUTER_APP.RECORD, { item })
  }
  return (
    <LiveStreamItem
      key={item.id}
      item={item}
      index={index}
      onPress={onPressItem}
    />
  )
}
