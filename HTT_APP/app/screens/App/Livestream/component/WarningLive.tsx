import R from '@app/assets/R'
import { fonts } from '@app/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

const WarningLive = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffec3d',
        padding: 5,
      }}
    >
      <FastImage
        source={R.images.img_warning}
        style={{ width: 20, height: 20 }}
      />
      <Text
        style={{ marginLeft: 5, ...fonts.medium13 }}
        children={'Livestream của bạn hiện đang được phát trực tiếp!'}
      />
    </View>
  )
}

export default WarningLive

const styles = StyleSheet.create({})
