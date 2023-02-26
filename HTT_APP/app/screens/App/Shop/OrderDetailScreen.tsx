import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Clipboard,
  Image,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, HEIGHT, styleView, WIDTH } from '@app/theme'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import OrderItem from './components/OrderItem'
import Line from './components/Line'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getOrderItemDetail,
  requestCancelOrder,
} from '@app/service/Network/shop/ShopApi'
import { formatPrice } from '@app/utils/FuncHelper'
import { ORDER_STATUS_TYPE } from '@app/config/Constants'
import { Button, DebounceButton } from '@app/components/Button/Button'
import { ScrollView } from 'react-native-gesture-handler'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import OrderHistoryState from './components/OrderHistoryState'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import reactotron from 'ReactotronConfig'
import { OptionItem } from './PaymentScreen'
import ViewShot from 'react-native-view-shot'
import { useAppSelector } from '@app/store'
import CameraRoll from '@react-native-community/cameraroll'
import Toast from 'react-native-root-toast'

const STATUS = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  ORDER_STATUS_TYPE.DELIVERING,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]

const ORDER_ICON = [
  R.images.ic_pending_order,
  R.images.ic_confirm_order,
  R.images.ic_delivery,
  R.images.ic_done_order,
  R.images.ic_cancel_order,
]

const OrderItemDetailScreen = (props: any) => {
  const id = props.route.params?.id
  const index = props.route.params?.index
  const listProduct = props.route.params?.listProduct
  const reloadList = props.route.params?.reloadList
  const refCapture = useRef<any>()
  const pointData: any = useAppSelector(state => state.ConfigReducer.data)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [orderItemDetail, setOrderItemDetail] = useState<any>()
  const dataConfig: any = useAppSelector(state => state.ConfigReducer.data)

  const getData = (id?: number) => {
    callAPIHook({
      API: getOrderItemDetail,
      payload: { order_id: id },
      useLoading: setIsLoading,
      onSuccess: res => {
        setOrderItemDetail(res.data)
      },
    })
  }

  const onCancelOrder = () => {
    showConfirm('', 'Bạn có chắc chắn muốn huỷ đơn', () => {
      console.log(typeof id)
      const payload = { order_id: `${id}` }
      console.log(payload)

      callAPIHook({
        API: requestCancelOrder,
        payload,
        useLoading: setIsLoading,
        onSuccess: res => {
          reloadList(index)
          NavigationUtil.goBack()
        },
      })
    })
  }

  const handleStatus: any = (status: any) => {
    switch (status) {
      case 'wait_confirmation':
        return 0
      case 'inprogress':
        return 1
      case 'completed':
        return 3
      case 'cancelled':
        return 4
      default:
        break
    }
  }

  const handleStatusDelivery: any = (status: any) => {
    switch (status) {
      case 'wait_confirmation':
        return 'Chờ nhận hàng'
      case 'inprogress':
        return 'Đang vận chuyển'
      case 'completed':
        return 'Đã vận chuyển'
      default:
        break
    }
  }

  useEffect(() => {
    id && getData(id)
  }, [id])

  const orderState = () => {
    return (
      <View style={styles.headerStatus}>
        <Text
          style={{ ...fonts.regular16 }}
          children={STATUS[handleStatus(orderItemDetail?.status)]?.name}
        />
        <FastImage
          style={{ width: 24, height: 24 }}
          source={ORDER_ICON[handleStatus(orderItemDetail?.status)]}
        />
      </View>
    )
  }

  const deliveryInformation = () => {
    return (
      <View
        style={{ padding: 15, backgroundColor: colors.white, marginTop: 6 }}
      >
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <FastImage
            style={{ width: 24, height: 24 }}
            source={R.images.ic_delivery}
            tintColor={'#CEA343'}
          />
          <Text
            style={{ ...fonts.semi_bold16, marginLeft: 8, flex: 1 }}
            children={'Thông tin vận chuyển'}
          />
          <Text
            style={{ ...fonts.regular16, marginLeft: 8 }}
            children={handleStatusDelivery(orderItemDetail?.status)}
          />
        </View>
        {/* <OrderHistoryState data={orderItemDetail?.listOrderHistory} /> */}
      </View>
    )
  }

  const receiverInformation = () => {
    return (
      <View
        style={{ padding: 15, backgroundColor: colors.white, marginTop: 6 }}
      >
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <FastImage
            style={{ width: 24, height: 24 }}
            source={R.images.ic_map_outline}
          />
          <Text
            style={{ ...fonts.semi_bold16, marginLeft: 8 }}
            children={'Thông tin người nhận'}
          />
        </View>
        <Text
          style={{ ...fonts.regular15, marginTop: 15, color: '#69747E' }}
          children={`${orderItemDetail?.shipping_address}` || 'Đang cập nhật'}
        />
        <Text
          style={{ ...fonts.regular15, marginTop: 15 }}
          children={`${orderItemDetail?.shipping_name} | ${orderItemDetail?.shipping_phone_number}`}
        />
      </View>
    )
  }

  const listOrderItemDetail = () => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          marginTop: 6,
          paddingVertical: 10,
        }}
      >
        <View style={styles.orderItemView}>
          <FastImage
            style={{ width: 24, height: 24 }}
            source={R.images.ic_map_outline}
          />
          <Text
            style={{ ...fonts.semi_bold16, marginLeft: 8 }}
            children={'Thông tin đơn hàng'}
          />
        </View>
        <FlatList
          data={listProduct || orderItemDetail?.items}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <OrderItem
              data={item}
              showBottomStatus={false}
              showTopStatus={false}
            />
          )}
          ItemSeparatorComponent={() => <Line />}
          keyExtractor={(_, index) => `${index}`}
        />
      </View>
    )
  }

  const bottomStatus = () => {
    return (
      <View
        style={{ padding: 15, marginTop: 6, backgroundColor: colors.white }}
      >
        <View style={{ ...styleView.rowItemBetween }}>
          <Text style={styles.bottomTextLeft} children={'Mã đơn hàng'} />
          <Text
            selectable
            style={styles.bottomTextRight}
            children={orderItemDetail?.code || 'Đang cập nhật'}
          />
        </View>

        {!!orderItemDetail?.detail?.gift_id && (
          <>
            <View style={{ ...styleView.rowItemBetween, marginTop: 10 }}>
              <Text style={styles.bottomTextLeft} children={'Tổng tiền'} />
              <Text
                style={styles.bottomTextRight}
                children={
                  `${formatPrice(orderItemDetail?.detail?.total_price)}đ` ||
                  'Đang cập nhật'
                }
              />
            </View>
            <View style={{ ...styleView.rowItemBetween, marginTop: 10 }}>
              <Text style={styles.bottomTextLeft} children={'Giảm giá'} />
              <Text
                style={styles.bottomTextRight}
                children={
                  `${
                    formatPrice(
                      (
                        parseInt(orderItemDetail?.detail?.total_price) -
                        orderItemDetail?.detail?.total_discount
                      ).toString()
                    ) || 0
                  }đ` || 'Đang cập nhật'
                }
              />
            </View>
          </>
        )}
        <View style={{ ...styleView.rowItemBetween, marginTop: 10 }}>
          <Text style={styles.bottomTextLeft} children={'Tổng tiền'} />
          <Text
            style={styles.bottomTextRight}
            children={
              `${formatPrice(orderItemDetail?.total) || 0}đ` || 'Đang cập nhật'
            }
          />
        </View>
        <View style={{ ...styleView.rowItemBetween, marginTop: 10 }}>
          <Text
            style={styles.bottomTextLeft}
            children={'Tổng tiền thanh toán'}
          />
          <Text
            style={styles.bottomTextRight}
            children={
              `${formatPrice(orderItemDetail?.total_payment) || 0}đ` ||
              'Đang cập nhật'
            }
          />
        </View>
      </View>
    )
  }

  const handlePayment = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Tiền mặt'
      case 'debit':
        return 'Công nợ'
      case 'banking':
        return 'Chuyển khoản'
      case 'coin':
        return 'Điểm'
      default:
        break
    }
  }

  const paymentStatus = () => {
    return (
      <>
        <OptionItem
          title={'Hình thức thanh toán'}
          content={handlePayment(orderItemDetail?.payment_method)}
          icon={R.images.img_wallet}
        />
        {orderItemDetail?.use_point ? (
          <OptionItem
            title={'Sử dụng điểm'}
            content={'-' + formatPrice(orderItemDetail?.use_point)}
            icon={R.images.img_point_payment}
          />
        ) : null}
        {orderItemDetail?.use_coin ? (
          <OptionItem
            title={'Sử dụng xu'}
            content={'-' + formatPrice(orderItemDetail?.use_coin)}
            icon={R.images.img_coin_user}
          />
        ) : null}
        {orderItemDetail?.note ? (
          <OptionItem
            title={'Ghi chú'}
            content={orderItemDetail?.note}
            icon={R.images.img_note}
          />
        ) : null}
      </>
    )
  }

  const renderInfoBank = () => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          marginTop: 5,
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 10,
        }}
      >
        <Text
          style={{ ...fonts.regular14, color: '#8C8C8C' }}
          children={
            'Vui lòng chuyển khoản sau khi đặt hàng để quản trị viên xác nhận đơn hàng.'
          }
        />
        <View>
          <Text
            style={{ marginTop: 14, ...fonts.medium15 }}
            children={'Thông tin ngân hàng '}
          />
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              padding: 10,
              marginTop: 14,
            }}
          >
            <Text
              style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
              children={`Người nhận: ${pointData?.transfer_money_information.bank_account_name}`}
            />
            <DebounceButton
              onPress={() => {
                Clipboard.setString(
                  pointData?.transfer_money_information.bank_account_name
                )
                Toast.show(
                  `${pointData?.transfer_money_information.bank_account_name}`,
                  {
                    position: HEIGHT - 80,
                    animation: true,
                  }
                )
              }}
              children={
                <Image
                  source={R.images.icon_coppy}
                  style={{ width: 16, height: 16, tintColor: '#DDD' }}
                />
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              padding: 10,
              marginTop: 14,
            }}
          >
            <Text
              style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
              children={`Ngân hàng: ${pointData?.transfer_money_information.bank_name}`}
            />
            <DebounceButton
              onPress={() => {
                Clipboard.setString(
                  pointData?.transfer_money_information.bank_name
                )
                Toast.show(
                  `${pointData?.transfer_money_information.bank_name}`,
                  {
                    position: HEIGHT - 80,
                    animation: true,
                  }
                )
              }}
              children={
                <Image
                  source={R.images.icon_coppy}
                  style={{ width: 16, height: 16, tintColor: '#DDD' }}
                />
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              padding: 10,
              marginTop: 14,
            }}
          >
            <Text
              style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
              children={`STK: ${pointData?.transfer_money_information.bank_account_number}`}
            />
            <DebounceButton
              onPress={() => {
                Clipboard.setString(
                  pointData?.transfer_money_information.bank_account_number
                )
                Toast.show(
                  `${pointData?.transfer_money_information.bank_account_number}`,
                  {
                    position: HEIGHT - 80,
                    animation: true,
                  }
                )
              }}
              children={
                <Image
                  source={R.images.icon_coppy}
                  style={{ width: 16, height: 16, tintColor: '#DDD' }}
                />
              }
            />
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: '#DDD' }} />
          <Text
            style={{ ...fonts.regular14, color: '#DDD', marginHorizontal: 5 }}
            children={'Hoặc quét mã QR'}
          />
          <View style={{ flex: 1, height: 1, backgroundColor: '#DDD' }} />
        </View>
        <View
          style={{
            alignSelf: 'center',
            marginTop: 25,
          }}
        >
          <ViewShot
            ref={refCapture}
            options={{
              fileName: 'Your-File-Name',
              format: 'jpg',
              quality: 0.9,
            }}
          >
            <View>
              <FastImage
                source={{
                  uri: pointData?.transfer_money_information.bank_qr_code,
                }}
                style={{ width: WIDTH / 2.1, aspectRatio: 1 }}
                resizeMode={'cover'}
              />
            </View>
          </ViewShot>
          <DebounceButton
            style={{ marginTop: 20 }}
            onPress={() => {
              refCapture.current.capture().then((uri: any) => {
                CameraRoll.save(uri, {
                  type: 'photo',
                  album: 'Hoa Thanh Tước',
                })
                Toast.show(
                  'Lưu mã thành công! Ảnh đã được lưu vào bộ nhớ máy.',
                  {
                    position: HEIGHT - 80,
                    animation: true,
                  }
                )
              })
            }}
            children={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#D9D9D9',
                  alignSelf: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                }}
              >
                <FastImage
                  source={R.images.img_save_image}
                  style={{ width: 18, height: 18 }}
                />
                <Text
                  style={{
                    ...fonts.regular12,
                    marginLeft: 6,
                  }}
                  children={'Lưu mã'}
                />
              </View>
            }
          />
        </View>
      </View>
    )
  }

  return (
    <ScreenWrapper
      back
      isLoading={isLoading}
      titleHeader={'Chi tiết đơn hàng'}
      backgroundHeader={colors.white}
      color={colors.black}
      unsafe
    >
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: '10%' }}
      >
        {orderState()}
        {orderItemDetail?.status != 'cancelled' ? deliveryInformation() : null}
        {receiverInformation()}
        {listOrderItemDetail()}
        {paymentStatus()}
        {bottomStatus()}
        {dataConfig?.transfer_money_information ? renderInfoBank() : null}
        {/* {index == ORDER_STATUS_TYPE.PENDING.id - 1 && (
          <View
            style={{ height: 65, ...styleView.centerItem }}
            children={
              <Button
                onPress={onCancelOrder}
                children={
                  <View
                    style={styles.bottomButton}
                    children={
                      <Text
                        style={{ ...fonts.regular16 }}
                        children={'Huỷ đơn'}
                      />
                    }
                  />
                }
              />
            }
          />
        )} */}
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  headerStatus: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginTop: 1,
    alignItems: 'center',
  },
  orderItemView: {
    ...styleView.rowItem,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingBottom: 9,
  },
  bottomTextRight: {
    ...fonts.regular16,
  },
  bottomTextLeft: {
    ...fonts.regular16,
    color: '#69747E',
  },
  bottomButton: {
    ...styleView.centerItem,
    width: 122,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#69747E',
    marginTop: 30,
    // bottom: 50,
  },
})

export default OrderItemDetailScreen
