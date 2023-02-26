import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import { useAppDispatch, useAppSelector } from '@app/store'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import FastImage from 'react-native-fast-image'
import usePaymentData from './hooks/usePaymentData'
import { Enterprise, Stock } from './model/Cart'
import { FlatList } from 'react-native-gesture-handler'
import FstImage from '@app/components/FstImage/FstImage'
import OrderItem from './components/OrderItem'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { Customer } from './model/Customer'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages, showConfirm } from '@app/utils/GlobalAlertHelper'
import {
  getDefaultCustomerInfor,
  getListReceiver,
  requestCreateNewOrder,
} from '@app/service/Network/shop/ShopApi'
import {
  cancelVoucher,
  clearVoucher,
  requestListCartThunk,
} from './slice/CartSlice'
import { updateCountCart } from '../Notification/utils/NotificationUtils'
import reactotron from 'ReactotronConfig'

type PaymentData = {
  customerInfor: Customer | undefined
  promotionCode: number | null
}

const PaymentScreen = (props: any) => {
  // const { listCart } = props.route.params
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [activePoint, setActivePoint] = useState<boolean>(false)
  const [activeCoin, setActiveCoin] = useState<boolean>(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    customerInfor: undefined,
    promotionCode: null,
  })
  const userInfo = useAppSelector(state => state.accountReducer.data)
  const [verifyGift, setVerifyGift] = useState([])
  const [applyVoucher, setApplyVoucher] = useState<any>()
  const [note, setNote] = useState<any>()
  const dataIsBuyNow = props.route.params?.dataIsBuyNow || null
  const { data, totalPrice } = useAppSelector(state => state.CartReducer)
  const Dispatch = useAppDispatch()
  // const { dataParser, paymentPayload, totalDiscount } = usePaymentData(data!)

  const getDataListReceiver = (search?: string) => {
    callAPIHook({
      API: getListReceiver,
      payload: { search },
      useLoading: typeof search == 'string' ? undefined : setIsLoading,
      onSuccess: res => {
        if (res.data?.length == 1) {
          setPaymentData({
            ...paymentData,
            customerInfor: res?.data[0],
          })
          return
        }
        res.data.map((item: any) => {
          if (item.is_default) {
            setPaymentData({
              ...paymentData,
              customerInfor: item,
            })
          }
        })
      },
    })
  }

  const itemSeperatorComponent = useCallback(
    () => <View style={{ height: 2 }} />,
    []
  )
  const onOrderBtnPress = () => {
    let payload = {
      shipping_phone_number: paymentData?.customerInfor?.phone_number,
      shipping_name: paymentData?.customerInfor?.name,
      shipping_address: `${paymentData?.customerInfor?.address}, ${paymentData?.customerInfor?.ward.name}, ${paymentData?.customerInfor?.district.name}, ${paymentData?.customerInfor?.province.name}`,
      shipping_ward_id: paymentData?.customerInfor?.ward.id,
      shipping_district_id: paymentData?.customerInfor?.district.id,
      shipping_province_id: paymentData?.customerInfor?.province.id,
      address_book_id: undefined,
      payment_method: 'cod',
      use_point: activePoint,
      use_coin: activeCoin,
      voucher_id: applyVoucher?.id,
      cart_item_id: !dataIsBuyNow?.length ? handleCartId() : undefined,
      note: note,
      product: dataIsBuyNow?.length
        ? {
            quantity: dataIsBuyNow[0]?.quantity,
            product_variant_id: dataIsBuyNow[0]?.variants[0]?.id,
          }
        : undefined,
    }
    if (!paymentData?.customerInfor)
      return showMessages('', 'Vui lòng thêm địa chỉ người nhận', () => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
          isPayment: true,
          reloadList: getDataListReceiver,
        })
      })
    try {
      callAPIHook({
        API: requestCreateNewOrder,
        payload,
        useLoading: setDialogLoading,
        onSuccess: res => {
          showMessages('Thông báo', 'Đặt hàng thành công', () => {
            // updateCountCart(Dispatch)
            Dispatch(requestListCartThunk({}))
            NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER, {
              page: 0,
              paymentSign: true,
            })
          })
        },
        onError: () => {
          // NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER, {
          //   page: 0,
          // })
        },
        onFinaly: () => {
          // NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER, {
          //   page: 0,
          // })
        },
      })
    } catch (error) {}
  }

  const handleCartId = () => {
    let arrIdCart: Array<number> = []
    data?.map((item: any) => {
      if (item.isCheck) return arrIdCart.push(item.id)
    })
    return arrIdCart
  }

  const getData = () => {
    callAPIHook({
      API: getDefaultCustomerInfor,
      useLoading: setIsLoading,
      onSuccess: res => {
        setPaymentData(prev => ({ ...prev, customerInfor: res.data }))
      },
    })
  }

  const getVoucher = (item: any) => {
    reactotron.logImportant!('itemVOUCHER', item)
    setApplyVoucher(item)
  }

  useEffect(() => {
    // getData()
  }, [])
  useEffect(() => {
    getDataListReceiver()
  }, [])

  const calTotalPrice = (point: any, coin: any) => {
    let price = dataIsBuyNow?.length ? dataIsBuyNow[0]?.total : totalPrice
    if (!applyVoucher) {
      if (activePoint) {
        if (dataIsBuyNow?.length && activeCoin) {
          return (price =
            dataIsBuyNow[0]?.total > point &&
            dataIsBuyNow[0]?.total - point > coin
              ? dataIsBuyNow[0]?.total - point - coin
              : 0)
        }
        if (dataIsBuyNow?.length && !activeCoin) {
          return (price =
            dataIsBuyNow[0]?.total > point ? dataIsBuyNow[0]?.total - point : 0)
        }
        if (!dataIsBuyNow?.length && activeCoin) {
          return (price =
            price > point && price - point > coin ? price - point - coin : 0)
        }
        if (!dataIsBuyNow?.length && !activeCoin) {
          return (price = price > point ? price - point : 0)
        }
      }
      if (!activePoint) {
        if (dataIsBuyNow?.length && activeCoin) {
          return (price =
            coin < dataIsBuyNow[0]?.total ? dataIsBuyNow[0]?.total - coin : 0)
        }
        if (!dataIsBuyNow?.length && activeCoin) {
          return (price = coin < price ? price - coin : 0)
        }
        if (!dataIsBuyNow?.length && !activeCoin) {
          return price
        }
      }
    }
    if (applyVoucher) {
      let discount = (applyVoucher?.discount_percent / 100) * price
      if (activePoint && !activeCoin) {
        if (discount > applyVoucher?.max_discount_money) {
          if (point < price)
            return price - applyVoucher?.max_discount_money - point
          return 0
        }
        if (discount <= applyVoucher?.max_discount_money) {
          if (point < price) return price - discount - point
          return 0
        }
      }
      if (!activePoint && activeCoin) {
        if (discount > applyVoucher?.max_discount_money) {
          if (coin < price)
            return price - applyVoucher?.max_discount_money - coin
          return 0
        }
        if (discount <= applyVoucher?.max_discount_money) {
          if (coin < price) return price - discount - coin
          return 0
        }
      }
      if (activePoint && activeCoin) {
        if (discount > applyVoucher?.max_discount_money) {
          if (coin < price)
            return price - applyVoucher?.max_discount_money - point - coin
          return 0
        }
        if (discount <= applyVoucher?.max_discount_money) {
          if (coin < price) return price - discount - point - coin
          return 0
        }
      }
      if (discount <= applyVoucher?.max_discount_money) return price - discount
      return price - applyVoucher?.max_discount_money
    }
    return price
  }

  const bottomView = () => {
    let point = userInfo?.wallet?.point
    let coin = userInfo?.wallet?.coin
    // let calTotalPrice = activePoint
    //   ? dataIsBuyNow?.length
    //     ? dataIsBuyNow[0]?.total - point
    //     : totalPrice - point
    //   : dataIsBuyNow?.length
    //   ? dataIsBuyNow[0]?.total
    //   : totalPrice
    return (
      <View style={styles.bottomView}>
        <View>
          <Text
            style={{ ...fonts.regular14, marginBottom: 4 }}
            children={R.strings().total_money}
          />
          {/* <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={`${formatPrice(
              (totalPrice! - totalDiscount).toString()!
            )}đ`}
          /> */}
          <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={(formatPrice(calTotalPrice(point, coin) + '') || 0) + 'đ'}
          />
        </View>
        <Button
          // disabled={data?.length == 0}
          style={styles.btnOrder}
          onPress={onOrderBtnPress}
          children={
            <Text
              style={{
                ...fonts.semi_bold16,
                color: colors.white,
              }}
            >
              {R.strings().order}
            </Text>
          }
        />
      </View>
    )
  }
  const informationView = () => {
    return (
      <Button
        onPress={() => {
          if (!paymentData?.customerInfor) {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
              isPayment: true,
              reloadList: getDataListReceiver,
            })
            return
          }
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_RECEIVER, {
            selectReceiver: (customerInfor: Customer) =>
              setPaymentData(prev => ({
                ...prev,
                customerInfor,
              })),
            reloadList: getDataListReceiver,
          })
        }}
        children={
          <View style={styles.inforView}>
            <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'flex-start',
                  marginRight: 8,
                }}
                source={R.images.ic_map_outline}
                tintColor={colors.red}
              />
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <Text
                  style={{ ...fonts.regular16 }}
                  children={'Thông tin người nhận'}
                />
                {paymentData?.customerInfor ? (
                  <View
                    style={{
                      ...styleView.rowItemBetween,
                      alignItems: 'center',
                      marginTop: 6,
                    }}
                  >
                    <Text
                      style={{ ...fonts.regular16, color: '#69747E', flex: 1 }}
                      children={`${paymentData?.customerInfor?.address}, ${paymentData?.customerInfor?.ward.name}, ${paymentData?.customerInfor?.district.name}, ${paymentData?.customerInfor?.province.name}`}
                    />
                    <FastImage
                      style={{ width: 20, height: 20, marginLeft: 5 }}
                      source={R.images.ic_arrow_right}
                    />
                  </View>
                ) : null}
                <Text
                  style={{ ...fonts.regular15, marginTop: 6 }}
                  children={
                    paymentData.customerInfor
                      ? `${paymentData?.customerInfor?.name} | ${paymentData?.customerInfor?.phone_number}`
                      : 'Vui lòng chọn người nhận'
                  }
                />
              </View>
            </View>
          </View>
        }
      />
    )
  }

  const renderOption = () => {
    let price = dataIsBuyNow?.length ? dataIsBuyNow[0]?.total : totalPrice
    let discount = (applyVoucher?.discount_percent / 100) * price
    return (
      <>
        <OptionItem
          title={'Mã khuyến mại'}
          haveVoucher={!!applyVoucher}
          content={
            applyVoucher
              ? `-${formatPrice(
                  discount > applyVoucher?.max_discount_money
                    ? applyVoucher?.max_discount_money
                    : discount
                )}đ`
              : 'Chọn mã khuyến mại'
          }
          onPressDeleteVoucher={() => setApplyVoucher(undefined)}
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER, {
              getVoucher: (item: any) => getVoucher(item),
              idGift: applyVoucher?.id || undefined,
              // stockPrice,
              // enterpriseId: enterprise.id,
              // stockId: stock.id,
              // verifyGift,
              // setVerify: (verify: any) => setVerifyGift(verify),
            })
          }}
        />
        <OptionItem
          title={'Sử dụng điểm'}
          content={`${
            userInfo?.wallet?.point ? formatPrice(userInfo?.wallet?.point) : 0
          }`}
          icon={R.images.img_point_payment}
          isPoint={true}
          disabled={userInfo?.wallet?.point}
          point={activePoint}
          onValueChange={() => setActivePoint(!activePoint)}
        />
        <OptionItem
          title={'Sử dụng xu'}
          content={`${
            userInfo?.wallet?.coin ? formatPrice(userInfo?.wallet?.coin) : 0
          }`}
          icon={R.images.img_coin_user}
          isPoint={true}
          disabled={userInfo?.wallet?.coin}
          point={activeCoin}
          onValueChange={() => setActiveCoin(!activeCoin)}
        />
        <OptionItem
          title={'Ghi chú'}
          icon={R.images.img_note}
          isNote
          onChangeTextNote={(note: string) => setNote(note)}
        />
        {/* <OptionItem
          title={'Hình thức thanh toán'}
          content={'Chọn  hình thức thanh toán'}
          icon={R.images.img_wallet}
        /> */}
      </>
    )
  }

  const renderTotalItemCart = (
    stock: Stock,
    // enterprise: Enterprise,
    index: number
  ) => {
    // const avtShop = enterprise?.profile_picture_url

    // const productItems = stock.ProductPrices.map(product => {
    //   if (product.isCheck) return product
    //   else return null
    // }).filter(Boolean)

    // const stockPrice = productItems.reduce((acc, curr) => {
    //   return acc + curr?.price! * curr?.Cart.amount!
    // }, 0)

    // const stockDiscount = stock.voucher?.discount

    return (
      <React.Fragment key={index}>
        <View
          style={{
            backgroundColor: colors.white,
            padding: 15,
            marginBottom: 2,
          }}
        >
          <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
            <FstImage
              style={{ width: 24, height: 24, borderRadius: 12 }}
              source={!!avtShop ? { uri: avtShop } : R.images.img_user}
            />
            <Text
              style={{ ...fonts.semi_bold16, marginLeft: 13 }}
              children={enterprise.name}
            />
          </View>
          <Text
            style={{ ...fonts.regular16, marginTop: 12 }}
            children={stock.name}
          />
        </View>
        <FlatList
          scrollEnabled={false}
          data={productItems}
          keyExtractor={(_, index) => `${index}`}
          renderItem={({ item, index }) => (
            <OrderItem
              showTopStatus={false}
              showBottomStatus={false}
              data={item}
            />
          )}
          ItemSeparatorComponent={itemSeperatorComponent}
        />
        <View
          style={{
            ...styleView.rowItemBetween,
            padding: 15,
            backgroundColor: colors.white,
            marginTop: 2,
          }}
        >
          <Text style={{ ...fonts.regular16 }} children={'Tổng tiền hàng'} />
          <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={`${formatPrice('10000')}đ`}
          />
        </View>
        {/* Lựa chọn voucher, hình thức thanh toán */}
        {/* <Option /> */}
      </React.Fragment>
    )
  }

  const renderTotalItem = (enterprise: Enterprise, index: number) => {
    return (
      <FlatList
        scrollEnabled={false}
        key={index}
        style={{ marginTop: 2 }}
        data={enterprise.Stocks}
        renderItem={({ item, index }) =>
          renderTotalItemCart(item, enterprise, index)
        }
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={itemSeperatorComponent}
      />
    )
  }

  return (
    <>
      <ScreenWrapper
        back
        unsafe
        scroll
        onBack={() => {
          // Dispatch(clearVoucher())
          NavigationUtil.goBack()
        }}
        color={colors.black}
        isLoading={isLoading}
        titleHeader={R.strings().payment}
        backgroundHeader={colors.white}
        dialogLoading={dialogLoading}
      >
        {informationView()}
        <FlatList
          style={{}}
          scrollEnabled={false}
          data={
            dataIsBuyNow?.length
              ? dataIsBuyNow
              : data?.filter(item => item.isCheck)
          }
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1, marginTop: 2, backgroundColor: 'white' }}>
                <Button
                  onPress={() =>
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
                      id: item?.product_id,
                    })
                  }
                  children={
                    <View
                      style={{
                        ...styleView.rowItem,
                        alignItems: 'center',
                        marginBottom: 6,
                        paddingVertical: 16,
                        paddingHorizontal: 30,
                      }}
                    >
                      <FstImage
                        style={[styles.itemImg]}
                        source={{ uri: item.product_image }}
                        resizeMode={'cover'}
                      />
                      <View
                        style={{
                          justifyContent: 'space-between',
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            ...fonts.semi_bold15,
                          }}
                          children={item?.product_name || item.name}
                          numberOfLines={3}
                        />
                        {/* <Text
                          style={{ ...fonts.regular15, marginVertical: 4 }}
                          children={attribute_name}
                        /> */}
                        <Text
                          style={{
                            ...fonts.medium14,
                            marginRight: 10,
                            color: colors.primary,
                            marginTop: 10,
                          }}
                          children={`${formatPrice(item?.price) || 0} đ`}
                        />
                      </View>
                      <Text
                        style={{ color: '#69747E' }}
                        children={'x' + item.quantity}
                      />
                    </View>
                  }
                />
              </View>
            )
          }}
          keyExtractor={(_, index) => `${index}`}
        />
        <View style={styles.vTotalMoney}>
          <Text style={{ ...fonts.regular16 }} children={'Tổng tiền hàng'} />
          <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={
              formatPrice(
                dataIsBuyNow?.length ? dataIsBuyNow[0]?.total : totalPrice + ''
              ) + 'đ'
            }
          />
        </View>
        {renderOption()}
      </ScreenWrapper>
      {bottomView()}
    </>
  )
}

