import R from '@app/assets/R'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts } from '@app/theme'
import { Formik } from 'formik'
import { isEqual } from 'lodash'
import React, { memo, useState, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Yup from 'yup'
import { FormValue } from './FormValue'
import { useForm } from 'react-hook-form'

import { ValidationMap } from '@app/components/HookFormInput/HookFormInput.props'
import { MaterialInput } from './MaterialInput'

const LoginSchema = Yup.object().shape({
  user_id: Yup.string().min(4, R.strings().validate_user).required(R.strings().input_require_name),
  password: Yup.string()
    .min(6, R.strings().validate_phone_fail)
    .max(25, R.strings().validate_phone_fail)
    .required(R.strings().input_require_password),
    
})
interface FormValue {
  account: string
}
const FormLoginComponent = ({ onLogin }: { onLogin: (data: any) => void }) => {
  const [isShowPass, setIsShowPass] = useState(true)
  const { control } = useForm<FormValue>({
    defaultValues: {},
  })
  return (
    <Formik
      initialValues={FormValue}
      onSubmit={onLogin}
      validationSchema={LoginSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={{}}>
          <View style={styles.form_InputLogin}>
            <Text children={R.strings().login} style={styles.txt_title}></Text>
            <MaterialInput
            isRequired={false}
              onChangeText={handleChange('user_id')}
              leftIcon={R.images.ic_user}
              maxLength={50}
              label= {R.strings().inp_username}
              control={control}
              inputKey="account"
              onBlur={handleBlur('user_id')}
              error={touched.user_id && errors.user_id}
              onSubmitEditing={() => {}}
            />
            <MaterialInput
              onChangeText={handleChange('password')}
              leftIcon={R.images.ic_lock}
              isRequired={false}
              maxLength={50}
              label={R.strings().password}
              control={control}
              inputKey="pass"
              onBlur={handleBlur('password')}
              onSubmitEditing={() => {}}
              error={touched.password && errors.password}
              secureTextEntry={isShowPass}
            />
            <View style={styles.btnForgot}>
              <Text
                style={styles.txt_forgotPass}
                children={R.strings().forgotPass}
                onPress={() => {
                  NavigationUtil.navigate(SCREEN_ROUTER_AUTH.FORGOT_PASS)
                }}
              ></Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.btn_confirm}
                children={
                  <Text
                    style={styles.txt_confirm}
                    children={R.strings().login}
                  />
                }
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  )
}
const styles = StyleSheet.create({
  txt_title: {
    ...fonts.semi_bold20,
    alignSelf: 'center',
    marginBottom: 30,
  },
  txt_forgotPass: {
    ...fonts.regular16,
    fontSize: 15,
    color: colors.primary,
    marginTop: '5%',
  },
  form_InputLogin: {
    flex: 1,
    marginTop: 10,
  },
  btnForgot: {
    justifyContent: 'flex-end',
    marginBottom: 30,
    alignItems: 'flex-end',
  },
  btn_confirm: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    borderRadius: 25,
    width: 200,
  },

  txt_confirm: {
    ...fonts.semi_bold16,
    color: colors.white,
    paddingVertical: 12,
  },
})

const FormLogin = memo(FormLoginComponent, isEqual)

export default FormLogin
