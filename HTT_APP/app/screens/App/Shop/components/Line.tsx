import { WIDTH } from '@app/theme'
import React from 'react'
import { View } from 'react-native'
import { StyleProp, ViewStyle } from 'react-native'

interface LineProps {
  color?: string
  size?: number | string
  style?: StyleProp<ViewStyle>
}

const Line = (props: LineProps) => {
  const { color = '#F5F5F5', style, size = 1 } = props

  return (
    <View
      style={[{ backgroundColor: color, width: '100%', height: size }, style]}
    />
  )
}

export default Line
