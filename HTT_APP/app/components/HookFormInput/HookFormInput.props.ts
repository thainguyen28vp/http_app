import { LegacyRef } from 'react'
import { RegisterOptions } from 'react-hook-form'
import { ImageStyle, StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native'
export type ValidationMap<T = any, Keys extends keyof T = keyof T> = {
  [K in Keys]-?: RegisterOptions
}
export interface HookFormInputProps extends TextInputProps {
  label?: string
  value?: string
  isRequired?: boolean
  secureTextEntry?: boolean
  labelStyle?: TextStyle
  defaultValue?: string
  inputContainerStyle?: ViewStyle
  placeholder?: string
  inputStyle?: TextStyle
  inputBlockStyle?: ViewStyle
  lineHidden?: boolean
  multiline?: boolean
  rightIcon?: any
  // rightIcon?: Source | number;
  isFocus?: boolean
  disabled?: boolean
  style?: StyleProp<TextStyle>
  maxLength?: number
  autoCapitalize?: 'none' | 'characters' | 'words' | 'sentences'
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
  containerInputStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  errMsg?: string
  hideRequire?: boolean
  isRegistered?: boolean
  onSubmitEditing?: () => void
  onPressRightIcon?: () => void
  // onBlur?: () => void;
  rightIconStyle?: StyleProp<ImageStyle>
  lineStyle?: StyleProp<ViewStyle>
  multilineStyle?: StyleProp<ViewStyle>
  inputKey: string
  rules?: RegisterOptions
  componentRef?: LegacyRef<any>
  error?: string
  control: any
  inputRef?: any
  isPrice?: boolean
}
