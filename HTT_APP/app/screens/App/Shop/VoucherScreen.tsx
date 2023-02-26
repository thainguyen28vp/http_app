import Empty from '@app/components/Empty/Empty'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  getListVoucher,
  requestRedeemVoucher,
} from '@app/service/Network/shop/ShopApi'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ListRenderItem, Text, TextInput, View } from 'react-native'
import GiftItem from '../Account/components/GiftItem'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import { useAppDispatch, useAppSelector } from '@app/store'
import { addVoucher } from './slice/CartSlice'
import reactotron from 'ReactotronConfig'
import { DebounceButton } from '@app/components/Button/Button'
import { colors, fonts } from '@app/theme'
import Modal from 'react-native-modal'
import { TYPE_GIFT, TYPE_GIFT_USE } from '@app/config/Constants'
import LoadingProgress from '@app/components/LoadingProgress'
import { getListGift } from '@app/service/Network/account/AccountApi'

const VoucherScreen = (props: any) => {
  const stockPrice = props.route.params?.stockPrice
  const getVoucher = props.route.params?.getVoucher
  const idGift = props.route.params?.idGift || undefined
  const enterpriseId = props.route.params?.enterpriseId
  const stockId = props.route.params?.stockId

  const { data } = useAppSelector(state => state.CartReducer)
  const Dispatch = useAppDispatch()
  const [visible, setVisible] = useState<boolean>(false)
  const [voucherInput, setVoucherInput] = useState('')
  const [loadingVoucher, setLoadingVoucher] = useState(false)

  let verifyListInit: any = []

  // data!.forEach(enter => {
  //   enter.Stocks.forEach((stock: any) => {
  //     if (!!stock?.voucher && !!Object.keys(stock?.voucher).length) {
  //       verifyListInit.push({ id: stock.id, giftId: stock.voucher.id })
  //     }
  //   })
  // })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [listVoucher, setListVoucher] = useState<any>([])
  const [verifyGift] = useState(verifyListInit)

  const getData = () => {
    callAPIHook({
      API: getListGift,
      payload: {
        status: TYPE_GIFT_USE.NOT_USE,
        type: TYPE_GIFT.VOUCHER,
      },
      useLoading: setIsLoading,
      onSuccess: res => {
        setListVoucher(res.data)
      },
    })
  }

  const onVoucherPress = (item: any) => {
    showConfirm('', 'Bạn có chắc chắn muốn dùng mã giảm giá này', () => {
      getVoucher(item?.Gift)
      NavigationUtil.goBack()
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const renderVoucherItem: ListRenderItem<any> = useCallback(({ item }) => {
    return (
      <GiftItem
        disable={!!(idGift == item.id)}
        onPress={() => onVoucherPress(item)}
        data={item?.Gift}
      />
    )
  }, [])

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 2 }} />,
    []
  )
  return (
    <ScreenWrapper back isLoading={isLoading} titleHeader={'Mã giảm giá'}>
      <DebounceButton
        style={{
          backgroundColor: colors.white,
          paddingVertical: 8,
          paddingHorizontal: 5,
        }}
        onPress={() => {
          setVisible(!visible)
        }}
        children={
          <View
            style={{
              paddingVertical: 10,
              paddingLeft: 10,
              borderWidth: 1,
              borderColor: colors.primary,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: colors.primary, ...fonts.regular16 }}
              children={'Nhập mã Voucher'}
            />
          </View>
        }
      />
      <FlatList
        data={listVoucher}
        refreshing={isLoading}
        onRefresh={getData}
        contentContainerStyle={{ paddingTop: 4 }}
        renderItem={renderVoucherItem}
        keyExtractor={(_, index) => `${index}`}
        ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
        ItemSeparatorComponent={renderItemSeparator}
      />
      <Modal
        isVisible={visible}
        style={{ margin: 0 }}
        useNativeDriver
        onBackdropPress={() => setVisible(false)}
      >
        <View
          style={{
            backgroundColor: colors.white,
            marginHorizontal: 10,
            borderRadius: 5,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              ...fonts.medium16,
              marginBottom: 25,
            }}
            children={'Nhập mã voucher'}
          />
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: '#DDD',
              marginHorizontal: 20,
              paddingLeft: 10,
            }}
            placeholder="Nhập mã voucher"
            onChangeText={input => {
              setVoucherInput(input)
            }}
          />
          <DebounceButton
            onPress={() => {
              setVisible(!visible)
              callAPIHook({
                API: requestRedeemVoucher,
                payload: {
                  voucher_code: voucherInput,
                },
                useLoading: setLoadingVoucher,
                onSuccess: res => {
                  getVoucher(res.data.Gift)
                  NavigationUtil.goBack()
                },
              })
            }}
            style={{
              backgroundColor: colors.primary,
              alignSelf: 'center',
              marginTop: 25,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 5,
            }}
            children={
              <Text style={{ color: colors.white }} children={'Đồng Ý'} />
            }
          />
        </View>
      </Modal>
      {loadingVoucher && <LoadingProgress />}
    </ScreenWrapper>
  )
}

export default VoucherScreen
