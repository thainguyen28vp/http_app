import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { colors, fonts, styleView } from '@app/theme'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import FormInput from '@app/components/FormInput'
import { Button } from '@app/components/Button/Button'
import { useAppSelector } from '@app/store'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { phonePattern } from '@app/utils/FuncHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestUpdateReferral } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import Empty from '@app/components/Empty/Empty'

const referralSchema = Yup.object().shape({
  referralCode: Yup.string()
    .required('Không được bỏ trống')
    .matches(phonePattern, 'Vui lòng nhập đúng định dạng số điện thoại'),
})

const ReferralCodeScreen = (props: any) => {
  const refreshList = props.route.params.refreshList
  const { data } = useAppSelector(state => state.accountReducer)

  const [dialogLoading, setDialogLoading] = useState<boolean>(false)

  const handleOnSubmit = (data: any) => {
    callAPIHook({
      API: requestUpdateReferral,
      payload: { phone: data.referralCode.trim() },
      useLoading: setDialogLoading,
      onSuccess: res => {
        showMessages('', 'Nhập mã giới thiệu thành công', () => {
          refreshList()
          NavigationUtil.goBack()
        })
      },
    })
  }

  return (
    <ScreenWrapper
      back
      unsafe
      dialogLoading={dialogLoading}
      titleHeader={'Mã giới thiệu'}
    >
      {!!data?.referal_customer_id ? (
        <Empty
          backgroundColor={'transparent'}
          description={'Bạn đã nhập mã giới thiệu'}
        />
      ) : (
        <Formik
          initialValues={{ referralCode: '' }}
          validationSchema={referralSchema}
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
                value={values.referralCode}
                label={'Mã giới thiệu'}
                placeholder={'Nhập mã giới thiệu'}
                onChangeText={handleChange('referralCode')}
                keyboardType={
                  Platform.OS === 'android' ? 'numeric' : 'number-pad'
                }
                onBlur={handleBlur('referralCode')}
                error={
                  errors.referralCode && touched.referralCode
                    ? errors.referralCode
                    : undefined
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
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    ...styleView.centerItem,
    width: '100%',
    height: 45,
    marginTop: 30,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
})

export default ReferralCodeScreen
