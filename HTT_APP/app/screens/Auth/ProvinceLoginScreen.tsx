import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import Dropdown from 'react-native-dropdown-enhanced'
import FastImage from 'react-native-fast-image'
import OneSignal from 'react-native-onesignal'
import reactotron from 'ReactotronConfig'
import * as Yup from 'yup'
import { requestGetProvinceKiotViet, requestLogin } from './AuthApi'
import styles from './styles/stylesLogin'

const { ic_register_login, icon_lock, icon_show_password, ic_eye_close } =
  R.images

const { phone, password, type_phone, type_pass, register } = R.strings()

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const loginSchema = Yup.object().shape({
  // phone: Yup.string().required('Vui lòng nhập số điện thoại!'),
  // .matches(phonePattern, 'Số điện thoại không hợp lệ'),
  // password: Yup.string().required('Vui lòng nhập mật khẩu!'),
})

const LabelInput = ({ text, required, style }: labelProps) => {
  return required ? (
    <Text style={[styles.labelInput, style]}>{`${text} `}</Text>
  ) : (
    <Text style={[styles.labelInput, style]}>{text}</Text>
  )
}

const ProvinceLoginScreen = (props: any) => {
  const info = props.route.params.payload
  const [device_id, setDevice_id] = useState<string>()
  const [kiotviet_id, setKiotVietId] = useState<any>()
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [securePass, setSecurePass] = useState({
    pass: true,
    rePass: true,
  })

  const onLogin = (data: any) => {
    NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PASSWORD, {
      payload: {
        user_name: info.user_name,
        device_id,
        kiotviet_id,
      },
    })
  }

  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    setDevice_id(deviceState?.userId)
  }
  useEffect(() => {
    getDeviceID()
  }, [])

  return (
    <>
      <ImageBackground style={styles.main} source={R.images.background}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="dark-content"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image style={styles.imageLogin} source={R.images.image_login} />
            <View
              style={{
                borderWidth: 1,
                borderColor: '#F178B6',
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.3)',
                paddingVertical: 32,
                marginHorizontal: 15,
                marginTop: 26,
              }}
            >
              <Text style={styles.txtLogin}>Khu vực</Text>
              <View style={styles.content}>
                <Formik
                  initialValues={{
                    phone: '',
                    password: '',
                  }}
                  validationSchema={loginSchema}
                  onSubmit={onLogin}
                  children={({
                    handleSubmit,
                    handleChange,
                    values,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <View style={{ marginTop: 30 }}>
                      <Dropdown
                        showDropIcon={R.images.ic_account}
                        data={info.listProvinceKiotViet}
                        defaultLabel={'Chọn khu vực'}
                        activeTextColor={colors.primary}
                        tickIconStyle={{ tintColor: colors.primary }}
                        style={{
                          borderRadius: 0,
                          borderWidth: 0,
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#8C8C8C',
                          paddingBottom: 0,
                        }}
                        dropdownStyle={{
                          minWidth: 60,
                          borderWidth: 0,
                          borderBottomWidth: 1,
                          padding: 0,
                          borderRadius: 0,
                          marginLeft: -53,
                        }}
                        labelStyle={{ ...fonts.regular14, color: '#69747E' }}
                        itemTextStyle={{ ...fonts.regular16 }}
                        showTickIcon
                        onSelectedChange={({ value }) => {
                          setKiotVietId(value)
                        }}
                        onEndReachedThreshold={0.1}
                        // onMomentumScrollBegin={onMomentumScrollBeginCategory}
                        onEndReached={({ distanceFromEnd }) => {}}
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
                            Tiếp tục
                          </Text>
                        }
                        onPress={handleSubmit}
                      />
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '5%',
            padding: 10,
          }}
          onPress={() => {
            NavigationUtil.goBack()
          }}
          children={
            <FastImage
              style={{ width: 30, height: 30 }}
              source={R.images.ic_back}
            />
          }
        />
      </ImageBackground>
      {isFetchingData && <LoadingProgress />}
    </>
  )
}

export default ProvinceLoginScreen
