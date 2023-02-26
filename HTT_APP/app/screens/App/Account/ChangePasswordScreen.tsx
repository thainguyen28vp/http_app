import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import FormInput from '@app/components/FormInput'
import R from '@app/assets/R'
import { fonts, styleView, colors } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import * as Yup from 'yup'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestChangePassword } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import FastImage from 'react-native-fast-image'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'

type PasswordPayload = {
  oldPass: string
  newPass: string
  verify: string
}

const changePassSchema = Yup.object().shape({
  oldPass: Yup.string().required('Không được bỏ trống'),
  newPass: Yup.string()
    .required('Không được bỏ trống')
    .notOneOf([Yup.ref('oldPass')], 'Không được trùng với mật khẩu hiện tại')
    .min(6, 'Không được ít hơn 6 ký tự')
    .max(20, 'Không được quá 21 ký tự'),
  verify: Yup.string()
    .required('Không được bỏ trống')
    .oneOf([Yup.ref('newPass')], 'Không trùng khớp'),
})

const ChangePasswordScreen = () => {
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [formSecureText, setFormSecureText] = useState({
    current: true,
    new: true,
    verify: true,
  })

  const handleOnSubmit = (data: PasswordPayload) => {
    const payload = {
      current_password: data.oldPass,
      new_password: data.newPass,
    }

    callAPIHook({
      API: requestChangePassword,
      payload,
      useLoading: setDialogLoading,
      onSuccess: res => {
        showMessages(
          '',
          'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
          async () => {
            await AsyncStorageService.clear()
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          }
        )
      },
    })
  }

  return (
    <ScreenWrapper
      back
      unsafe
      dialogLoading={dialogLoading}
      titleHeader={'Đổi mật khẩu'}
    >
      <Formik
        initialValues={{ oldPass: '', newPass: '', verify: '' }}
        validationSchema={changePassSchema}
        onSubmit={handleOnSubmit}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <FormInput
              value={values.oldPass}
              label={'Mật khẩu hiện tại'}
              placeholder={'Mật khẩu hiện tại'}
              secureTextEntry={formSecureText.current}
              onChangeText={handleChange('oldPass')}
              onBlur={handleBlur('oldPass')}
              error={
                errors.oldPass && touched.oldPass ? errors.oldPass : undefined
              }
              renderRightIcon={
                <Button
                  onPress={() =>
                    setFormSecureText(prev => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  children={
                    <FastImage
                      style={{ width: 20, height: 20 }}
                      source={
                        formSecureText.current
                          ? R.images.ic_eye_close
                          : R.images.ic_eye
                      }
                    />
                  }
                />
              }
            />
            <FormInput
              value={values.newPass}
              label={'Mật khẩu mới'}
              placeholder={'Mật khẩu mới'}
              secureTextEntry={formSecureText.new}
              onChangeText={handleChange('newPass')}
              onBlur={handleBlur('newPass')}
              error={
                errors.newPass && touched.newPass ? errors.newPass : undefined
              }
              renderRightIcon={
                <Button
                  onPress={() =>
                    setFormSecureText(prev => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  children={
                    <FastImage
                      style={{ width: 20, height: 20 }}
                      source={
                        formSecureText.new
                          ? R.images.ic_eye_close
                          : R.images.ic_eye
                      }
                    />
                  }
                />
              }
            />
            <FormInput
              value={values.verify}
              label={'Xác nhận mật khẩu'}
              placeholder={'Xác nhận mật khẩu'}
              secureTextEntry={formSecureText.verify}
              onChangeText={handleChange('verify')}
              onBlur={handleBlur('verify')}
              error={
                errors.verify && touched.verify ? errors.verify : undefined
              }
              renderRightIcon={
                <Button
                  onPress={() =>
                    setFormSecureText(prev => ({
                      ...prev,
                      verify: !prev.verify,
                    }))
                  }
                  children={
                    <FastImage
                      style={{ width: 20, height: 20 }}
                      source={
                        formSecureText.verify
                          ? R.images.ic_eye_close
                          : R.images.ic_eye
                      }
                    />
                  }
                />
              }
            />
            <Button
              style={[styles.button]}
              children={
                <Text style={{ ...fonts.semi_bold16, color: colors.white }}>
                  {'Cập nhật'}
                </Text>
              }
              onPress={handleSubmit}
            />
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 2,
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  button: {
    ...styleView.centerItem,
    width: '100%',
    height: 45,
    marginVertical: 30,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
})

export default ChangePasswordScreen
