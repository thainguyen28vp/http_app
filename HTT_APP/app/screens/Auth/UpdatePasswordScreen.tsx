import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { Text, TextStyle, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as Yup from 'yup'
import { requestUpdateNewPassword } from './AuthApi'
import styles from './styles/stylesForgotPass'
const forgotSchema = Yup.object().shape({
  code: Yup.string().required('Vui lòng nhập mã xác minh!'),
  newPassword: Yup.string().required('Vui lòng nhập mật khẩu!'),
  confirmPassword: Yup.string().required('Vui lòng nhập xác mật khẩu!'),
})

const { icon_message, icon_show_password } = R.images
interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}
const UpdatePasswordScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [securePass, setSecurePass] = useState({
    code: true,
    newPass: true,
    confirmPass: true,
  })
  const email = props.route.params.email

  const onSent = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      showMessages(
        R.strings().notification,
        'Xác nhận mật khẩu không khớp! Vui lòng thử lại.',
        () => {}
      )
      return
    }
    const payload = {
      password: data.newPassword,
      code: data.code,
      email,
    }
    callAPIHook({
      API: requestUpdateNewPassword,
      payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        showMessages(
          R.strings().notification,
          'Cập nhật mật khẩu thành công!',
          () => NavigationUtil.pop(2)
        )
      },
      onError: () => {},
    })
  }

  const LabelInput = ({ text, required, style }: labelProps) => {
    return required ? (
      <Text style={[styles.labelInput, style]}>
        {`${text} `}
        <Text style={{ color: 'red' }}>*</Text>
      </Text>
    ) : (
      <Text style={[styles.labelInput, style]}>{text}</Text>
    )
  }
  return (
    <ScreenWrapper titleHeader={'Tạo mật khẩu mới'} back>
      <Formik
        initialValues={{
          code: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={forgotSchema}
        onSubmit={onSent}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
        }) => (
          <View style={{ marginTop: '5%', paddingHorizontal: 20 }}>
            <FormInput
              renderLabel={<LabelInput text={'Mã xác minh'} required />}
              autoCapitalize={'none'}
              containerStyle={styles.inputContainer}
              leftIcon={icon_message}
              value={values.code?.trim()}
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              placeholder={'Nhập mã xác minh'}
              placeholderTextColor="#8C8C8C"
              error={
                errors.newPassword && touched.code ? errors.code : undefined
              }
              secureTextEntry={securePass.code}
              renderRightIcon={
                <Button
                  onPress={() => {
                    setSecurePass({
                      ...securePass,
                      code: !securePass.code,
                    })
                  }}
                  children={
                    <FastImage
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      resizeMode={'contain'}
                      tintColor={colors.focus}
                      source={
                        !securePass.code
                          ? icon_show_password
                          : icon_show_password
                      }
                    />
                  }
                />
              }
            />
            <FormInput
              renderLabel={<LabelInput text={'Mật khẩu mới'} required />}
              autoCapitalize={'none'}
              containerStyle={styles.inputContainer}
              leftIcon={icon_message}
              value={values.newPassword?.trim()}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              placeholder={'Nhập mật khẩu mới'}
              placeholderTextColor="#8C8C8C"
              error={
                errors.newPassword && touched.newPassword
                  ? errors.newPassword
                  : undefined
              }
              secureTextEntry={securePass.newPass}
              renderRightIcon={
                <Button
                  onPress={() => {
                    setSecurePass({
                      ...securePass,
                      newPass: !securePass.newPass,
                    })
                  }}
                  children={
                    <FastImage
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      resizeMode={'contain'}
                      tintColor={colors.focus}
                      source={
                        !securePass.newPass
                          ? icon_show_password
                          : icon_show_password
                      }
                    />
                  }
                />
              }
            />
            <FormInput
              renderLabel={<LabelInput text={'Xác nhận mật khẩu'} required />}
              autoCapitalize={'none'}
              containerStyle={styles.inputContainer}
              leftIcon={icon_message}
              value={values.confirmPassword?.trim()}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder={'Nhập mật khẩu'}
              placeholderTextColor="#8C8C8C"
              error={
                errors.confirmPassword && touched.confirmPassword
                  ? errors.confirmPassword
                  : undefined
              }
              secureTextEntry={securePass.confirmPass}
              renderRightIcon={
                <Button
                  onPress={() => {
                    setSecurePass({
                      ...securePass,
                      confirmPass: !securePass.confirmPass,
                    })
                  }}
                  children={
                    <FastImage
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      resizeMode={'contain'}
                      tintColor={colors.focus}
                      source={
                        !securePass.confirmPass
                          ? icon_show_password
                          : icon_show_password
                      }
                    />
                  }
                />
              }
            />
            <Button
              style={styles.btnRegister}
              children={
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: R.fonts.sf_semi_bold,
                    fontWeight: '500',
                    color: colors.white,
                  }}
                >
                  Gửi
                </Text>
              }
              onPress={handleSubmit}
            />
          </View>
        )}
      />
      {isLoading && <LoadingProgress />}
    </ScreenWrapper>
  )
}

export default UpdatePasswordScreen
