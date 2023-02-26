import R from '@app/assets/R'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

const LoadingLiveCustomer = ({
  handleBackOffStream,
  title,
  hide,
}: {
  handleBackOffStream: () => void
  title?: string
  hide?: boolean
}) => {
  return (
    <View style={styles.vLoadingLiveCus}>
      {!!!hide ? (
        <TouchableOpacity
          style={styles.vBtnCloseLoading}
          onPress={handleBackOffStream}
          children={
            <FastImage
              source={R.images.img_close_lv}
              style={{ width: 32, height: 32 }}
              resizeMode={'contain'}
            />
          }
        />
      ) : null}
      <ActivityIndicator
        size={60}
        color="#222"
        style={styles.activityIndicator}
      />
      <Text
        style={[styles.loadingText, { width: '80%', textAlign: 'center' }]}
        children={title || R.strings().loading_join_live}
      />
    </View>
  )
}

export default LoadingLiveCustomer
