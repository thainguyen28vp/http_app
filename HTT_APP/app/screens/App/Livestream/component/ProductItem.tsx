import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts } from '@app/theme'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ProductItem = ({
  item,
  onPressCheck,
}: {
  item: object
  onPressCheck: () => void
}) => {
  return (
    <TouchableOpacity
      onPress={onPressCheck}
      style={{
        flexDirection: 'row',
        marginTop: 1,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D0DBEA',
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          padding: 5,
          marginRight: 8,
        }}
        onPress={onPressCheck}
      >
        <FstImage
          source={item?.checked ? R.images.img_check : R.images.img_unchecked}
          style={{ width: 22, height: 22 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
          //   id: item.id,
          // })
        }}
      >
        <FstImage
          source={{ uri: item?.images[0]?.src }}
          style={{ width: 70, height: 70, borderRadius: 5 }}
        />
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: 15,
          flex: 1,
          justifyContent: 'space-around',
        }}
      >
        <Text style={{ ...fonts.regular16 }} children={item.name} />
        <Text
          style={{
            ...fonts.regular15,
            color: colors.primary,
            marginTop: 8,
          }}
          children={formatPrice(item?.price) + ' đ'}
        />
      </View>
    </TouchableOpacity>
  )
}

export default ProductItem

const styles = StyleSheet.create({})
