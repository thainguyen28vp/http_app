import { Button } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import FstImage from '@app/components/FstImage/FstImage'
import Loading from '@app/components/Loading'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { GIFT_OWNER_STATUS, GIFT_STATUS } from '@app/config/Constants'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts, styleView } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import reactotron from 'ReactotronConfig'
import GiftCustomTopTab from './components/GiftCustomTopTab'
import GiftItem from './components/GiftItem'
import { requestGetListGiftThunk } from './slice/MyGiftSlice'

type TabProps = {
  tabLabel: string
  children: JSX.Element
  isLoading: boolean
  id: number
  index: number
}

const TabComponent = ({ tabLabel, children, isLoading }: TabProps) => {
  if (isLoading) return <Loading />
  return children
}

const STATUS = [
  { name: 'Đã đổi', id: GIFT_OWNER_STATUS.NOT_USED },
  { name: 'Đã sử dụng', id: GIFT_OWNER_STATUS.USED },
]

const MyGiftScreen = (props: any) => {
  const page = props.route.params?.page

  const [currentId, setCurrentId] = useState<number>(STATUS[0].id)

  const currentIndexRef = useRef<number>(0)

  const { data } = useAppSelector(state => state.MyGiftReducer)
  const Dispatch = useAppDispatch()

  const getData = () => {
    Dispatch(
      requestGetListGiftThunk({
        index: currentIndexRef.current,
        body: { status: currentId },
      })
    )
  }

  useEffect(() => {
    getData()
  }, [currentId])

  const renderListGift = (index: number) => {
    return (
      <FlatList
        data={data[index].giftData}
        refreshing={data[index].loading}
        onRefresh={getData}
        renderItem={renderGiftItem}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={renderItemSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isIphoneX() ? 20 : 0 }}
        ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
      />
    )
  }

  const renderGiftItem: ListRenderItem<any> = useCallback(
    ({ item }) => <GiftItem data={item?.Gift} />,
    []
  )

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 2 }} />,
    []
  )

  const renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          // initialPage={page || 0}
          onChangeTab={({ from, i, ref }) => {
            currentIndexRef.current = ref.props.index
            setCurrentId(ref.props.id)
          }}
          renderTabBar={() => <GiftCustomTopTab />}
        >
          {STATUS.map((item, index) => {
            return (
              <TabComponent
                tabLabel={item.name}
                key={index}
                id={item.id}
                index={index}
                isLoading={data[currentIndexRef.current].loading}
                children={renderListGift(index)}
              />
            )
          })}
        </ScrollableTabView>
      </View>
    )
  }

  return (
    <ScreenWrapper back unsafe titleHeader={'Quà tặng của bạn'}>
      {renderBody()}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  listGiftView: {
    ...styleView.rowItem,
    width: '100%',
    height: 96,
    backgroundColor: colors.white,
  },
  giftImg: {
    width: 96,
    height: 96,
  },
})

export default MyGiftScreen
