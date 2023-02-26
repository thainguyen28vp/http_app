import { colors, fonts, styleView } from '@app/theme'
import React from 'react'
import { ViewStyle } from 'react-native'
import {
  TextInput,
  StyleProp,
  TextStyle,
  TextInputProps,
  Platform,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'
import NumberFormat from 'react-number-format'

interface CurrenyFormProps extends TextInputProps {
  value: string
  prefix?: string
  inputStyle?: StyleProp<TextStyle>
  style?: ViewStyle
  showSuffix?: boolean
}

const CurrencyForm = (props: CurrenyFormProps) => {
  const {
    value,
    onChangeText,
    prefix,
    inputStyle,
    style,
    showSuffix = false,
    ...inputProps
  } = props

  return (
    <View
      style={[
        style,
        showSuffix ? { ...styleView.rowItem, alignItems: 'center' } : undefined,
      ]}
    >
      <NumberFormat
        value={value}
        displayType={'text'}
        thousandSeparator={true}
        prefix={prefix}
        renderText={text => (
          <TextInput
            style={[
              {
                paddingVertical: 0,
                flex: 1,
                color: colors.black,
                textAlign: 'center',
                paddingHorizontal: 5,
                ...fonts.regular16,
                // height: 30,
              },
              inputStyle,
            ]}
            value={text}
            onChangeText={onChangeText}
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
            {...inputProps}
          />
        )}
      />
      {showSuffix && (
        <Text
          style={{
            color: '#69747E',
            ...fonts.regular16,
            marginRight: 5,
          }}
          children={'đ'}
        />
      )}
    </View>
  )
}

export default CurrencyForm
