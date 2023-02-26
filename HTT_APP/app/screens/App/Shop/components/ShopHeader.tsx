import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, styleView } from '@app/theme'
import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper'
import ShopSearchBar from './ShopSearchBar'

interface ShopHeaderProps {
  placeholder: string
  onSearch: (text: string) => void
  goBack?: () => void
}

const ShopHeader = ({ placeholder, onSearch, goBack }: ShopHeaderProps) => {
  return (
    <View
      style={{
        height: (isIphoneX() ? 55 : 50) + getStatusBarHeight(),
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        flexDirection: 'column-reverse',
      }}
    >
      <View
        style={{
          ...styleView.rowItem,
          alignItems: 'center',
          width: '100%',
          marginBottom: 5,
        }}
      >
        <Button
          onPress={() => {
            !goBack ? NavigationUtil.goBack() : goBack()
          }}
          children={
            <FastImage
              style={{ width: 24, height: 24, marginRight: 8 }}
              source={R.images.icon_arrow_left}
            />
          }
        />
        <ShopSearchBar
          placeholder={placeholder}
          onSearch={text => onSearch(text)}
        />
      </View>
    </View>
  )
}

export default ShopHeader
