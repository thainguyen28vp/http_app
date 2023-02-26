import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SHOP_TAB } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  checkExistConversation,
  requestSendNewTopic,
} from '@app/service/Network/chat/ChatApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, HEIGHT } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useEffect, useRef, useState } from 'react'
import Toast from 'react-native-easy-toast'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ShopCategoryTab from './components/ShopCategoryTab'
import ShopCustomTopTab from './components/ShopCustomTopTab'
import ShopHeader from './components/ShopHeader'
import ShopItem from './components/ShopItem'
import ShopLivestreamTab from './components/ShopLivestreamTab'
import ShopPostTab from './components/ShopPostTab'
import ShopProductTab from './components/ShopProductTab'
import { requestShopDetailThunk, updateResetFilter } from './slice/ShopSlice'

const ShopDetailScreen = (props: any) => {
  const { shopData, shop_id, status_follow, item } = props.route.params
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [placeholderText, setPlaceholderText] = useState<string>('sản phẩm')
  const [textSearch, setTextSearch] = useState<string>('')
  const [dialogLoading, setDialogLoading] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
  const refIsLoading = useRef<boolean>(false)

  const filterProductRef = useRef<any>()
  const refToast = useRef<any>()

  const { data } = useAppSelector(state => state.ShopReducer)
  const AccountData = useAppSelector(state => state.accountReducer)
  const Dispatch = useAppDispatch()

  const getData = (filterProduct?: any) => {
    Dispatch(
      requestShopDetailThunk({
        tab: currentTab,
        shop_id,
        body: filterProduct
          ? {
              search: textSearch,
              time_type: filterProduct.time,
              buy_type: filterProduct.topSell,
              price_type: filterProduct.priceOrder,
            }
          : { search: textSearch },
      })
    )
  }

  const handleToast = () => {}

  const onChatPress = () => {
    setDialogLoading(true)
    callAPIHook({
      API: checkExistConversation,
      payload: { shop_id },
      onSuccess: res => {
        if (!!res.data) {
          setDialogLoading(false)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
            conversationId: res.data.id,
          })
        } else {
          const payload = new FormData()
          payload.append('shop_id', `${shop_id}`)
          payload.append('content', `Bắt đầu`)

          callAPIHook({
            API: requestSendNewTopic,
            payload,
            useLoading: setDialogLoading,
            onSuccess: res => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
                conversationId: res.data.topic_message_id,
              })
            },
          })
        }
      },
    })
  }

  useEffect(() => {
    getData()
  }, [currentTab, textSearch])

  return (
    <ScreenWrapper
      unsafe
      header={
        <ShopHeader
          goBack={() => {
            props?.route?.params?.getListShop
              ? props.route?.params?.getListShop()
              : null
            setTimeout(() => {
              NavigationUtil.goBack()
            }, 200)
          }}
          placeholder={`Tìm kiếm ${placeholderText.toLowerCase()} trong gian hàng`}
          onSearch={text => setTextSearch(text)}
        />
      }
      dialogLoading={dialogLoading}
    >
      <ShopItem
        status_follow={status_follow}
        data={data[0].tabData.shopDetail || shopData}
        chatIcon={AccountData.data.shop_id != shop_id}
        onChatPress={onChatPress}
        onPressFollowShop={status => {
          if (status === 1) {
            refToast?.current.show('Bạn đã theo dõi gian hàng!')
            return
          }
          return refToast?.current.show('Bạn đã huỷ theo dõi gian hàng!')
        }}
      />
      <ScrollableTabView
        initialPage={0}
        onChangeTab={({ from, i, ref }) => {
          if (from != SHOP_TAB[0].id && i == SHOP_TAB[0].id) {
            Dispatch(updateResetFilter(true))
          }
          setCurrentTab(i)
          setPlaceholderText(ref.props.tabLabel)
        }}
        renderTabBar={() => <ShopCustomTopTab />}
      >
        <ShopProductTab
          tabLabel="Sản phẩm"
          data={data[currentTab].tabData}
          isLoading={data[currentTab].loading}
          onRefresh={() => {
            if (!filterProductRef.current) {
              getData()
            } else getData(filterProductRef.current)
          }}
          textSearch={textSearch}
          shopId={shop_id}
          onFilterSelect={(filter: any) => {
            filterProductRef.current = filter
            getData(filter)
          }}
        />
        <ShopCategoryTab
          tabLabel="Danh mục"
          data={data[currentTab].tabData}
          isLoading={data[currentTab].loading}
          onRefresh={() => getData()}
        />
        <ShopLivestreamTab
          tabLabel="Live stream"
          data={data[currentTab].tabData}
          isLoading={data[currentTab].loading}
          onRefresh={() => getData()}
        />
        <ShopPostTab
          tabLabel="Bài viết"
          data={data[currentTab].tabData || []}
          isLoading={data[currentTab].loading}
          onRefresh={() => getData()}
        />
      </ScrollableTabView>
      <Toast
        ref={refToast}
        position="bottom"
        positionValue={HEIGHT * 0.2}
        fadeInDuration={750}
        fadeOutDuration={1500}
        opacity={0.8}
        textStyle={{ color: colors.white }}
      />
      {isLoading && <LoadingProgress />}
    </ScreenWrapper>
  )
}

export default ShopDetailScreen
