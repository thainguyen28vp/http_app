import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors } from '@app/theme'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { ORDER_STATUS_TYPE } from '@app/config/Constants'
import OrderItem from './components/OrderItem'
import { useAppDispatch, useAppSelector } from '@app/store'
import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import { requestListOrderThunk } from './slice/OrderSlice'
import OrderCustomTopTab from './components/OrderCustomTopTab'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { useNavigation } from '@react-navigation/core'
import reactotron from 'reactotron-react-native'

type TabProps = {
  tabLabel: string
  children: JSX.Element
  isLoading: boolean
}

const STATUS = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]

const TabComponent = ({ tabLabel, children, isLoading }: TabProps) => {
  if (isLoading) return <Loading />
  return children
}

const OrderDetailScreen = (props: any) => {
  const page = props.route.params?.page
  const paymentSign = props.route.params?.paymentSign

  const navigation = useNavigation()

  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(page || 0)

  const { data } = useAppSelector(state => state.OrderReducer)
  const Dispatch = useAppDispatch()

  const getData = (page: number) => {
    let payload = {
      page: undefined,
      limit: undefined,
      status: page,
    }
    Dispatch(requestListOrderThunk(payload))
  }

  const handleOnBack = () => {
    if (paymentSign)
      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN_ROUTER.MAIN }],
      })
    else NavigationUtil.goBack()
  }

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: !paymentSign })
  }, [navigation])

  useEffect(() => {
    getData(currentPage)
  }, [currentPage])
  const listOrder = (index: number) => {
    reactotron.logImportant!(index)
    return (
      <FlatList
        key={index}
        refreshing={dialogLoading}
        onRefresh={() => getData(currentPage)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: '7%' }}
        style={{ flex: 1, backgroundColor: '#F1F3F5' }}
        // data={data[index].orderData}
        data={data[index].orderData}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => (
          <OrderItem
            data={item}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
                listProduct: item.items,
                id: item.id,
                index,
                reloadList: (i: number) => getData(i),
              })
            }
            showRating={index == ORDER_STATUS_TYPE.COMPLETED.id - 2}
            onRatingPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_RATING, {
                listProduct: item.items,
                order_id: item.id,
                index,
                reloadList: (i: number) => getData(i),
              })
            }
            onRepurchase={() => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_RATING, {
                listProduct: item.items,
                order_id: item.id,
                index,
                reloadList: (i: number) => getData(i),
                check_review: item?.check_review,
              })
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
    )
  }

  const renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          initialPage={page || 0}
          onChangeTab={({ from, i }) => {
            setCurrentPage(i)
          }}
          renderTabBar={() => <OrderCustomTopTab />}
        >
          {STATUS.map((item, index) => {
            return (
              <TabComponent
                tabLabel={item.name}
                key={index}
                isLoading={data[index].loading}
                children={listOrder(index)}
              />
            )
          })}
        </ScrollableTabView>
      </View>
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      onBack={handleOnBack}
      titleHeader={'Đơn hàng'}
      backgroundHeader={colors.white}
      color={colors.black}
      // rightComponent={<RightHeaderComponent />}
    >
      {renderBody()}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({})

export default OrderDetailScreen
