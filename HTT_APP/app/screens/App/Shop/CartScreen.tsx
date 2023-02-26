import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Button, DebounceButton } from '@app/components/Button/Button'
import { colors, fonts, HEIGHT, styleView } from '@app/theme'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import R from '@app/assets/R'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { formatPrice } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import FstImage from '@app/components/FstImage/FstImage'
import CheckBox from './components/CheckBox'
import { useAppDispatch, useAppSelector } from '@app/store'
import QuantityCounter from './components/QuantityCounter'
import { callAPIHook } from '@app/utils/CallApiHelper'
import Empty from '@app/components/Empty/Empty'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import reactotron from 'ReactotronConfig'
import {
  checkAll,
  checkEnterprise,
  checkProduct,
  checkStock,
  decreaseQuantity,
  deleteCartItem,
  increaseQuantity,
  onChangePrice,
  requestListCartThunk,
} from './slice/CartSlice'
import {
  requestDeleteAllCartItem,
  requestDeleteCartItem,
  requestEditCartItem,
} from '@app/service/Network/shop/ShopApi'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { getCountCart } from '@app/service/Network/home/HomeApi'
import { updateCountCart } from '../Notification/utils/NotificationUtils'
import Toast from 'react-native-root-toast'
import { isIphoneX } from 'react-native-iphone-x-helper'

const DEFAULT_AMOUNT = 1
enum AMOUNT_OPTION {
  INCREASE,
  DECREASE,
}

