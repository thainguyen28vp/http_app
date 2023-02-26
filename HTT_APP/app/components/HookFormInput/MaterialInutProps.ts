import { RegisterOptions } from 'react-hook-form'
import {
    TextInputProps, TextStyle, ViewStyle
} from 'react-native'
export type ValidationMap<T = any, Keys extends keyof T = keyof T> = {
  [K in Keys]-?: RegisterOptions
}
export interface MaterialInputProps extends TextInputProps {
  leftIcon?: any
    label?:string,
    defaultValue?:string,
    isFocus?:boolean,
    onBlur?:() => void,
    secureTextEntry?:boolean,
    isRequired?:boolean,
    multiline?: boolean,
    disabled?:boolean,
    maxLength?: number,
    autoCapitalize?: 'none' | 'characters' | 'words' | 'sentences'
    keyboardType?:
      | 'default'
      | 'number-pad'
      | 'decimal-pad'
      | 'numeric'
      | 'email-address'
      | 'phone-pad'
    onSubmitEditing?:() => void,,
    containerStyle?:ViewStyle,
    inputKey:string,
    rules?: RegisterOptions,
    control:any,
    error?:string,
    inputRef?:any,
    isPrice?:boolean,
    onFocus?:() => void,
    labelFontSize?:number,
    fontSize?:number,
    outlinedInputStyle?:ViewStyle,
    labelTextStyle?:TextStyle,
}
