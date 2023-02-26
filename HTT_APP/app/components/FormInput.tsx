import React, { memo, forwardRef, LegacyRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  ImageRequireSource,
  TextStyle,
} from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import isEqual from 'react-fast-compare'
import * as Animatable from 'react-native-animatable'
import { FormikErrors } from 'formik'

interface FormInputProps extends TextInputProps {
  label?: string
  labelStyle?: TextStyle
  renderLabel?: React.ReactNode
  placeholder?: string
  selectedText?: string
  clickable?: boolean
  onPress?: () => void
  leftIcon?: ImageRequireSource
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  rightIcon?: ImageRequireSource
  showRightIcon?: boolean
  show?: boolean
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[]
  renderRightIcon?: React.ReactNode
  require?: boolean
  disableEdit?: boolean
}

const FormInputComponent = forwardRef(
  (props: FormInputProps, ref: LegacyRef<TextInput>) => {
    const {
      label,
      placeholder,
      labelStyle,
      renderLabel,
      clickable = false,
      onPress,
      leftIcon,
      selectedText,
      rightIcon = R.images.ic_down,
      showRightIcon,
      renderRightIcon,
      error,
      require,
      disableEdit,
      ...inputProps
    } = props

    const clickableView =
      !!selectedText && selectedText.length > 0 ? (
        <Text
          style={{
            ...fonts.regular16,
            color: colors.black,
          }}
          children={selectedText}
        />
      ) : (
        <Text
          style={{
            ...fonts.regular16,
            color: '#8C8C8C',
          }}
          children={placeholder}
        />
      )

    const renderFormInputView = () => {
      return (
        <>
          <View
            style={{
              paddingBottom: 7,
              borderBottomWidth: 1,
              borderColor: '#BFBFBF',
              marginBottom: 16,
            }}
          >
            {!!label && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    {
                      ...fonts.regular16,
                      marginBottom: 7,
                      color: disableEdit ? '#8C8C8C' : undefined,
                    },
                    labelStyle,
                  ]}
                  children={label}
                />
                {require ? (
                  <Text style={{ color: 'red' }} children={'*'} />
                ) : null}
              </View>
            )}
            {React.isValidElement(renderLabel) && renderLabel}

            <View
              style={{
                ...styleView.rowItemBetween,
                paddingLeft: clickable ? 12 : 0,
                alignItems: 'center',
              }}
            >
              {!!leftIcon && (
                <FastImage
                  style={{ width: 20, height: 20 }}
                  resizeMode={'contain'}
                  source={leftIcon}
                />
              )}
              {!clickable ? (
                <TextInput
                  editable={!disableEdit}
                  {...inputProps}
                  ref={ref}
                  style={{
                    ...fonts.regular16,
                    color: disableEdit ? '#8C8C8C' : colors.black,
                    height: 26,
                    paddingHorizontal: 12,
                    paddingTop: 0,
                    paddingBottom: 0,
                    flex: 1,
                  }}
                  placeholder={placeholder}
                  placeholderTextColor="#8C8C8C"
                />
              ) : (
                clickableView
              )}

              {renderRightIcon}
              {showRightIcon && (
                <FastImage
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 5,
                  }}
                  source={rightIcon}
                />
              )}
            </View>
          </View>
          {!!error && (
            <Animatable.Text
              animation="fadeIn"
              style={{
                ...fonts.regular16,
                color: 'red',
                marginTop: -7,
                marginBottom: 10,
              }}
              children={error}
            />
          )}
        </>
      )
    }

    return !!onPress ? (
      <Button onPress={onPress} children={renderFormInputView()} />
    ) : (
      renderFormInputView()
    )
  }
)

const FormInput = memo(FormInputComponent, isEqual)

export default FormInput
