import { StyleProp, ViewStyle } from 'react-native'
export interface ButtonProps {
  title?: string
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
  styleText?: StyleProp<ViewStyle>
  icon?: JSX.Element
  disabled?: boolean
  onPress: () => void
  children?: any
  textStyle?: any
  activeOpacity?: number
}
