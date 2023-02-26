import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { TYPE_ITEM } from '@app/config/Constants'
import { handlePrice } from '@app/utils/FuncHelper'
import React, { memo } from 'react'
import isEqual from 'react-fast-compare'
import { Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

interface propsItemListProductCart {
  item: any
  index: number
  onPressImgProduct: () => void
  onPressShowProduct: () => void
  onPressAddCart: () => void
  type: number
  itemProduct?: any
  isPreview?: boolean
  isShop?: boolean
}

const ItemListProductCart = ({
  item,
  index,
  onPressImgProduct,
  onPressShowProduct,
  onPressAddCart,
  type,
  itemProduct,
  isPreview,
  isShop,
}: propsItemListProductCart) => {
  const { show, showing } = R.strings()
  let checkIDItemProduct = itemProduct?.id === item?.id
  return (
    <View
      style={styles.vItemProductCart}
      children={
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={onPressImgProduct}
            children={
              <FstImage
                source={
                  item?.images?.length
                    ? {
                        uri: item?.src || item?.images[0].src,
                      }
                    : R.images.image_logo
                }
                style={styles.imgProduct}
              />
            }
          />
          <View style={styles.vValueProductCart}>
            <Text
              numberOfLines={2}
              style={styles.txtNameProductItem}
              children={
                isShop ? item.name : item.code_product_livestream || item.name
              }
            />
            <Text style={styles.txtPrice} children={item.price} />
          </View>
          {type === TYPE_ITEM.LIST_PRODUCT_SELL && !isPreview && (
            <Button
              disabled={checkIDItemProduct}
              onPress={onPressShowProduct}
              style={[
                styles.vBtnShowProduct,
                {
                  borderWidth: checkIDItemProduct ? 0 : 1,
                },
              ]}
              children={
                <Text
                  style={styles.txtShowProduct}
                  children={checkIDItemProduct ? showing : show}
                />
              }
            />
          )}
          {type === TYPE_ITEM.LIST_PRODUCT_CART && !isPreview && (
            <Button
              onPress={onPressAddCart}
              style={{ alignSelf: 'center' }}
              children={
                <FastImage
                  source={R.images.img_add_cart_live}
                  style={styles.img_add_cart}
                  resizeMode={'contain'}
                />
              }
            />
          )}
        </View>
      }
    />
  )
}

export default memo(ItemListProductCart, isEqual)
