import R from '@app/assets/R'
import { useAppSelector } from '@app/store'
import { colors, fonts, styleView } from '@app/theme'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

const CartButton = () => {
  const { data } = useAppSelector(state => state.CartReducer)

  return (
    <View style={{ ...styleView.centerItem }}>
      {data?.length != 0 && (
        <View
          style={{
            ...styleView.centerItem,
            position: 'absolute',
            width: 16,
            height: 16,
            backgroundColor: colors.primary,
            borderRadius: 8,
            top: -3,
            right: -3,
          }}
          children={
            <Text
              style={{ ...fonts.medium10, color: colors.white }}
              children={`${data?.length}`}
            />
          }
        />
      )}
      <FastImage
        style={{ width: 24, height: 24, zIndex: -1 }}
        source={R.images.ic_cart}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default CartButton
