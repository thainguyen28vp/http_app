import { colors, fonts } from '@app/theme'
import UIHelper from '@app/utils/UIHelper'
import debounce from 'lodash.debounce'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { ButtonProps } from './Button.props'

const styles = StyleSheet.create({
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 8,
  },
  txtTitle: {
    // ...fonts.regular16,
    color: 'white',
  },
  loading: { position: 'absolute', top: 12, right: 10 },
})

export const DebounceButton = React.memo(
  ({ onPress, ...props }: ButtonProps & TouchableWithoutFeedbackProps) => {
    const scale = new Animated.Value(1)
    const debouncedOnPress = () => {
      onPress && onPress()
    }

    const onPressAction = debounce(debouncedOnPress, 300, {
      leading: true,
      trailing: false,
    })

    return (
      <TouchableOpacity
        {...props}
        onPress={onPressAction}
        onPressIn={() => {
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }}
        onPressOut={() => {
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }}
        children={
          <Animated.View style={{ transform: [{ scale }] }}>
            {props.children}
          </Animated.View>
        }
      />
    )
  }
)

export const Button = React.memo(
  ({ onPress, ...props }: ButtonProps & TouchableWithoutFeedbackProps) => {
    const scale = new Animated.Value(1)
    const debouncedOnPress = () => {
      onPress && onPress()
    }

    const onPressAction = debounce(debouncedOnPress, 300, {
      leading: true,
      trailing: false,
    })

    return (
      <TouchableOpacity
        {...props}
        activeOpacity={props.activeOpacity}
        onPress={onPressAction}
        onPressIn={() => {
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }}
        onPressOut={() => {
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }}
        children={
          <Animated.View style={{ transform: [{ scale }] }}>
            {props.children}
          </Animated.View>
        }
      />
    )
  }
)

export const ButtonPrimary = React.memo(
  ({
    onPress,
    title,
    style,
    isLoading,
    disabled,
    ...props
  }: ButtonProps & TouchableWithoutFeedbackProps) => {
    return (
      <DebounceButton
        {...props}
        style={[styles.btnPrimary, style]}
        onPress={onPress}
        disabled={isLoading || disabled}
        children={
          <>
            <Text style={[styles.txtTitle]} children={title} />
            {isLoading && (
              <ActivityIndicator color="white" style={styles.loading} />
            )}
          </>
        }
      />
    )
  }
)
