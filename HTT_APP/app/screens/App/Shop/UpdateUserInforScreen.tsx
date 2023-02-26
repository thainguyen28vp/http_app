import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import * as Yup from 'yup'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import Line from './components/Line'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
// import { Accessory, Avatar } from 'react-native-elements'
import { Formik } from 'formik'
import DateUtil from '@app/utils/DateUtil'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import ImagePickerHelper from '@app/utils/ImagePickerHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestUpdateUserInfor } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppSelector } from '@app/store'
import { requestUploadSingleFile } from '@app/service/Network/files/FilesApi'
import reactotron from 'ReactotronConfig'
import { mailPattern } from '@app/utils/FuncHelper'
import Avatar from '@app/components/Avatar'

const updateUserSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập tên'),
  email: Yup.string()
    .required('Vui lòng nhập email')
    .matches(mailPattern, 'Email không hợp lệ'),
  address: Yup.string().optional(),
  profileImgUrl: Yup.string(),
  date: Yup.date().required('Vui lòng chọn ngày sinh'),
})

const GENDER = {
  MALE: 1,
  FEMALE: 2,
}

const UpdateUserInforScreen = (props: any) => {
  const refreshList = props.route.params.refreshList
  const { data } = useAppSelector(state => state.accountReducer)

  const [gender, setGender] = useState(data.gender || GENDER.MALE)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [date, setDate] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [avtImgLoading, setAvtImgLoading] = useState<boolean>(false)

  const handleUpdate = (dataForm: any) => {
    const payload = {
      name: dataForm.name.trim(),
      email: dataForm.email,
      address: dataForm.address,
      gender: gender,
      date_of_birth: DateUtil.formatPayloadDate(dataForm.date),
      profile_picture_url: dataForm.profileImg,
    }

    callAPIHook({
      API: requestUpdateUserInfor,
      payload,
      useLoading: setDialogLoading,
      onSuccess: res => {
        refreshList()
        showMessages('', 'Thay đổi thông tin tài khoản thành công', () => {
          NavigationUtil.goBack()
        })
      },
    })
  }

  const renderModalSelectGender = () => {
    return (
      <Modal
        isVisible={showModal}
        useNativeDriver
        onBackdropPress={() => {
          setShowModal(!showModal)
        }}
      >
        <View style={{ backgroundColor: colors.white, borderRadius: 10 }}>
          <Text
            style={{ textAlign: 'center', ...fonts.regular16, margin: 14 }}
            children={'Chọn giới tính'}
          />
          <Line color={'#F1F3F5'} />
          <TouchableOpacity
            onPress={() => {
              setGender(GENDER.MALE)
              setShowModal(!showModal)
            }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
          >
            <Text style={{ ...fonts.regular16, flex: 1 }} children={'Nam'} />
            {gender == GENDER.MALE ? (
              <FastImage
                source={R.images.ic_tick}
                style={{ width: 12, height: 12 }}
                resizeMode={'contain'}
                tintColor={colors.primary}
              />
            ) : null}
          </TouchableOpacity>
          <Line color={'#F1F3F5'} />
          <TouchableOpacity
            onPress={() => {
              setGender(GENDER.FEMALE)
              setShowModal(!showModal)
            }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
          >
            <Text style={{ ...fonts.regular16, flex: 1 }} children={'Nữ'} />
            {gender == GENDER.FEMALE ? (
              <FastImage
                source={R.images.ic_tick}
                style={{ width: 12, height: 12 }}
                resizeMode={'contain'}
                tintColor={colors.primary}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  return (
    <ScreenWrapper
      back
      backgroundColor={colors.white}
      dialogLoading={dialogLoading}
      titleHeader={'Thông tin tài khoản'}
    >
      <Formik
        initialValues={{
          name: data.name || '',
          email: data.email || '',
          profileImg: data.profile_picture_url || '',
          date: data.date_of_birth || '',
          address: '',
        }}
        validationSchema={updateUserSchema}
        onSubmit={handleUpdate}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.container}>
            {/* <Avatar
              size={100}
              rounded
              source={
                !avtImgLoading
                  ? { uri: values.profileImg }
                  : { uri: 'no-image' }
              }
              containerStyle={{
                backgroundColor: '#DBDDDF',
                alignSelf: 'center',
                marginVertical: 15,
              }}
              children={
                <Accessory
                  size={20}
                  source={R.images.ic_camera}
                  style={styles.accessory}
                  onPress={() => {
                    ImagePickerHelper((res: string) => {
                      let body = new FormData()
                      body.append('image', {
                        name: `images${new Date().getTime()}.jpg`,
                        type: 'image/jpeg',
                        uri: res,
                      })

                      callAPIHook({
                        API: requestUploadSingleFile,
                        payload: { type: 0, body },
                        useLoading: setAvtImgLoading,
                        onSuccess: res => {
                          setFieldValue('profileImg', res.data.url)
                        },
                      })
                    })
                  }}
                />
              }
            /> */}
            <Avatar
              src={{ uri: values.profileImg }}
              style={{ marginVertical: 20 }}
              isLoading={avtImgLoading}
              accessorySrc={R.images.ic_camera}
              onSelect={res => {
                console.log(res)

                let body = new FormData()
                body.append('image', {
                  name: `images${new Date().getTime()}.jpg`,
                  type: 'image/jpeg',
                  uri: res,
                })

                callAPIHook({
                  API: requestUploadSingleFile,
                  payload: { type: 0, body },
                  useLoading: setAvtImgLoading,
                  onSuccess: res => {
                    setFieldValue('profileImg', res.data.url)
                  },
                })
              }}
            />
            <FormInput
              value={values.name}
              label={R.strings().full_name}
              placeholder={R.strings().type_name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              rightIcon={R.images.ic_heart}
              error={errors.name && touched.name ? errors.name : undefined}
            />
            <FormInput
              value={values.email.trim()}
              label={R.strings().email}
              placeholder={R.strings().type_email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email && touched.email ? errors.email : undefined}
            />
            <FormInput
              clickable
              label={'Ngày sinh'}
              selectedText={
                values.date ? DateUtil.formatDisplayDate(values.date) : ''
              }
              placeholder={'Chọn ngày sinh'}
              showRightIcon
              rightIcon={R.images.ic_calendar}
              onPress={() => {
                setShowDatePicker(true)
              }}
              error={errors.date && touched.date ? errors.date : undefined}
            />
            <FormInput
              clickable
              label={'Giới tính'}
              showRightIcon
              selectedText={gender == GENDER.MALE ? 'Nam' : 'Nữ'}
              placeholder={'Chọn giới tính'}
              onPress={() => {
                setShowModal(!showModal)
              }}
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
            <DateTimePickerModal
              timePickerModeAndroid={'spinner'}
              isVisible={showDatePicker}
              date={date}
              mode="date"
              maximumDate={new Date()}
              onConfirm={dateTime => {
                setFieldValue('date', dateTime)
                setDate(dateTime)
                setShowDatePicker(false)
              }}
              onCancel={() => setShowDatePicker(false)}
            />
            {renderModalSelectGender()}
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    // alignItems: 'center'
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  labelInput: {
    ...fonts.regular14,
    color: '#262626',
  },
  iconStyle: {
    width: 16,
    height: 17,
    resizeMode: 'contain',
    marginRight: 13,
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
    ...styleView.centerItem,
    width: '100%',
    height: 45,
    marginVertical: 30,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  accessory: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 15,
    shadowColor: 'white',
  },
})

export default UpdateUserInforScreen
