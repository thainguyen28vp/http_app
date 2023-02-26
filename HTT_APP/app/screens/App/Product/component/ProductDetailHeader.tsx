import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts, styleView } from '@app/theme'
import { checkExistUser } from '@app/utils/FuncHelper'
import React from 'react'
import { View, Text, Animated, StyleSheet, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper'
import CartButton from '../../Home/component/CartButton'

interface HeaderProps {
  headerBgColor: any
  headerTitleColor: any
  headerBtnColor: any
  title?: string
  isLike: boolean
  onLikeClick: (current: boolean) => void
}

const ProductDetailHeader = (props: HeaderProps) => {
  const {
    headerBgColor,
    headerBtnColor,
    headerTitleColor,
    title,
    isLike,
    onLikeClick,
  } = props

  return (
    <Animated.View style={[styles.header, { backgroundColor: headerBgColor }]}>
      <View
        style={{
          ...styleView.rowItemBetween,
          width: '100%',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Button
          onPress={() => NavigationUtil.goBack()}
          children={
            <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
              <Animated.View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: headerBtnColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FastImage
                  source={R.images.icon_arrow_left}
                  style={{ width: 24, height: 24 }}
                  tintColor={colors.black}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                style={{
                  ...fonts.medium18,
                  marginLeft: 10,
                  opacity: headerTitleColor,
                }}
                children={
                  !!title
                    ? `${
                        title.length >= 17
                          ? `${title.substring(0, 17)}...`
                          : title
                      }`
                    : ''
                }
              />
            </View>
          }
        />
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <Button
            // style={styles.buttonHeader}
            children={
              <Animated.View
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: headerBtnColor,
                  borderRadius: 18,
                  ...styleView.centerItem,
                }}
                children={<CartButton />}
              />
            }
            onPress={() => {
              checkExistUser(async () => {
                NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
              })
            }}
          />
          {/* <Button
            children={
              <Animated.View
                style={{
                  ...styleView.centerItem,
                  width: 36,
                  height: 36,
                  backgroundColor: headerBtnColor,
                  borderRadius: 18,
                  marginLeft: 12,
                }}
                children={
                  <FastImage
                    style={{ width: 24, height: 24 }}
                    source={
                      isLike ? R.images.icon_heart_red : R.images.icon_heart
                    }
                  />
                }
              />
            }
            onPress={() => onLikeClick(isLike)}
          /> */}
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    ...styleView.rowItemBetween,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
    top: 0,
    height:
      getStatusBarHeight() +
      (Platform.OS == 'android' ? 50 : !isIphoneX() ? 55 : 60),
    zIndex: 1,
  },
  buttonHeader: {
    width: 36,
    height: 36,
    backgroundColor: '#ECEBED',
    borderRadius: 16,
    ...styleView.centerItem,
  },
})

export default ProductDetailHeader
