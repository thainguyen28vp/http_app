import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, styleView } from '@app/theme'
import lodash from 'lodash'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
import { View } from 'react-native-animatable'
import { DataUserInfoProps } from '../../Account/Model'
import MyLiveItem from '../component/MyLiveItem'
import WarningLive from '../component/WarningLive'
import { getListMyLiveThunk } from '../slice/MyLiveSlice'

const ListMyLiveScreen = ({ infoStreaming }: { infoStreaming: {} }) => {
  const appDispatch = useAppDispatch()
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const MyLiveReducer = useAppSelector(state => state.ListMyLiveReducer)
  const payload = {
    shop_id: userInfo?.Shop?.id,
  }
  const getData = () => {
    appDispatch(getListMyLiveThunk(payload))
  }

  useEffect(() => {
    getData()
  }, [])

  if (MyLiveReducer.isLoading) return <Loading />
  if (MyLiveReducer.error) return <Error reload={getData} />
  return (
    <View style={{ flex: 1 }}>
      {!lodash.isEmpty(infoStreaming) ? <WarningLive /> : null}
      <FlatList
        contentContainerStyle={[styleView.paddingBottomMain]}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={getData}
        style={{ flex: 1 }}
        data={MyLiveReducer.data}
        keyExtractor={item => `${item.toString}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Empty backgroundColor={colors.backgroundColor} onRefresh={getData} />
        }
      />
    </View>
  )
}

export default ListMyLiveScreen

const renderItem = ({ item, index }: { item: any; index: any }) => {
  const onPressItem = () => {
    NavigationUtil.navigate(SCREEN_ROUTER_APP.RECORD, { item })
  }
  return <MyLiveItem item={item} onPress={onPressItem} />
}
