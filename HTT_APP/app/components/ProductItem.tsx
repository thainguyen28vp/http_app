import R from '@app/assets/R'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import ArticleImageArea from '@app/screens/App/Home/component/PostImageArea'
import stylesProduct from '@app/screens/App/Product/styles/stylesProduct'
import {
  requestAddToWishList,
  requestCheckExistProduct,
} from '@app/service/Network/product/ProductApi'
import { colors, fonts, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Button } from './Button/Button'
import FstImage from './FstImage/FstImage'

interface Props {
  item: any
  index: number
  showLikeIcon?: boolean
  token?: boolean
  inTimeBuy?: boolean
  onPressProductItem?: ((item: any) => void) | undefined
}

const ProductItem = ({
  item,
  index,
  showLikeIcon = true,
  onPressProductItem,
  token,
  inTimeBuy,
}: Props) => {
  const [liked, setLiked] = useState<boolean>(Boolean(item?.check_like))

  const addToFavoriteList = () => {
    setLiked(prev => !prev)
    callAPIHook({
      API: requestAddToWishList,
      payload: { product_id: item.id },
      onError: () => {
        setLiked(prev => !prev)
      },
    })
  }

  const handleOnProductPress = (item: any) => {
    // callAPIHook({
    //   API: requestCheckExistProduct,
    //   payload: { id: item.id },
    //   onSuccess: res => {
    //     if (res.data) {
    //       NavigationUtil.push(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
    //         product_id: item.id,
    //         item: item,
    //       })
    //     } else {
    //       showMessages('', 'Sản phẩm đã ngừng bán')
    //     }
    //   },
    // })
    NavigationUtil.push(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
      product_id: item.id,
      item: item,
      token,
      inTimeBuy,
    })
  }

  const handleType = (type?: string) => {
    switch (type) {
      case 'is_new':
        return 'Hàng mới'
      case 'is_best_selling':
        return 'Bán chạy'
      case 'is_sale_off':
        return 'Hàng giảm giá'
      default:
        break
    }
  }

  return (
    <Button
      style={stylesProduct.vButton}
      onPress={() => handleOnProductPress(item)}
      children={
        <>
          <FstImage
            style={{
              width: WIDTH * 0.5 - 20,
              height: WIDTH * 0.5,
            }}
            source={
              item?.images[0]
                ? { uri: item?.images[0]?.src }
                : R.images.image_logo
            }
            resizeMode={item?.images[0] ? 'cover' : 'contain'}
          >
            {item?.custom_type ? (
              <View
                style={{
                  backgroundColor: colors.primary,
                  position: 'absolute',
                  bottom: 5,
                  left: 5,
                  borderRadius: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                children={
                  <Text
                    style={{ ...fonts.regular12, color: 'white' }}
                    children={handleType(item?.custom_type)}
                  />
                }
              />
            ) : null}
          </FstImage>

          <View
            style={{
              marginTop: 12,
              marginHorizontal: 12,
            }}
          >
            <Text
              style={{ ...fonts.regular16 }}
              numberOfLines={2}
              children={item?.name + ' ' + (item?.unit || '')}
            />
            {token ? (
              <>
                <Text
                  style={{ ...fonts.regular12, marginTop: 5, color: '#595959' }}
                  children={
                    // 'Đã bán: ' + (item?.sold < 0 ? 0 : formatPrice(item?.sold) || 0)
                    'Số lượng: ' + item.stock
                  }
                />
                <Text
                  style={{
                    ...fonts.semi_bold15,
                    marginTop: 5,
                    color: '#262626',
                  }}
                  children={(formatPrice(item?.price) || 0) + 'đ'}
                />
              </>
            ) : (
              <Text
                style={{
                  ...fonts.regular16,
                  marginTop: 10,
                  color: '#595959',
                  marginBottom: 20,
                  // mab: 20,
                }}
                children={'Liên hệ'}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                onPressProductItem(item)
              }}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
              children={
                <FastImage
                  style={{ width: 34, height: 34 }}
                  source={R.images.img_create}
                />
              }
            />
          </View>

          {/* {!!item.ProductMedia && <ArticleImageArea data={item.ProductMedia} />}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
            }}
          >
            <Text
              style={{ ...fonts.regular18, flex: 1 }}
              children={item.name}
            />
            {showLikeIcon && (
              <Button
                onPress={addToFavoriteList}
                children={
                  <FstImage
                    source={liked ? R.images.icon_heart_red : R.images.ic_heart}
                    style={{ width: 24, height: 24 }}
                  />
                }
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...fonts.regular18,
                flex: 1,
                color: '#E84343',
              }}
              children={handlePrice(item.min_max_price)}
            />
            <Text
              style={{ ...fonts.regular16, color: '#69747E' }}
              children={`Đã bán: ${item.quantity_items}`}
            />
          </View> */}
        </>
      }
    />
  )
}

export default ProductItem
