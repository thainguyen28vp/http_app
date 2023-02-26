import R from '@app/assets/R'
// import { SCREEN_ROUTER_APP } from '@app/constant/Constant'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts, styleView } from '@app/theme'
import React from 'react'
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native'
import { ImageRequireSource } from 'react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage, { ImageStyle } from 'react-native-fast-image'
import { getBottomSpace } from 'react-native-iphone-x-helper'

interface Props extends TouchableOpacityProps {
  action1: () => void
  action2: () => void
  action3: () => void
  url1: ImageRequireSource
  url2?: ImageRequireSource
  title: string
  img1Style?: ImageStyle
  img2Style?: ImageStyle
  style?: ViewStyle
  iphoneX?: boolean
  bg1?: string
  bg2?: string
  bg3?: string
  img1TintColor?: string
  img2TintColor?: string
  line?: boolean
  showAction2?: boolean
}

const ButtonFooter = (props: Props) => {
  const {
    action1,
    action2,
    action3,
    url1,
    url2,
    title,
    img1Style,
    img2Style,
    iphoneX,
    img1TintColor,
    img2TintColor,
    bg1,
    bg2,
    bg3,
    line,
    style,
    showAction2 = true,
    ...btnActionProps
  } = props
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          // height: 50,
        }}
      >
        <TouchableOpacity
          onPress={action1}
          style={{
            paddingVertical: 14,
            backgroundColor: bg1 || '#448795',
            flex: 0.5,
            alignItems: 'center',
            height: 50,
          }}
          {...btnActionProps}
          children={
            <FastImage
              source={url1}
              style={[{ width: 18, height: 18 }, img1Style]}
              tintColor={img1TintColor || colors.white}
            />
          }
        />
        {line && (
          <View
            style={{ width: 1, height: '60%', backgroundColor: '#CED4DA' }}
          />
        )}
        {showAction2 && (
          <TouchableOpacity
            onPress={action2}
            style={{
              paddingVertical: 14,
              backgroundColor: bg2 || '#BFBFBF',
              flex: 0.5,
              alignItems: 'center',
              height: 50,
            }}
            children={
              url2 ? (
                <FastImage
                  source={url2}
                  style={[{ width: 18, height: 18 }, img2Style]}
                  tintColor={img2TintColor || colors.white}
                />
              ) : (
                <Text
                  style={{ color: colors.white, ...fonts.semi_bold16 }}
                  children={'Huỷ'}
                />
              )
            }
          />
        )}
        <TouchableOpacity
          onPress={action3}
          style={{
            ...styleView.centerItem,
            paddingVertical: 14,
            backgroundColor: bg3 || colors.primary,
            flex: 1,
            height: 50,
          }}
          {...btnActionProps}
          children={
            <Text
              style={{ color: colors.white, ...fonts.semi_bold16 }}
              children={title}
            />
          }
        />
      </View>
      {iphoneX && (
        <View
          style={{
            width: '100%',
            height: getBottomSpace() - 15,
            backgroundColor: colors.white,
          }}
        />
      )}
    </View>
  )
}

export default ButtonFooter

const styles = StyleSheet.create({})
