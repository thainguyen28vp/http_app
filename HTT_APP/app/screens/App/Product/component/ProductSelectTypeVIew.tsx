import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { ScrollView } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import QuantityCounter from '../../Shop/components/QuantityCounter'
import Dropdown from 'react-native-dropdown-enhanced'
import { useAppDispatch, useAppSelector } from '@app/store'
import { requestGetProductCustomAttribute } from '../slice/ProductCustomAttributeSlice'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestAddToCart } from '@app/service/Network/product/ProductApi'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice } from '@app/utils/FuncHelper'
import { checkDuplicatePrice } from '../utils/ProductUtils'
import Toast from 'react-native-root-toast'
import { updateCountCart } from '../../Notification/utils/NotificationUtils'
import reactotron from 'reactotron-react-native'
import FstImage from '@app/components/FstImage/FstImage'
import { checkProduct, requestListCartThunk } from '../../Shop/slice/CartSlice'
import { showMessages } from '@app/utils/AlertHelper'
// import { showMessages } from '@app/utils/GlobalAlertHelper'

const { width, height } = dimensions
const RATIO = width / 375

interface ModalProps {
  onClosePress: () => void
  stock_id?: number
  product_id?: number
  isBuyNow: boolean
  inTimeBuy: boolean
  shop_id?: number
  productDetail: any
}

const OPTION = {
  OPTION_1: 1,
  OPTION_2: 2,
}

const OPTION_REQUIRE = {
  NO_REQUIRE: 0,
  ONE_OPTION: 1,
  TWO_OPTION: 2,
}

const DEFAULT_AMOUNT = '1'

