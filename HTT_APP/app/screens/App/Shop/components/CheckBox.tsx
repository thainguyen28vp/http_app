import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Button } from '@component/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
import FastImage, { ImageStyle } from 'react-native-fast-image'
import R from '@app/assets/R'

interface CheckBoxProps {
  fillColor?: string
  unfillColor?: string
  title?: string
  onPress?: () => void
  isCheck?: boolean
  containerStyle?: StyleProp<ViewStyle>
  checkImageStyle?: StyleProp<ImageStyle>
}

const CheckBox = (props: CheckBoxProps) => {
  const {
    fillColor = colors.primary,
    unfillColor = 'transparent',
    onPress,
    isCheck,
    containerStyle,
    checkImageStyle,
    title,
  } = props

  const checkBoxView = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={[
            styles.containerView,
            {
              backgroundColor: isCheck ? fillColor : unfillColor,
              borderColor: isCheck ? fillColor : '#BFBFBF',
            },
            containerStyle,
          ]}
        >
          {isCheck && (
            <FastImage
              style={[checkImageStyle, { width: 11, height: 9 }]}
              source={R.images.ic_pure_check}
            />
          )}
        </View>
        {title && <Text style={{ ...fonts.regular14 }} children={title} />}
      </View>
    )
  }

  return !!onPress ? (
    <Button onPress={onPress} children={checkBoxView()} />
  ) : (
    checkBoxView()
  )
}

const styles = StyleSheet.create({
  containerView: {
    ...styleView.centerItem,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BFBFBF',
  },
})

export default CheckBox
