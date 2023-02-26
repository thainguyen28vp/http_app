import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch } from '@app/store'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import { BlurView } from '@react-native-community/blur'
import React from 'react'
import { Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { requestGetHomeThunk } from '../Home/slice/HomeSlice'
import { getListLiveStreamThunk } from './slice/LiveStreamSlice'
import { styles } from './styles'
import { STATUS_LIST_LIVE } from './YoutubeWatchingScreen'

const EndLiveScreen = ({ data }: { data: any }) => {
  const appDispatch = useAppDispatch()

  const handleClose = () => {
    appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
    appDispatch(requestGetHomeThunk())
    setTimeout(() => {
      NavigationUtil.goBack()
    }, 250)
  }
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
          top: HEIGHT / 2 - 50,
        }}
      >
        <FastImage
          source={R.images.img_end_live}
          style={{ width: 46, height: 50 }}
        />
        <Text
          style={{ marginTop: 20, color: colors.white, ...fonts.medium14 }}
          children={'Livestream hiện tại đã kết thúc!'}
        />
      </View>
      <Button
        style={{
          position: 'absolute',
          top: '5%',
          right: '2%',
          padding: 5,
        }}
        onPress={handleClose}
        children={
          <FastImage
            style={{
              width: 40,
              height: 40,
            }}
            source={R.images.img_close_lv}
          />
        }
      />
    </View>
  )
}

export default EndLiveScreen