const styles = StyleSheet.create({
  bottomView: {
    ...styleView.rowItemBetween,
    width: '100%',
    height: 65 + getBottomSpace(),
    padding: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    marginTop: 2,
  },
  btnOrder: {
    ...styleView.centerItem,
    width: 159,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  itemImg: {
    width: 72,
    height: 72,
    borderRadius: 5,
    marginRight: 12,
  },
  inforView: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    marginTop: 2,
  },
  giftViewContainer: {
    ...styleView.rowItemBetween,
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    marginTop: 2,
  },
  vTotalMoney: {
    marginTop: 2,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
})

export default PaymentScreen

export const OptionItem = ({
  title,
  content,
  icon,
  isPoint,
  point,
  onValueChange,
  onPress,
  haveVoucher,
  onPressDeleteVoucher,
  isNote,
  onChangeTextNote,
  disabled,
}: any) => {
  return (
    <Button
      disabled={isNote}
      onPress={onPress}
      children={
        <View style={styles.giftViewContainer}>
          <View style={{ ...styleView.rowItem }}>
            <FastImage
              style={{ width: 20, height: 20, marginRight: 12 }}
              source={icon || R.images.ic_code_promotion}
              tintColor={colors.primary}
            />
            <View
              style={{
                width: isNote ? '91%' : '80%',
              }}
            >
              <Text style={{ ...fonts.regular16 }} children={title} />
              {isNote ? (
                <TextInput
                  placeholder="Nhập ghi chú"
                  style={{
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#DDD',
                    paddingBottom: 8,
                    ...fonts.regular14,
                  }}
                  onChangeText={onChangeTextNote}
                />
              ) : (
                <Text
                  style={{
                    ...fonts.regular15,
                    marginTop: 8,
                    color: '#69747E',
                  }}
                  children={content}
                />
              )}
            </View>
          </View>
          {isPoint ? (
            <Switch
              disabled={!disabled}
              value={point}
              trackColor={{ true: colors.primary }}
              onValueChange={onValueChange}
            />
          ) : !isNote ? (
            <Button
              disabled={!haveVoucher}
              onPress={onPressDeleteVoucher}
              children={
                <FastImage
                  style={{ width: 26, height: 26 }}
                  source={
                    !!haveVoucher ? R.images.ic_remove : R.images.ic_arrow_right
                  }
                />
              }
            />
          ) : null}
        </View>
      }
    />
  )
}
