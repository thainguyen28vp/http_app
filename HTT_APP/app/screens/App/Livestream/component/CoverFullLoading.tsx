import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import { BlurView } from '@react-native-community/blur'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

const CoverFullLoading = ({ data }: { data: {} }) => {
  return (
    <View style={styles.coverFullScreenLoading}>
      <FastImage
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
        source={{ uri: data.cover_image_url }}
      />
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="white"
      />
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          top: HEIGHT / 2 - 20,
        }}
      >
        <ActivityIndicator size={'large'} color={colors.white} />
        <Text
          style={{ marginTop: 5, color: colors.white, ...fonts.medium14 }}
          children={'Đang xử lý...'}
        />
      </View>
    </View>
  )
}

export default CoverFullLoading
