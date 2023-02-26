import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { colors, fonts } from '@app/theme'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import React, { memo } from 'react'
import isEqual from 'react-fast-compare'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

interface propsItemListProduct {
  item: any
  index: number
  onChangeTextCode: (code: string) => void
  onPressDeleteProduct: () => void
  onPressImgProduct: () => void
  onPressUpdateCodeItem: () => void
}

const ItemListProduct = ({
  item,
  index,
  onPressImgProduct,
  onChangeTextCode,
  onPressDeleteProduct,
  onPressUpdateCodeItem,
}: propsItemListProduct) => {
  return (
    <View
      style={styles.vItemListProduct}
      children={
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
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
          <View style={styles.vValueItem}>
            <Text style={styles.txtNameProductItem} children={item.name} />
            <Text
              style={styles.txtPrice}
              children={formatPrice(item?.price || 0) + 'đ'}
            />
            <View style={styles.vInputCode}>
              <FstImage
                source={R.images.img_edit_title}
                style={styles.imgEdit}
              />
              <TextInput
                onFocus={() => {}}
                value={item.code_product_livestream}
                style={styles.vTextInputCode}
                maxLength={50}
                multiline={true}
                placeholder={'Nhập mã sản phẩm'}
                onChangeText={onChangeTextCode}
              />
            </View>
          </View>
          <View style={styles.vAction}>
            <Button
              onPress={onPressDeleteProduct}
              style={styles.btnTrash}
              children={
                <FastImage
                  source={R.images.img_trash}
                  style={styles.imgTrash}
                  tintColor={colors.primary}
                  resizeMode={'contain'}
                />
              }
            />
            <Button
              onPress={onPressUpdateCodeItem}
              style={styles.btnTrash}
              children={
                <Text
                  style={{
                    color: colors.primary,
                    ...fonts.medium14,
                  }}
                  children={'Lưu'}
                />
              }
            />
          </View>
        </View>
      }
    />
  )
}

export default memo(ItemListProduct, isEqual)
