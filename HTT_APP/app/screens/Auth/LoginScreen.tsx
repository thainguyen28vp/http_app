import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { getRechargeCoin } from '@app/service/Network/home/HomeApi'
import { useAppSelector } from '@app/store'
import { colors, fonts, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { Formik } from 'formik'
import React, { useEffect, useReducer, useState } from 'react'
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
import { useDispatch } from 'react-redux'
import reactotron from 'reactotron-react-native'
import * as Yup from 'yup'
import { requestConfigThunk } from '../App/Config/ConfigSlice'
import {
  requestCheckPhone,
  requestGetProvinceKiotViet,
  requestLogin,
} from './AuthApi'
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
  phone: Yup.string().required('Vui lòng nhập số điện thoại!'),
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

const LoginScreen = (props: any) => {
  const [device_id, setDevice_id] = useState<string>()
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [listProvinceKiotViet, setListProvinceKioViet] = useState<any>()
  const [securePass, setSecurePass] = useState({
    pass: true,
    rePass: true,
  })
  const dispatch = useDispatch()
  const dataConfig = useAppSelector(state => state.ConfigReducer.data)
  const [state, setState] = useState({
    phone: __DEV__ ? '0343507131' : '',
    password: __DEV__ ? '123456' : '',
  })

  const onLogin = (data: any) => {
    callAPIHook({
      API: requestCheckPhone,
      payload: { phone_number: data.phone },
      useLoading: setIsFetchingData,
      typeLoading: 'isLoading',
      onSuccess: res => {
        if (res.data.is_duplicate_phone_number) {
          getProvinceKiotViet(data)
          return
        }
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PASSWORD, {
          payload: {
            user_name: data.phone,
            device_id,
          },
        })
      },
      onError: error => {
        showMessages('', 'Tài khoản không tồn tại trong hệ thống!')
      },
    })
  }

  const getProvinceKiotViet = (data: any) => {
    callAPIHook({
      API: requestGetProvinceKiotViet,
      payload: data.phone,
      onSuccess: res => {
        let listProvince = res.data.map((item: any) => {
          return (item = {
            label: item.name || item.retailer || 'Chưa cập nhật',
            value: item.id,
          })
        })
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PROVINCE_LOGIN, {
          payload: {
            user_name: data.phone,
            device_id,
            listProvinceKiotViet: listProvince,
          },
        })
      },
      onError: error => {
        console.log('errorLOGIN', error)
      },
    })
  }

  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    console.log('deviceID', deviceState.userId)
    setDevice_id(deviceState?.userId)
  }

  const getConfig = () => {
    dispatch(requestConfigThunk())
  }

  useEffect(() => {
    getConfig()
    getDeviceID()
  }, [])
  useEffect(() => {}, [])

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
                borderColor: colors.primary,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.3)',
                paddingVertical: 32,
                marginHorizontal: 15,
                marginTop: 26,
              }}
            >
              <Text style={styles.txtLogin}>Đăng nhập</Text>
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
                      <FormInput
                        renderLabel={<LabelInput text={phone} required />}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_register_login}
                        value={values.phone.trim()}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder={type_phone}
                        placeholderTextColor="#8C8C8C"
                        keyboardType="numeric"
                        error={
                          errors.phone && touched.phone
                            ? errors.phone
                            : undefined
                        }
                      />
                      {/* <Text
                        onPress={() => onForgot()}
                        style={styles.txtForgotPass}
                      >
                        Quên mật khẩu?
                      </Text> */}
                      {/* <Dropdown
                        data={[
                          { label: 'Hà Nội', value: 1 },
                          { label: 'Đà nẵng', value: 2 },
                          { label: 'Hồ Chí Minh', value: 3 },
                        ]}
                        defaultLabel={'Danh mục'}
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
                        }}
                        labelStyle={{ ...fonts.regular14, color: '#69747E' }}
                        itemTextStyle={{ ...fonts.regular16 }}
                        showTickIcon
                        onSelectedChange={({ value }) => {}}
                        onEndReachedThreshold={0.1}
                        // onMomentumScrollBegin={onMomentumScrollBeginCategory}
                        onEndReached={({ distanceFromEnd }) => {}}
                      /> */}
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
                            Tiếp tục
                          </Text>
                        }
                        onPress={handleSubmit}
                      />
                      {dataConfig?.flag_user_register_enabled && (
                        <View
                          style={{
                            alignSelf: 'center',
                            marginTop: 20,
                            flexDirection: 'row',
                          }}
                        >
                          <Text
                            style={{
                              ...fonts.regular14,
                            }}
                            children={'Bạn chưa có tài khoản?'}
                          />
                          <DebounceButton
                            onPress={() => {
                              NavigationUtil.navigate(
                                SCREEN_ROUTER_AUTH.REGISTER
                              )
                            }}
                            children={
                              <Text
                                style={{
                                  color: colors.primary,
                                  ...fonts.medium14,
                                }}
                                children={' Đăng ký'}
                              />
                            }
                          />
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DebounceButton
          style={{
            position: 'absolute',
            top: '6%',
            right: '5%',
          }}
          onPress={() => {
            NavigationUtil.goBack()
          }}
          children={
            <Image
              source={R.images.ic_close}
              style={{
                width: 35,
                height: 35,
              }}
            />
          }
        />
      </ImageBackground>
      {isFetchingData && <LoadingProgress />}
    </>
  )
}

export default LoginScreen
