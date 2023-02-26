import { colors, styleView } from '@app/theme'
import React, { useState } from 'react'
import { View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native'
import FastImage, { Source, ImageStyle } from 'react-native-fast-image'
import { Button } from './Button/Button'
import FstImage from './FstImage/FstImage'
import MediaPickerModal from './MediaPickerModal'
import reactotron from 'ReactotronConfig'
import { ImageOrVideo } from 'react-native-image-crop-picker'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { handleResizeImage } from '@app/utils/FuncHelper'

interface Props {
  src: Source | number
  accessorySrc: Source | number
  style?: ViewStyle
  imgStyle?: ImageStyle
  size?: number
  accessorySize?: number
  onSelect?: (res: any) => void
  isLoading?: boolean
}

const Avatar = (props: Props) => {
  const {
    src,
    accessorySrc,
    style,
    imgStyle,
    size = 100,
    accessorySize = 26,
    onSelect,
    isLoading,
  } = props

  const [isVisible, setIsVisible] = useState<boolean>(false)

  const bytesToMegaBytes = (bytes: number) => Math.floor(bytes / (1024 * 1024))

  const onPicker = (res: ImageOrVideo) => {
    if (bytesToMegaBytes(res.size) >= 3)
      showMessages('', 'Ảnh có dung lượng quá lớn')
    else {
      !!onSelect && onSelect(res.uri)
    }
  }

  const handleOnPicker = async (res: any) => {
    let url = await handleResizeImage(res.data[0])
    onPicker(url)
  }

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size={'small'} color={colors.primary} />
      ) : (
        <FstImage
          style={[styles.img, { borderRadius: size / 2 }, imgStyle]}
          source={src}
          resizeMode={'cover'}
        />
      )}
      <Button
        onPress={() => {
          setIsVisible(true)
        }}
        style={[
          styles.accessoryView,
          {
            width: accessorySize,
            height: accessorySize,
            borderRadius: accessorySize / 2,
          },
        ]}
        children={
          <FastImage
            style={{ width: '70%', aspectRatio: 1, borderRadius: size / 2 }}
            source={accessorySrc}
          />
        }
      />
      <MediaPickerModal
        isVisible={isVisible}
        useVisible={setIsVisible}
        mediaType={'photo'}
        onPicker={handleOnPicker}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    // ...styleView.centerItem
  },
  img: {
    width: '100%',
    height: '100%',
  },
  accessoryView: {
    ...styleView.centerItem,
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'white',
  },
  accessory: {},
})

export default Avatar