const ProductSelectTypeModal = (props: ModalProps) => {
  const {
    onClosePress,
    stock_id,
    product_id,
    isBuyNow,
    shop_id,
    productDetail,
    inTimeBuy,
  } = props

  const [option1, setOption1] = useState<number | undefined>()
  const [option2, setOption2] = useState<number | undefined>()
  const [stockId, setStockId] = useState<number>(stock_id)
  const [amount, setAmount] = useState<string>(DEFAULT_AMOUNT)
  const [selectTypeLoading, setSelectTypeLoading] = useState<boolean>(false)

  const { data, isLoading } = useAppSelector(
    state => state.ProductCustomAttributeReducer
  )
  const Dispatch = useAppDispatch()

  const stockData = useMemo(
    () =>
      data?.rows?.map((item: any) => ({ label: item.name, value: item.id })),
    [data]
  )
  const optionRequire = productDetail?.variants?.length
  const addToCartCondition = (): boolean => {
    return Boolean(
      (optionRequire == OPTION_REQUIRE.ONE_OPTION && option1 && amount) ||
        (optionRequire == OPTION_REQUIRE.TWO_OPTION &&
          option1 &&
          option2 &&
          amount) ||
        (optionRequire == OPTION_REQUIRE.NO_REQUIRE && !option1 && !option2)
    )
  }

  const handleAddToCart = () => {
    // if (isBuyNow) {
    //   onClosePress()
    //   setTimeout(() => {
    //     NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
    //       dataIsBuyNow: [
    //         {
    //           ...productDetail,
    //           product_image: productDetail?.images[0]?.src,
    //           quantity: amount,
    //           total: productDetail.price * +amount,
    //         },
    //       ],
    //     })
    //   }, 350)
    //   return
    // }
    if (!Number(amount)) {
      return showMessages('Thông báo', 'Vui lòng nhập số lượng sản phẩm!')
    }
    let payload = {
      quantity: Number(amount),
      product_variant_id: productDetail?.variants?.length
        ? productDetail?.variants[0]?.id
        : productDetail?.product?.variants[0]?.id ||
          productDetail?.products[0]?.product?.variants[0].id,
    }
    if (isBuyNow) {
      onClosePress()
      setTimeout(() => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
          dataIsBuyNow: [
            {
              ...productDetail,
              id: productDetail?.id,
              product_image: productDetail?.images[0]?.src,
              quantity: amount,
              total: productDetail.price * +amount,
            },
          ],
        })
      }, 100)
      return
    }
    callAPIHook({
      API: requestAddToCart,
      useLoading: setSelectTypeLoading,
      payload: payload,
      onSuccess: res => {
        if (isBuyNow) {
          onClosePress()
          setTimeout(() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
              dataIsBuyNow: [
                {
                  ...productDetail,
                  id: res.data.id,
                  product_image: productDetail?.images[0]?.src,
                  quantity: amount,
                  total: productDetail.price * +amount,
                },
              ],
            })
          }, 350)
          return
        }
        Dispatch(requestListCartThunk())
        Toast.show('Thêm sản phẩm thành công', {
          position: height - 150,
          animation: true,
        })
        // updateCountCart(Dispatch)
        // if (isBuyNow) {
        //   NavigationUtil.navigate(SCREEN_ROUTER_APP.CART, {
        //     price_id: data?.productPriceCustom?.ProductPrices[0]?.id,
        //     enter_id: shop_id,
        //     stock_id: data?.productPriceCustom?.ProductPrices[0]?.stock_id,
        //   })
        // } else
        //   Toast.show('Thêm sản phẩm thành công', {
        //     position: height - 150,
        //     animation: true,
        //   })
      },
      onFinaly: () => {
        onClosePress()
      },
    })
    // } else {
    //   Alert.alert('Thông báo', 'Vui lòng chọn hết thông tin')
    // }
  }

  const onDecreasePress = () => {
    if (Number(amount) == 1) {
      setAmount(DEFAULT_AMOUNT)
      return
    }
    setAmount(`${Number(amount) - 1}`)
  }

  const onIncreasePress = () => {
    if (amount < productDetail?.stock || inTimeBuy)
      return setAmount(`${Number(amount) + 1}`)
  }

  const onPressAttribute = (option: number, id: number) => {
    if (option == OPTION.OPTION_1) {
      if (option1 == id) setOption1(undefined)
      else setOption1(id)
    } else {
      if (option2 == id) setOption2(undefined)
      else setOption2(id)
    }
  }

  const clearAllSelect = () => {
    if (option1 && !option2) {
      setOption1(undefined)
    } else if (!option1 && option2) {
      setOption2(undefined)
    } else if (option1 && option2) {
      setOption1(undefined)
      setOption2(undefined)
    }
  }

  // useEffect(() => {
  //   Dispatch(
  //     requestGetProductCustomAttribute({
  //       id: product_id,
  //       stock_id: stockId,
  //       custom_attribute_option_id_1: option1,
  //       custom_attribute_option_id_2: option2,
  //     })
  //   )
  // }, [stockId, option1, option2])

  const renderPriceText = () => {
    let price = checkDuplicatePrice(data?.productPriceCustom?.min_max_price)
    if (optionRequire != OPTION_REQUIRE.NO_REQUIRE) {
      if (!!option1 || !!option2)
        price = `${formatPrice(
          data?.productPriceCustom?.ProductPrices[0]?.price
        )}đ`
    } else {
      price = `${formatPrice(
        data?.productPriceCustom?.ProductPrices[0]?.price
      )}đ`
    }

    return price
  }

  const renderProductName = (name: string) => {
    return !!name
      ? `${name.length >= 17 ? `${name.substring(0, 17)}...` : name}`
      : 'Đang cập nhật'
  }

  const renderCustomAttribute = () => {
    const productCustomAttributes =
      data.productPriceCustom?.ProductCustomAttributes

    const RenderOptionOne = () => (
      <React.Fragment>
        <Text style={{ ...fonts.regular14 }} children={'Màu sắc'} />
        <View
          style={{ ...styleView.rowItem, flexWrap: 'wrap', marginTop: 12 }}
          children={productDetail?.variants.map((item: any, index: number) => (
            <Button
              key={index}
              disabled={
                data?.disableSign ||
                (data?.arr_status_option_1 &&
                  (data?.arr_status_option_1[index] == 0 ? true : false)) ||
                false
              }
              onPress={() => onPressAttribute(OPTION.OPTION_1, item.id)}
              children={
                <View
                  style={[
                    styles.selectedItem,
                    {
                      backgroundColor:
                        item.id == option1 ? colors.primary : '#ECEBED',
                    },
                  ]}
                  children={
                    <Text
                      style={{
                        ...fonts.regular14,
                        color:
                          data?.arr_status_option_1?.length &&
                          data?.arr_status_option_1[index] == 0
                            ? '#BFBFBF'
                            : item.id == option1
                            ? colors.white
                            : colors.black,
                      }}
                    >
                      {item?.name}
                    </Text>
                  }
                />
              }
            />
          ))}
        />
      </React.Fragment>
    )

    const RenderOptionTwo = () => (
      <React.Fragment>
        <Text style={{ ...fonts.regular14 }} children={'test'} />
        <View
          style={{ ...styleView.rowItem, flexWrap: 'wrap', marginTop: 12 }}
          children={productDetail?.variants.map((item: any, index: number) => (
            <Button
              key={index}
              disabled={
                data?.disableSign ||
                (data?.arr_status_option_2 &&
                  (data?.arr_status_option_2[index] == 0 ? true : false)) ||
                false
              }
              onPress={() => onPressAttribute(OPTION.OPTION_2, item.id)}
              children={
                <View
                  style={[
                    styles.selectedItem,
                    {
                      backgroundColor:
                        item.id == option2 ? colors.primary : '#ECEBED',
                    },
                  ]}
                  children={
                    <Text
                      style={{
                        ...fonts.regular14,
                        color:
                          data?.arr_status_option_2 &&
                          data?.arr_status_option_2[index] == 0
                            ? '#BFBFBF'
                            : item.id == option2
                            ? colors.white
                            : colors.black,
                      }}
                    >
                      {item.name}
                    </Text>
                  }
                />
              }
            />
          ))}
        />
      </React.Fragment>
    )

    if (optionRequire == OPTION_REQUIRE.ONE_OPTION) return <></>
    else if (optionRequire == OPTION_REQUIRE.TWO_OPTION)
      return (
        <>
          {/* <RenderOptionOne /> */}
          {/* <RenderOptionTwo /> */}
        </>
      )
  }
  return (
    <View style={{ width, height }}>
      {Platform.OS == 'android' && <StatusBar translucent={false} />}
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.container}>
        <View style={{ ...styleView.rowItem }}>
          <FstImage
            style={{
              width: 76,
              height: 60,
              borderRadius: 12,
              marginRight: 8,
            }}
            resizeMode={'cover'}
            source={
              productDetail?.images?.length || productDetail?.products?.length
                ? {
                    uri: productDetail?.images?.length
                      ? productDetail?.images[0]?.src
                      : productDetail?.product_media_url ||
                        productDetail?.product?.product_media_url ||
                        productDetail?.products[0].product?.product_media_url,
                  }
                : R.images.image_logo
            }
          />
          <View style={{ justifyContent: 'space-between' }}>
            <View
              style={{
                ...styleView.rowItemBetween,
                width: width - 144,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ ...fonts.medium16, width: '90%' }}
                numberOfLines={3}
                children={
                  productDetail?.name ||
                  productDetail?.product?.name ||
                  productDetail?.products[0].product?.name
                }
              />
              <Button
                onPress={onClosePress}
                children={
                  <FastImage
                    style={{
                      width: 24,
                      height: 24,
                    }}
                    source={R.images.ic_close}
                  />
                }
              />
            </View>
            <Text
              style={{ ...fonts.medium18, color: colors.primary, marginTop: 5 }}
              // children={renderPriceText()}
              children={
                formatPrice(
                  productDetail?.price ||
                    productDetail?.selling_price ||
                    productDetail?.product?.price ||
                    productDetail?.products[0].product?.price
                ) + 'đ'
              }
            />
            <Text
              style={{ ...fonts.medium12, color: colors.line, marginTop: 8 }}
              // children={renderPriceText()}
              children={`Số lượng: ${
                productDetail?.products && productDetail?.products?.length
                  ? productDetail?.products[0].product?.stock
                  : productDetail?.stock || productDetail?.product?.stock || 0
              }`}
            />
          </View>
        </View>
        <QuantityCounter
          containerStyle={{ marginTop: 12, marginLeft: 86 }}
          onChangeText={text => {
            if (+text > productDetail?.stock && !inTimeBuy) {
              return setAmount(productDetail?.stock.toString())
            }
            setAmount(text)
          }}
          value={
            +amount > productDetail?.stock && !inTimeBuy
              ? productDetail?.stock.toString()
              : amount
          }
          dialogLoading={isLoading || selectTypeLoading}
          onIncreasePress={onIncreasePress}
          onDecreasePress={onDecreasePress}
        />
        {/* <ScrollView
          style={{
            marginTop: 10,
            minHeight: 150,
            maxHeight: 200,
          }}
          contentContainerStyle={{ paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderCustomAttribute()}
        </ScrollView> */}
        <Button
          onPress={handleAddToCart}
          children={
            <View
              style={{
                ...styleView.centerItem,
                backgroundColor: colors.primary,
                borderRadius: 16,
                height: 50,
                marginTop: '10%',
              }}
            >
              <Text
                style={{
                  ...fonts.medium16,
                  color: colors.white,
                }}
                children={!isBuyNow ? 'Thêm giỏ hàng' : 'Mua ngay'}
              />
            </View>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 30,
    position: 'absolute',
    bottom: height * 0.4,
    backgroundColor: colors.white,
    borderRadius: 30,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    zIndex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dropdown: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 0,
    borderRadius: 0,
  },
  selectedItem: {
    ...styleView.centerItem,
    paddingHorizontal: 11,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    marginBottom: 12,
  },
})

export default ProductSelectTypeModal
