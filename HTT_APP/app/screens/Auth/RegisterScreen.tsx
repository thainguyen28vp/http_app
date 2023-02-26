import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { mailPattern, phonePattern } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import ImagePickerHelper from '@app/utils/ImagePickerHelper'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, TextStyle, View } from 'react-native'
import { Accessory, Avatar } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import OneSignal from 'react-native-onesignal'
import reactotron from 'ReactotronConfig'
import * as Yup from 'yup'
import { requestRegister } from './AuthApi'
import ListShopFollow from './components/ListShopFollow'

const { width } = Dimensions.get('window')
const scale = width / 375

interface FormValue {
  name: string
  phone: string
  email: string
  code: string
  password: string
  confirm_password: string
  avatar: string
}

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const {
  icon_name,
  icon_phone,
  icon_email,
  icon_lock,
  icon_show_password,
  icon_users,
  icon_camera_avatar,
  icon_message,
  ic_eye,
  ic_eye_close,
} = R.images

const {
  full_name,
  referral_code,
  phone,
  email,
  password,
  re_password,
  type_name,
  type_code,
  type_phone,
  type_email,
  type_pass,
  type_re_pass,
  register,
} = R.strings()

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vui lòng nhập họ tên!')
    .max(51, 'Họ tên không được vượt quá 50 ký tự')
    .min(3, 'Họ tên quá ngắn')
    .trim(),

  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại!')
    .matches(phonePattern, 'Số điện thoại không hợp lệ!'),
  referral_code: Yup.string().matches(
    phonePattern,
    'Mã giới thiệu không hợp lệ!'
  ),
  email: Yup.string()
    .max(120, 'Email không được vượt 120 ký tự')
    .matches(mailPattern, 'Email không hợp lệ'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu!')
    .min(6, 'Không được ít hơn 6 ký tự')
    .max(20, 'Không được quá 21 ký tự'),
  confirmPass: Yup.string()
    .required('Vui lòng nhập xác nhận mật khẩu!')
    .oneOf([Yup.ref('password')], 'Không khớp mật khẩu!'),
  profileImgUrl: Yup.string(),
})

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

