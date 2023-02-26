import R from '@app/assets/R'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

const RightHeaderComponent = () => {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}
    >
      <TouchableOpacity onPress={() => {}}>
        <View
          style={[styles.headerButton, { marginRight: 12 }]}
          children={
            <FastImage
              style={{ width: 22, height: 22 }}
              source={R.images.ic_cart}
              resizeMode={'contain'}
            />
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <View
          style={styles.headerButton}
          children={
            <FastImage
              style={{ width: 24, height: 24 }}
              source={R.images.ic_heart}
              resizeMode={'contain'}
            />
          }
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RightHeaderComponent
