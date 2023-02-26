import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
import React, { forwardRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'

interface Props {
  onSend: ({ content, img }: { content: string; img: any }) => void
  onCameraPress: () => void
  onClearAsset: () => void
  showTopStatus?: boolean
  imgInfor?: any
}

const InputToolbar = forwardRef<TextInput, Props>(
  ({ onSend, onCameraPress, showTopStatus, imgInfor, onClearAsset }, ref) => {
    const [textInput, setTextInput] = useState<string>('')
    const onSendMessage = () => {
      if (!!textInput.trim().length || !!imgInfor) {
        onSend({
          content: textInput.trim(),
          img: !!imgInfor ? imgInfor.path : undefined,
        })
        setTextInput('')
      }
    }

    return (
      <>
        {!!imgInfor && (
          <View style={styles.topStatus}>
            <View style={{ ...styleView.rowItem, flex: 1 }}>
              <FastImage
                style={{ width: 15, height: 15 }}
                source={R.images.ic_link}
                tintColor={'rgba(0,0,0,.5)'}
              />
              <Text
                style={{
                  marginLeft: 10,
                  flex: 1,
                  ...fonts.regular14,
                  color: 'rgba(0,0,0,.7)',
                }}
                numberOfLines={1}
                children={
                  imgInfor.filename ||
                  imgInfor.name ||
                  'image_' + imgInfor.modificationDate
                }
              />
            </View>
            <Button
              style={{ marginLeft: 5 }}
              onPress={onClearAsset}
              children={
                <FastImage
                  style={{ width: 20, height: 20 }}
                  source={R.images.ic_remove}
                />
              }
            />
          </View>
        )}
        <View
          style={{
            ...styleView.rowItem,
            backgroundColor: colors.white,
            width: '100%',
            height: 50 + (isIphoneX() ? 15 : 0),
            paddingHorizontal: 15,
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderTopWidth: 1,
          }}
        >
          <View
            style={{
              ...styleView.rowItem,
              flex: 1,
              height: 50,
              alignItems: 'center',
            }}
          >
            <TextInput
              ref={ref}
              value={textInput}
              style={{ ...fonts.regular16, flex: 1, paddingRight: 10 }}
              placeholder={'Nhập tin nhắn'}
              onChangeText={text => setTextInput(text)}
              clearButtonMode={'always'}
            />
            <View style={{ ...styleView.rowItem }}>
              <Button
                onPress={onCameraPress}
                children={
                  <FastImage
                    style={{ width: 24, height: 24, marginRight: 10 }}
                    source={R.images.ic_camera}
                  />
                }
              />
              <Button
                onPress={onSendMessage}
                children={
                  <FastImage
                    style={{ width: 24, height: 24 }}
                    source={R.images.img_chat_send}
                  />
                }
              />
            </View>
          </View>
        </View>
      </>
    )
  }
)

const styles = StyleSheet.create({
  topStatus: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.1)',
  },
})

export default InputToolbar
