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
import FstImage from '@app/components/FstImage/FstImage'
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'rn-material-ui-textfield'
import { MaterialInputProps } from './MaterialInutProps'
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
    // backgroundColor: 'red',
  },
  outlinedInputStyle: {
    marginBottom: -13,
    marginTop: 9,
    // backgroundColor:'red',
    width: '100%',
  },
  outlinedContainerStyle: {
    borderRadius: 25,
    // borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F1F3F5',
  },
})

const MaterialInputComponent = ({
  label,
  defaultValue,
  isFocus,
  onBlur,
  secureTextEntry,
  multiline,
  disabled,
  maxLength = 100,
  autoCapitalize = 'none',
  keyboardType = 'default',
  onSubmitEditing,
  containerStyle,
  inputKey,
  rules,
  control,
  error,
  inputRef,
  isPrice,
  onFocus,
  value,
  labelFontSize = 13,
  fontSize = 16,
  outlinedInputStyle,
  labelTextStyle,
  isRequired,
  leftIcon,
  onChangeText,
}: MaterialInputProps) => {
  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Controller
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <View style={styles.outlinedContainerStyle}>
              {!!leftIcon && (
                <FstImage
                  source={leftIcon}
                  style={{ width: 20, height: 20, marginLeft: 10 }}
                  resizeMode={'contain'}
                />
              )}
              <OutlinedTextField
                tintColor={colors.primary}
                labelTextStyle={labelTextStyle}
                containerStyle={[styles.outlinedInputStyle, outlinedInputStyle]}
                activeLineWidth={0}
                disabledLineWidth={0}
                lineWidth={0}
                labelFontSize={labelFontSize}
                fontSize={fontSize}
                contentInset={{ label: -9 }}
                label={label}
                isRequired={isRequired}
                ref={inputRef}
                autoFocus={isFocus}
                editable={!disabled}
                multiline={multiline}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                blurOnSubmit={false}
                maxLength={maxLength}
                onBlur={onBlur}
                onFocus={onFocus}
                value={isPrice ? formatPrice(value) : value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
              />
            </View>
          )}
          name={inputKey}
          rules={rules}
          defaultValue={defaultValue}
        />
        {error && <Text style={[styles.errorText]}>{error}</Text>}
      </View>
    </>
  )
}
export const MaterialInput = memo(MaterialInputComponent, isEqual)
