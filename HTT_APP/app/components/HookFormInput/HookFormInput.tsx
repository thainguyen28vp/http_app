import { colors, fonts } from '@app/theme'
import { formatPrice } from '@app/utils/FuncHelper'
import React, { memo, useContext } from 'react'
import { Controller } from 'react-hook-form'
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import reactotron from 'reactotron-react-native'
import { DebounceButton } from '../Button/Button'
import FstImage from '../FstImage/FstImage'
import { HookFormInputProps } from './HookFormInput.props'
const isEqual = require('react-fast-compare')
const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  line: {
    height: Platform.OS == 'ios' ? 0.5 : 0.75,
    // backgroundColor: colors.line.primary,
    backgroundColor: 'black',
    marginTop: Platform.OS == 'ios' ? 4 : -5,
  },
  iconRight: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  container: {
    marginTop: 12,
  },
  unit: {
    color: '#8D8C8C',
    //...fonts.regular14,
  },
  containerInput: {
    flexDirection: 'row',
    // borderColor: colors.focus,
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  input: {
    //...fonts.regular16,
    fontSize: 16,
    paddingTop: Platform.OS == 'ios' ? 8 : 4,
    flex: 1,
    paddingLeft: 8,
  },
  label: {
    //...fonts.regular16,
    // color: '#707070'
  },
  multiline: {
    minHeight: 82,
    maxHeight: 168,
    textAlignVertical: 'top',
    borderWidth: 0.5,
    // borderColor: colors.borderB,
    borderRadius: 5,
    marginTop: 5,
  },
  require: {
    //...fonts.regular14,
  },
  errorText: {
    //...fonts.regular13,
    // color: colors.error.primary,
    marginTop: 4,
    marginLeft: 6,
  },
  leftIcon: {
    width: 29,
    height: 20,
    resizeMode: 'contain',
  },
  centerIcon: {
    position: 'absolute',
    top: 10,
    right: width / 2 - 20,
  },
  disable: {
    backgroundColor: '#ECECEC',
  },
})

const HookFormInputComponent = ({
  label,
  defaultValue,
  isFocus,
  // onBlur,
  secureTextEntry,
  placeholder,
  isRequired,
  multiline,
  disabled,
  maxLength = 100,
  autoCapitalize = 'none',
  keyboardType = 'default',
  containerInputStyle,
  onSubmitEditing,
  containerStyle,
  lineHidden = false,
  labelStyle,
  rightIcon,
  onPressRightIcon,
  rightIconStyle,
  lineStyle,
  inputStyle,
  multilineStyle,
  inputKey,
  rules,
  control,
  error,
  inputRef,
  isPrice,
  onFocus,
}: HookFormInputProps) => {
  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.label, labelStyle]}>
          {label}
          {isRequired && (
            <Text
              style={[
                styles.require,
                // { color: theme.colors.error.dark }
              ]}
            >
              *
            </Text>
          )}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <View
              style={[
                styles.containerInput,
                disabled ? styles.disable : {},
                containerInputStyle,
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  multiline ? styles.multiline : {},
                  inputStyle,
                  multilineStyle,
                ]}
                ref={inputRef}
                autoFocus={isFocus}
                editable={!disabled}
                multiline={multiline}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                placeholderTextColor="#707070"
                blurOnSubmit={false}
                maxLength={maxLength}
                onBlur={onBlur}
                onFocus={onFocus}
                value={isPrice ? formatPrice(value) : value}
                onChangeText={onChange}
                onSubmitEditing={onSubmitEditing}
              />
              {!!rightIcon && (
                <DebounceButton
                  disabled={!onPressRightIcon}
                  onPress={onPressRightIcon}
                  children={
                    <FstImage
                      source={rightIcon}
                      style={[styles.iconRight, rightIconStyle]}
                    />
                  }
                />
              )}
            </View>
          )}
          name={inputKey}
          rules={rules}
          defaultValue={defaultValue}
        />
        {!lineHidden && <View style={[styles.line, lineStyle]} />}
        {error && <Text style={[styles.errorText]}>{error}</Text>}
      </View>
    </>
  )
}
export const HookFormInput = memo(HookFormInputComponent, isEqual)
