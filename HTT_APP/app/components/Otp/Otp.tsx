import React, { useState, useEffect, useMemo, memo } from 'react'
import { StyleSheet, TextInput, Text } from 'react-native'
import { OtpProps } from './Otp.props'
import { Block } from '../Block/Block'
import { enhance } from '@common'
import equals from 'react-fast-compare'
import { colors, fonts } from '@app/theme'

const WIDTH_OTP = 60
const HEIGHT_OTP = 60

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  otpView: {
    width: WIDTH_OTP,
    height: HEIGHT_OTP,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.colorDefault.border,
  },
  otpViewActive: {
    borderColor: colors.primary,
  },
  otpText: {
    ...fonts.regular14,
    color: 'red',
    textAlignVertical: 'bottom',
  },
  sizeBoxW15: {
    width: 15,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    width: '100%',
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    height: HEIGHT_OTP,
    backgroundColor: 'transparent',
    color: 'transparent',
    opacity: 0,
  },
})

const OtpComponent = (props: OtpProps) => {
  const {
    length,
    defaultOtp = '',
    onOtpValid,
    onOtpInValid,
    textEntry,
    wrapInputActiveStyle = {},
    wrapInputStyle = {},
    containerStyle = {},
    textStyle = {},
    ...rest
  } = props
  const [otp, setOtp] = useState('')
  const _onOtpChange = (text: string) => {
    const textTrim = text.trim().toString()
    if (textTrim.length <= length) {
      setOtp(text.trim().toString())
    }
  }
  useEffect(() => {
    if (defaultOtp) {
      setOtp(defaultOtp.length > length ? defaultOtp.slice(0, length) : defaultOtp)
    }
  }, [defaultOtp])
  useEffect(() => {
    if (otp.length === length) {
      onOtpValid && onOtpValid(otp)
    } else {
      onOtpInValid && onOtpInValid()
    }
  }, [otp])
  const container = useMemo(() => enhance([styles.wrap, styles.row, containerStyle]), [])
  const wrapInput = useMemo(() => enhance([styles.otpView, wrapInputStyle]), [])
  const wrapInputActive = useMemo(() => enhance([styles.otpViewActive, wrapInputActiveStyle]), [])
  const text = useMemo(() => enhance([styles.otpText, textStyle]), [])
  const sizeBoxW15 = useMemo(() => enhance([styles.sizeBoxW15]), [])
  const input = useMemo(() => enhance([styles.input]), [])
  const row = useMemo(() => enhance([styles.row]), [])

  return (
    <Block style={container}>
      {length &&
        Array(length)
          .fill(0)
          .map((item, index) => {
            return (
              <Block key={index} style={row}>
                <Block style={[wrapInput, index === otp.length && wrapInputActive]}>
                  <Text
                    children={
                      index <= otp.length - 1 ? textEntry?.charAt(0) ?? otp.charAt(index) : ''
                    }
                    style={text}
                  />
                </Block>
                <Block style={sizeBoxW15} />
              </Block>
            )
          })}
      <TextInput
        value={otp}
        autoCapitalize={'none'}
        autoFocus={false}
        underlineColorAndroid={'transparent'}
        onChangeText={_onOtpChange}
        selectionColor={'transparent'}
        style={input}
        {...rest}
      />
    </Block>
  )
}
export const Otp = memo(OtpComponent, equals)
