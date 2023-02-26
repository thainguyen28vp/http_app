import { colors, fonts } from '@app/theme'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native'

interface Props {
  title: string
  onPress: () => void
  isCheck: boolean
  style?: StyleProp<ViewStyle>
}

const RadioButton = ({ title, isCheck, style, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[style, { flexDirection: 'row', alignItems: 'center' }]}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 20 / 2,
          borderWidth: 1.5,
          borderColor: isCheck ? colors.primary : '#BFBFBF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isCheck && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 12 / 2,
              backgroundColor: colors.primary,
            }}
          />
        )}
      </View>
      <Text
        style={{ ...fonts.regular16, marginLeft: 10, color: '#373E50' }}
        children={title}
      />
    </TouchableOpacity>
  )
}

export default RadioButton

const styles = StyleSheet.create({})
