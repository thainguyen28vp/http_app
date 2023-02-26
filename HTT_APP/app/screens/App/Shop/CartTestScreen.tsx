import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Button } from '@app/components/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
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
  requestDeleteCartItem,
  requestEditCartItem,
} from '@app/service/Network/shop/ShopApi'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'

const DEFAULT_AMOUNT = 1
enum AMOUNT_OPTION {
  INCREASE,
  DECREASE,
}

const CartScreen = (props: any) => {
  const productPriceId = props.route.params?.productPriceId
  const { data, isLoading, error, totalPrice } = useAppSelector(
    state => state.CartReducer
  )
  const Dispatch = useAppDispatch()
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [amountLoading, setAmountLoading] = useState<number | undefined>()

  const onTrashPress = (
    cart_id: number,
    stock_id: number,
    enter_id: number
  ) => {
    showConfirm(
      '',
      'Bạn có chắc chắn muốn xoá sản phẩm này',
      () => {
        callAPIHook({
          API: requestDeleteCartItem,
          payload: { id: cart_id },
          useLoading: setDialogLoading,
          onSuccess: res => {
            Dispatch(
              deleteCartItem({
                cart_id,
                stock_id,
                enter_id,
              })
            )
          },
        })
      },
      'Xoá'
    )
  }

  const handleAmountCounter = async (
    cartId: number,
    stockId: number,
    enterId: number,
    quantity: number,
    option: number
  ) => {
    let body
    if (option == AMOUNT_OPTION.INCREASE) {
      body = { amount: quantity + DEFAULT_AMOUNT }
    } else {
      body =
        quantity == DEFAULT_AMOUNT
          ? { amount: DEFAULT_AMOUNT }
          : { amount: quantity - DEFAULT_AMOUNT }
    }
    let payload = { body, id: cartId }

    setAmountLoading(cartId)
    await callAPIHook({
      API: requestEditCartItem,
      payload,
      onSuccess: res => {
        Dispatch(
          option == AMOUNT_OPTION.INCREASE
            ? increaseQuantity({
                cart_id: cartId,
                stock_id: stockId,
                enter_id: enterId,
              })
            : decreaseQuantity({
                cart_id: cartId,
                stock_id: stockId,
                enter_id: enterId,
              })
        )
      },
      onFinaly: () => {
        setAmountLoading(undefined)
      },
    })
  }

  const _renderStockItem = (item: any, index: number, enter_id: number) => {
    let uri = item?.product_attribute_name_1?.ProductMedium?.media_url
    const attribute_name_2 = item?.product_attribute_name_2?.name
    const attribute_name = attribute_name_2
      ? `${item?.product_attribute_name_1?.name} 〡 ${attribute_name_2}`
      : `${item?.product_attribute_name_1?.name}`

    // reactotron.logImportant!(item.id == productPriceId)
    // if (productPriceId == item.id)
    //   Dispatch(
    //     checkProduct({
    //       price_id: item.id,
    //       stock_id: item.stock_id,
    //       enter_id,
    //     })
    //   )

    return (
      <View style={styles.itemContainer}>
        <CheckBox
          fillColor={'#D5A227'}
          containerStyle={[styles.checkBox, { marginRight: 12 }]}
          onPress={() => {
            Dispatch(
              checkProduct({
                cart_id: item.Cart.id,
                stock_id: item.stock_id,
                enter_id,
              })
            )
          }}
          isCheck={item.isCheck}
        />
        <View style={{ flex: 1 }}>
          <Button
            onPress={
              () => {}
              // NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
              //   id: item.product_id,
              // })
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
                  source={uri ? { uri } : R.images.img_product}
                />
                <View style={{ justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      ...fonts.semi_bold15,
                    }}
                    children={
                      item?.product_name?.length > 30
                        ? `${item?.product_name?.slice(0, 30)}...`
                        : item?.product_name
                    }
                  />
                  <Text
                    style={{ ...fonts.regular15, marginVertical: 4 }}
                    children={attribute_name}
                  />
                  <Text
                    style={{
                      ...fonts.regular14,
                      marginRight: 10,
                      color: colors.primary,
                    }}
                    children={`${formatPrice(item?.price)} đ`}
                  />
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
            dialogLoading={item?.Cart.id === amountLoading}
            onTrashPress={() =>
              onTrashPress(item.Cart.id, item.stock_id, enter_id)
            }
            value={`${item.Cart?.amount}` || ''}
            onIncreasePress={() =>
              handleAmountCounter(
                item.Cart.id,
                item.stock_id,
                enter_id,
                item.Cart?.amount,
                AMOUNT_OPTION.INCREASE
              )
            }
            onDecreasePress={() =>
              handleAmountCounter(
                item.Cart.id,
                item.stock_id,
                enter_id,
                item.Cart?.amount,
                AMOUNT_OPTION.DECREASE
              )
            }
            onChangeText={text => {
              Dispatch(
                onChangePrice({
                  quantity: text,
                  cart_id: item.Cart.id,
                  stock_id: item.stock_id,
                  enter_id,
                })
              )
            }}
          />
        </View>
      </View>
    )
  }

  const _renderStock = (item: any, enter_id: number) => {
    return (
      <>
        <Button
          onPress={() => {
            Dispatch(
              checkStock({
                id: item.id,
                enter_id,
              })
            )
          }}
          children={
            <View
              style={{
                ...styleView.rowItem,
                alignItems: 'center',
                marginBottom: 17,
                marginLeft: 20,
              }}
            >
              <CheckBox
                fillColor={'#D5A227'}
                containerStyle={styles.checkBox}
                isCheck={item.isCheck}
              />
              <Text
                style={{ ...fonts.regular16, marginLeft: 8 }}
                children={item.name}
              />
            </View>
          }
        />
        <FlatList
          data={item.ProductPrices}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            _renderStockItem(item, index, enter_id)
          }
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          keyExtractor={(_, index) => index.toString()}
        />
      </>
    )
  }

  const _renderEnterprise = ({ item, index }: { item: any; index: number }) => {
    const enter_id = item.id
    return (
      <>
        <Button
          onPress={() => {
            Dispatch(checkEnterprise(item.id))
          }}
          children={
            <View style={styles.depotView}>
              <FstImage
                style={{ width: 24, height: 24, borderRadius: 12 }}
                source={{ uri: item.profile_picture_url }}
              />
              <Text
                style={{ ...fonts.semi_bold16, marginLeft: 8 }}
                children={item.name}
              />
            </View>
          }
        />
        <FlatList
          style={{ marginTop: 16 }}
          data={item.Stocks}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
          renderItem={({ item }) => _renderStock(item, enter_id)}
          showsVerticalScrollIndicator={false}
        />
      </>
    )
  }

  const getData = () => {
    Dispatch(requestListCartThunk())
  }

  useEffect(() => {
    getData()
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
    >
      <FlatList
        data={data}
        refreshing={isLoading}
        onRefresh={getData}
        contentContainerStyle={
          {
            // paddingBottom: getBottomSpace() + 80,
          }
        }
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        renderItem={_renderEnterprise}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
      <View style={styles.bottomView}>
        <View>
          <Text
            style={{ ...fonts.regular14, marginBottom: 4 }}
            children={R.strings().total_money}
          />
          <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={`${formatPrice(totalPrice?.toString()!) || 0}đ`}
          />
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
            if (!totalPrice) showMessages('', 'Chưa chọn sản phẩm')
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
    height: 65 + getBottomSpace(),
    padding: 20,
    backgroundColor: colors.white,
    // position: 'absolute',
    bottom: 0,
    alignItems: 'center',
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