const RegisterScreen = (props: any) => {
  const [dialogLoading, setDialogLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [device_id, setDevice_id] = useState<string>()
  const [arrIDShop, setArrIDShop] = useState<Array<Number>>([])

  const [securePass, setSecurePass] = useState({
    pass: true,
    rePass: true,
  })

  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    console.log('deviceID', deviceState.userId)
    setDevice_id(deviceState?.userId)
  }
  useEffect(() => {
    getDeviceID()
  }, [])

  const onRegister = (data: any) => {
    const payload = {
      code: data.referral_code,
      name: data.name,
      gender: 'man',
      birthDate: '1990-10-16',
      contactNumber: data.phone,
      address: 'Hà Nội',
      kiotviet_id: 1,
      password: data.password,
    }
    callAPIHook({
      API: requestRegister,
      payload,
      useLoading: setDialogLoading,
      onSuccess: res => {
        AsyncStorageService.putToken(res.data.token)
        showMessages('', 'Đăng ký tài khoản thành công', () => {
          NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
        })
      },
      onError: err => {
        console.log(err)
      },
    })
    // NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LIST_SHOP_FOLLOW, {
    //   data,
    //   device_id,
    //   avatarUrl,
    // })
  }

  return (
    <ScreenWrapper
      unsafe
      back
      titleHeader={'Thông tin đăng ký'}
      color="black"
      backgroundHeader={'white'}
      backgroundColor="white"
      scroll
      dialogLoading={dialogLoading}
    >
      <Formik
        initialValues={{
          name: '',
          referral_code: '',
          phone: '',
          email: '',
          password: '',
          confirmPass: '',
          profileImgUrl: '',
        }}
        validationSchema={registerSchema}
        onSubmit={onRegister}
        validateOnBlur={false}
        validateOnChange={true}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <Avatar
              size={120}
              rounded
              source={
                !!avatarUrl ? { uri: avatarUrl } : R.images.img_user_empty
              }
              containerStyle={{
                backgroundColor: '#DBDDDF',
                alignSelf: 'center',
                marginVertical: 15,
              }}
              children={
                <Accessory
                  size={20}
                  source={icon_camera_avatar}
                  style={styles.accessory}
                  onPress={() => {
                    ImagePickerHelper((res: string) => setAvatarUrl(res))
                  }}
                />
              }
            />
            <FormInput
              renderLabel={<LabelInput text={full_name} required />}
              containerStyle={styles.inputContainer}
              placeholder={type_name}
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholderTextColor="#8C8C8C"
              leftIcon={icon_name}
              error={errors.name && touched.name ? errors.name : undefined}
            />
            <FormInput
              renderLabel={<LabelInput text={phone} required />}
              containerStyle={styles.inputContainer}
              leftIcon={icon_phone}
              value={values.phone.trim()}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              placeholder={type_phone}
              placeholderTextColor="#8C8C8C"
              keyboardType="numeric"
              error={errors.phone && touched.phone ? errors.phone : undefined}
            />
            <FormInput
              renderLabel={<LabelInput text={email} />}
              autoCapitalize={'none'}
              containerStyle={styles.inputContainer}
              leftIcon={icon_message}
              value={values.email.trim()}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder={type_email}
              placeholderTextColor="#8C8C8C"
              error={errors.email && touched.email ? errors.email : undefined}
            />
            <FormInput
              renderLabel={<LabelInput text={referral_code} />}
              containerStyle={styles.inputContainer}
              leftIcon={icon_users}
              value={values.referral_code}
              onChangeText={handleChange('referral_code')}
              onBlur={handleBlur('referral_code')}
              placeholder={type_code}
              keyboardType="numeric"
              placeholderTextColor="#8C8C8C"
              error={
                errors.referral_code && touched.referral_code
                  ? errors.referral_code
                  : undefined
              }
            />
            <FormInput
              renderLabel={<LabelInput text={password} required />}
              containerStyle={styles.inputContainer}
              leftIcon={icon_lock}
              value={values.password.trim()}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={securePass.pass}
              renderRightIcon={
                <Button
                  onPress={() => {
                    setSecurePass({
                      ...securePass,
                      pass: !securePass.pass,
                    })
                  }}
                  children={
                    <FastImage
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      resizeMode={'contain'}
                      tintColor={colors.focus}
                      source={!securePass.pass ? ic_eye : ic_eye_close}
                    />
                  }
                />
              }
              placeholder={type_pass}
              placeholderTextColor="#8C8C8C"
              error={
                errors.password && touched.password
                  ? errors.password
                  : undefined
              }
            />
            <FormInput
              renderLabel={<LabelInput text={re_password} required />}
              containerStyle={styles.inputContainer}
              leftIcon={icon_lock}
              value={values.confirmPass.trim()}
              onChangeText={handleChange('confirmPass')}
              onBlur={handleBlur('confirmPass')}
              secureTextEntry={securePass.rePass}
              renderRightIcon={
                <Button
                  onPress={() => {
                    setSecurePass({
                      ...securePass,
                      rePass: !securePass.rePass,
                    })
                  }}
                  children={
                    <FastImage
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      resizeMode={'contain'}
                      tintColor={colors.focus}
                      source={!securePass.rePass ? ic_eye : ic_eye_close}
                    />
                  }
                />
              }
              placeholder={type_re_pass}
              placeholderTextColor="#8C8C8C"
              error={
                errors.confirmPass && touched.confirmPass
                  ? errors.confirmPass
                  : undefined
              }
            />
            <Button
              style={[styles.button, { backgroundColor: colors.primary }]}
              children={
                <Text
                  style={{
                    fontSize: 16 * scale,
                    fontFamily: R.fonts.sf_semi_bold,
                    fontWeight: '500',
                    color: colors.white,
                  }}
                >
                  {'Tiếp theo'}
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
    paddingHorizontal: 20 * scale,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  labelInput: {
    ...fonts.regular16,
    fontWeight: '400',
    color: '#262626',
    marginBottom: 10 * scale,
  },
  iconStyle: {
    width: 16 * scale,
    height: 17 * scale,
    resizeMode: 'contain',
    marginRight: 13 * scale,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderColor: '#868E96',
    borderWidth: 1,
    marginRight: 8,
  },
  button: {
    // ...styleView.centerItem,
    width: '100%',
    height: 45,
    marginVertical: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessory: {
    backgroundColor: 'white',
    width: 32 * scale,
    height: 32 * scale,
    borderRadius: 15 * scale,
    shadowColor: 'white',
  },
})

export default RegisterScreen
