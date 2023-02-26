import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import RNHeader from '@app/components/RNHeader'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { Formik } from 'formik'
import React, { useState } from 'react'
import {
  Image, KeyboardAvoidingView,
  Platform, StatusBar, Text, TextStyle, TouchableOpacity, View
} from 'react-native'
import Modal from 'react-native-modal'
import * as Yup from 'yup'
import { requestResetPassword } from './AuthApi'
import styles from './styles/stylesForgotPass'
interface FormValue {
  email: string
}
interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const { email, type_email } = R.strings()

const { icon_message } = R.images

const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập Email!'),
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

const ForgotPasswordScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [emailUser, setEmail] = useState('')

  const onSent = (data: any) => {
    callAPIHook({
      API: requestResetPassword,
      payload: { email: data.email },
      useLoading: setIsLoading,
      onSuccess: res => {
        setEmail(data.email)
        setShowModal(true)
      },
      onError: err => {
        showMessages(
          R.strings().notification,
          'Đã có lỗi xảy ra! Vui lòng thử lại.'
        )
      },
    })
  }

  const onGoToLogin = () => {
    function loadFirst() {
      // await setShowModal(false)
      NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
    }
    loadFirst()
  }

  const clickModal = () => {
    console.log('asdad')

    setShowModal(false)
  }
  return (
    <>
      <View style={styles.main}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <RNHeader
          titleHeader="Quên mật khẩu"
          back
          borderBottomHeader="transparent"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
            <Text style={styles.txtDescription}>
              Vui lòng nhập email bạn đã đăng ký
            </Text>
            <Formik
              initialValues={{
                email: '',
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
                <View style={{ marginTop: 50 }}>
                  <FormInput
                    renderLabel={<LabelInput text={email} required />}
                    autoCapitalize={'none'}
                    containerStyle={styles.inputContainer}
                    leftIcon={icon_message}
                    value={values.email.trim()}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder={type_email}
                    placeholderTextColor="#8C8C8C"
                    error={
                      errors.email && touched.email ? errors.email : undefined
                    }
                  />
                  <Button
                    style={styles.btnRegister}
                    children={
                      <Text
                        style={{
                          // ...fonts.semi_bold16 * scale,
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
          </View>
          <Modal
            isVisible={showModal}
            onBackdropPress={() => console.log('asas')}
            // style={{ alignSelf: 'center' }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={styles.modal}>
                <Image
                  style={styles.imgModalSent}
                  source={require('../../assets/images/icon_email.png')}
                />
                <Text style={styles.txtModalDescription}>
                  Mã xác minh đã được gửi vào email của bạn! Vui lòng kiểm tra
                  email.
                </Text>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => {
                    setShowModal(false)
                    setTimeout(() => {
                      NavigationUtil.navigate(SCREEN_ROUTER_AUTH.UPDATE_PASS, {
                        email: emailUser,
                      })
                    }, 200)
                  }}
                >
                  <Text style={styles.txtBtnModal}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
        {isLoading && <LoadingProgress />}
      </View>
    </>
  )
}

export default ForgotPasswordScreen