const CartScreen = (props: any) => {
  const price_id = props.route.params?.price_id
  const stock_id = props.route.params?.stock_id
  const enter_id = props.route.params?.enter_id

  const { data, isLoading, error, totalPrice, isCheckAll } = useAppSelector(
    (state: any) => state.CartReducer
  )
  const Dispatch = useAppDispatch()
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [amountLoading, setAmountLoading] = useState<number | undefined>()

  const handleDeleteAllProduct = () => {
    showConfirm(
      '',
      'Bạn có chắc chắn muốn xoá toàn bộ sản phẩm trong giỏ hàng không?',
      () => {
        callAPIHook({
          API: requestDeleteAllCartItem,
          useLoading: setDialogLoading,
          onSuccess: res => {
            getData()
            Toast.show('Xoá sản phẩm thành công!', {
              position: HEIGHT - 150,
              animation: true,
            })
            // Dispatch(
            //   deleteCartItem({
            //     cart_id,
            //     stock_id,
            //     enter_id,
            //   })
            // )
          },
        })
      },
      'Xoá'
    )
  }

  const onTrashPress = (id: number) => {
    showConfirm(
      '',
      'Bạn có chắc chắn muốn xoá sản phẩm này không?',
      () => {
        callAPIHook({
          API: requestDeleteCartItem,
          payload: { id },
          useLoading: setDialogLoading,
          onSuccess: res => {
            Dispatch(deleteCartItem({ id }))
          },
        })
      },
      'Xoá'
    )
  }

  const handleAmountCounter = async (
    id: number,
    option: number,
    quantity: number
  ) => {
    let body
    if (option == AMOUNT_OPTION.INCREASE) {
      body = { quantity: quantity + DEFAULT_AMOUNT }
    } else {
      body =
        quantity == DEFAULT_AMOUNT
          ? { quantity: DEFAULT_AMOUNT }
          : { quantity: quantity - DEFAULT_AMOUNT }
    }
    let payload = {
      id: id,
      body,
    }
    await callAPIHook({
      API: requestEditCartItem,
      payload,
      onSuccess: res => {
        Dispatch(
          option == AMOUNT_OPTION.INCREASE
            ? increaseQuantity({ id })
            : decreaseQuantity({ id })
        )
      },
      onFinaly: () => {
        setAmountLoading(undefined)
      },
    })
  }

  const _renderStockItem = (item: any, index: number, enter_id: number) => {
    let uri = item?.product_image
    const attribute_name_1 = item?.product_attribute_name_1?.name
    const attribute_name_2 = item?.product_attribute_name_2?.name
    const attribute_name =
      !!attribute_name_1 && !attribute_name_2
        ? `${attribute_name_1}`
        : !!attribute_name_1 && !!attribute_name_2
        ? `${attribute_name_1} 〡 ${attribute_name_2}`
        : ''

    return (
      <View style={[styles.itemContainer]}>
        <CheckBox
          fillColor={'#D5A227'}
          containerStyle={[styles.checkBox, { marginRight: 12 }]}
          onPress={() => {
            Dispatch(checkProduct({ id: item.id }))
          }}
          isCheck={item.isCheck}
        />
        <View style={{ flex: 1 }}>
          <Button
            disabled={true}
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
                }}
              >
                <FstImage
                  style={styles.itemImg}
                  source={{ uri }}
                  resizeMode={'cover'}
                />
                <View style={{ justifyContent: 'space-between', width: '75%' }}>
                  <Text
                    style={{
                      ...fonts.semi_bold15,

                      // width: '75%',
                    }}
                    numberOfLines={3}
                    children={
                      item?.product_name
                      // item?.product_name?.length > 35
                      //   ? `${item?.product_name?.slice(0, 35)}...`
                      //   : item?.product_name
                    }
                    // numberOfLines={3}
                  />
                  {/* <Text
                    style={{ ...fonts.regular15, marginVertical: 4 }}
                    children={attribute_name}
                  /> */}
                  <Text
                    style={{
                      marginTop: 8,
                      ...fonts.medium14,
                      marginRight: 10,
                      color: colors.primary,
                    }}
                    children={`${formatPrice(item?.price) || 0} đ`}
                  />
                  {/* <Text
                    style={{
                      ...fonts.medium12,
                      color: colors.line,
                      marginTop: 8,
                    }}
                    // children={renderPriceText()}
                    children={'Số lượng: ' + 100}
                  /> */}
                </View>
              </View>
            }
          />
          <QuantityCounter
            containerStyle={{
              marginLeft: 84,
              justifyContent: 'space-between',
            }}
            minusBtnStyle={styles.quantityCounterBtn}
            plusBtnStyle={styles.quantityCounterBtn}
            inputStyle={{ backgroundColor: colors.white }}
            showTrashView
            // dialogLoading={item?.Cart.id === amountLoading}
            onTrashPress={() => {
              onTrashPress(item.id)
            }}
            value={`${item.quantity}` || ''}
            onIncreasePress={() => {
              handleAmountCounter(
                item.id,
                AMOUNT_OPTION.INCREASE,
                item.quantity
              )
            }}
            onDecreasePress={() => {
              handleAmountCounter(
                item.id,
                AMOUNT_OPTION.DECREASE,
                item.quantity
              )
            }}
            onChangeText={text => {
              Dispatch(
                onChangePrice({
                  quantity: text,
                  id: item.id,
                })
              )
            }}
          />
        </View>
      </View>
    )
  }

  const getData = (dataBuyNow?: any) => {
    Dispatch(requestListCartThunk(dataBuyNow))
  }

  useEffect(() => {
    getData()
    // Boolean(price_id && stock_id && enter_id)
    //   ? getData({ price_id, stock_id, enter_id })
    //   : getData()

    return () => {
      // updateCountCart(Dispatch)
    }
  }, [])
  return (
    <ScreenWrapper
      back
      unsafe
      color={colors.black}
      titleHeader={R.strings().cart}
      backgroundHeader={colors.white}
      isLoading={isLoading}
      dialogLoading={dialogLoading}
      rightComponent={
        <>
          {data?.length ? (
            <DebounceButton
              onPress={handleDeleteAllProduct}
              children={
                <FstImage
                  source={R.images.img_trash_all}
                  style={{ width: 25, height: 25 }}
                />
              }
            />
          ) : null}
        </>
      }
    >
      <FlatList
        data={data}
        refreshing={isLoading}
        onRefresh={() => getData()}
        contentContainerStyle={{ paddingBottom: 8 }}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        renderItem={({ item, index }) =>
          _renderStockItem(item, index, enter_id)
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
      {Boolean(data?.length) && (
        <View style={[styles.bottomView]}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                fillColor={'#D5A227'}
                containerStyle={[styles.checkBox, { marginRight: 12 }]}
                onPress={() => {
                  Dispatch(checkAll({ isCheckAll }))
                }}
                isCheck={isCheckAll}
                title={'Chọn tất cả'}
              />
              {/* <Text style={{ ...fonts.medium15 }} children={'Chọn tất cả'} /> */}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ ...fonts.regular14, marginBottom: 4 }}
                children={R.strings().total_money}
              />
              <Text
                style={{ ...fonts.semi_bold16, color: colors.primary }}
                children={`${formatPrice(totalPrice?.toString()!) || 0}đ`}
              />
            </View>
          </View>
          <Button
            disabled={data?.length == 0}
            style={[
              styles.btnOrder,
              {
                backgroundColor: data?.length == 0 ? '#333' : colors.primary,
              },
            ]}
            onPress={() => {
              if (!totalPrice) showMessages('', 'Vui lòng chọn sản phẩm!')
              else NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT)
            }}
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
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  depotView: {
    ...styleView.rowItem,
    marginTop: 2,
    paddingVertical: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomView: {
    ...styleView.rowItemBetween,
    width: '100%',
    height: isIphoneX() ? getBottomSpace() + 85 : HEIGHT * 0.13,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: colors.white,
  },
  btnOrder: {
    ...styleView.centerItem,
    width: 159,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  itemContainer: {
    ...styleView.rowItem,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  itemImg: {
    width: 72,
    height: 72,
    borderRadius: 5,
    marginRight: 12,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  quantityCounterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
})

export default CartScreen
