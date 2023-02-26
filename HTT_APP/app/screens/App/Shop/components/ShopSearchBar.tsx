import R from '@app/assets/R'
import { fonts, styleView } from '@app/theme'
import _ from 'lodash'
import { debounce } from 'lodash'
import React, { forwardRef, useEffect, useState } from 'react'
import { View, TextInputProps, ViewStyle, TextStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TextInput } from 'react-native-gesture-handler'

interface SearchBarProps extends TextInputProps {
  outline?: boolean
  onSearch: (text: string) => void
  containerStyle?: ViewStyle
}

const ShopSearchBar = forwardRef<TextInput, SearchBarProps>((props, ref) => {
  const { onSearch, outline = true, containerStyle, ...inputProps } = props

  const inputSearchView = (
    <TextInput
      ref={ref}
      style={{ flex: 1, ...fonts.regular14 }}
      placeholderTextColor={'#8C8C8C'}
      onChangeText={_.debounce(text => onSearch(text), 300)}
      {...inputProps}
    />
  )

  return (
    <View
      style={[
        {
          ...styleView.rowItem,
          alignItems: 'center',
          flex: 1,
          height: 40,
          borderWidth: outline ? 1 : 0,
          borderColor: '#D0DBEA',
          borderRadius: 50,
          paddingHorizontal: 12,
        },
        containerStyle,
      ]}
    >
      <FastImage
        style={{ width: 24, height: 24, marginRight: 8 }}
        source={R.images.ic_search}
      />
      {inputSearchView}
    </View>
  )
})

export default ShopSearchBar
