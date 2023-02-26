import R from '@app/assets/R'
import * as theme from '@app/theme'
import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { Header } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import NavigationUtil from '../navigation/NavigationUtil'
import { colors, dimensions, fonts, OS } from '@app/theme'
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper'

interface Props {
  color?: string
  backgroundHeader?: string
  borderBottomHeader?: string
  back?: boolean
  onBack?: () => void
  /**
   * View nút phải
   */
  rightComponent?: React.ReactNode
  /**
   * View nút trái
   */
  leftComponent?: React.ReactNode
  /**
   * Title thanh header
   */
  titleHeader: string
}

interface BackProps {
  style?: ViewStyle
  onBack?: () => void
}

export class BackButton extends Component<BackProps> {
  render() {
    const { style, onBack } = this.props
    return (
      <TouchableOpacity
        style={[style || styles.leftComp]}
        onPress={onBack || NavigationUtil.goBack}
      >
        <FastImage
          source={R.images.icon_arrow_left}
          style={{ marginLeft: 10, width: 24, height: 24 }}
          tintColor={theme.colors.black}
          resizeMode="contain"
        />
      </TouchableOpacity>
    )
  }
}

export default class RNHeader extends Component<Props> {
  render() {
    const {
      color,
      back,
      onBack,
      titleHeader,
      rightComponent,
      leftComponent,
      borderBottomHeader,
      backgroundHeader,
    } = this.props
    return (
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: backgroundHeader || 'white',
          height:
            OS == 'ios'
              ? (isIphoneX() ? 60 : 54) + getStatusBarHeight()
              : undefined,
          borderBottomColor: borderBottomHeader,
          paddingBottom: 5,
        }}
        centerContainerStyle={{
          justifyContent: 'center',
          height: !titleHeader ? 0 : 40,
        }}
        leftContainerStyle={{ justifyContent: 'center' }}
        rightContainerStyle={{ justifyContent: 'center' }}
        leftComponent={back ? <BackButton onBack={onBack} /> : leftComponent}
        centerComponent={
          <Text
            numberOfLines={1}
            style={[
              {
                ...fonts.semi_bold17,
              },
              { color: color || colors.colorDefault.text },
            ]}
          >
            {titleHeader}
          </Text>
        }
        rightComponent={rightComponent}
        statusBarProps={{
          barStyle: 'dark-content',
          translucent: true,
          backgroundColor: 'transparent',
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  leftComp: {
    // height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightComp: {
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
})
