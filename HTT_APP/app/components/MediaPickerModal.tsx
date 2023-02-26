import R from '@app/assets/R'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import React, { memo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Picker from 'react-native-image-crop-picker'
import Modal from 'react-native-modal'

interface Props {
  isVisible: boolean
  useVisible: (visible: boolean) => void
  allowCrop?: boolean
  multiply?: boolean
  onPicker: (res: any) => void
  mediaType?: 'any' | 'video' | 'photo'
  maxFiles?: number
  width?: number
  height?: number
  id?: number
}

const { width } = dimensions

const MediaPickerComponent = (props: Props) => {
  const {
    isVisible,
    useVisible,
    multiply = false,
    allowCrop = false,
    onPicker,
    mediaType = 'photo',
    maxFiles = 5,
    id,
  } = props

  const handleMediaResponse = (res: any) => {
    const media = Array.isArray(res) ? res : [res]
    return { id, data: media }
  }

  return (
    <Modal
      isVisible={isVisible}
      animationOut="fadeOut"
      onBackdropPress={() => useVisible(!isVisible)}
      style={{ alignItems: 'center' }}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <TouchableOpacity
            onPress={() => {
              Picker.openCamera({
                width: 400,
                height: 400,
                cropping: allowCrop,
                mediaType: mediaType,
              })
                .then(media => {
                  onPicker(handleMediaResponse(media))
                  useVisible(!isVisible)
                })
                .catch(err => console.log(err))
            }}
            style={styles.button}
            children={
              <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                <FastImage style={styles.icon} source={R.images.ic_camera} />
                <Text style={{ ...fonts.regular15 }}>Mở Camera</Text>
              </View>
            }
          />
          <View style={styles.line} />
          <TouchableOpacity
            onPress={() => {
              Picker.openPicker({
                multiple: multiply,
                cropping: allowCrop,
                mediaType: mediaType,
                maxFiles: maxFiles,
              })
                .then(media => {
                  onPicker(handleMediaResponse(media))
                  useVisible(!isVisible)
                })
                .catch(err => console.log(err))
            }}
            style={styles.button}
            children={
              <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                <FastImage style={styles.icon} source={R.images.ic_image} />
                <Text style={{ ...fonts.regular15 }}>Chọn từ thư viện</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 114,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: 'center',
  },
  view1: {
    width: '100%',
    height: 110,
    alignItems: 'center',
  },
  view2: {
    width: '100%',
  },
  button: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED4DA',
    marginHorizontal: 20,
  },
})

const MediaPickerModal = memo(MediaPickerComponent)

export default MediaPickerModal
