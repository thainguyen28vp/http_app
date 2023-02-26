import React, { useState, useEffect, useRef, memo } from 'react'
import { View, Text, Platform } from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView, dimensions } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@config/screenType'
import { callAPIHook } from '@app/utils/CallApiHelper'
import FormInput from '@app/components/FormInput'
import BottomInforEditableForm from './components/BottomInforEditableForm'
import {
  getReceiverInfor,
  requestAddNewReceiver,
  requestDeleteUserAddress,
  requestEditReceiver,
} from '@app/service/Network/shop/ShopApi'
import { useAppSelector } from '@app/store'
import {
  getListDistrict,
  getListWard,
} from '@app/service/Network/default/DefaultApi'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import isEqual from 'react-fast-compare'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { phonePattern } from '@app/utils/FuncHelper'
import BottomModal from './components/BottomModal'
import reactotron from 'reactotron-react-native'

const { width } = dimensions

type ListAddressId = {
  provinceId: number | null
  districtId: number | null
  wardId: number | null
}

const EditUserSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập tên'),
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(phonePattern, 'Số điện thoại không hợp lệ'),
  province: Yup.object().required(),
  district: Yup.object().required(),
  ward: Yup.object().required(),
  address: Yup.string().required('Vui lòng nhập địa chỉ'),
})

const SELECT_TYPE = {
  PROVINCE: 0,
  DISTRICT: 1,
  WARD: 2,
}

const EditReceiverInforScreen = (props: any) => {
  const id = props.route.params?.id
  const { reloadList, isPayment, itemInfoReciver } = props?.route.params
  const ProvinceData = useAppSelector(state => state.ProvinceReducer)
  const listProvince = ProvinceData.data!.map(item => ({
    label: item.name,
    value: item.id,
  }))

  const [isLoading, setIsloading] = useState<boolean>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(itemInfoReciver)
  const [listAddress, setListAddress] = useState<any>([])
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false)

  const selectTypeRef = useRef<number>(SELECT_TYPE.PROVINCE)
  const listAddressIdRef = useRef<ListAddressId>({
    provinceId: null,
    districtId: null,
    wardId: null,
  })

  const handleOnSubmit = (form: any) => {
    // const payload = {
    //   name: form.name,
    //   phone: form.phone,
    //   df_province_id: form.province.id,
    //   df_district_id: form.district.id,
    //   df_ward_id: form.ward.id,
    //   address: form.address,
    //   location_address: form.locationAddress,
    //   long: 0,
    //   lat: 0,
    //   is_default: form.isDefault ? 1 : 0,
    // }
    const payload = {
      is_default: !!form.isDefault,
      phone_number: form.phone,
      name: form.name,
      address: form.address,
      ward_id: form.ward.id,
      district_id: form.district.id,
      province_id: form.province.id,
    }

    callAPIHook({
      API: !id ? requestAddNewReceiver : requestEditReceiver,
      payload: !id ? payload : { id, body: { ...payload } },
      useLoading: setIsloading,
      onSuccess: res => {
        showMessages(R.strings().notification, 'Lưu thành công!', () => {
          reloadList()
          if (isPayment) {
            NavigationUtil.goBack()
            return
          }
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_RECEIVER)
        })
      },
      onError: () => {
        showMessages('', 'Đã có lỗi xảy ra! Vui lòng thử lại.')
      },
    })
  }

  const onDeletePress = () => {
    showConfirm('Thông báo', 'Bạn có muốn xoá thông tin người nhận', () => {
      callAPIHook({
        API: requestDeleteUserAddress,
        payload: id,
        onSuccess: res => {
          reloadList()
          setTimeout(() => {
            showMessages('', 'Xoá thành công!', () => {
              NavigationUtil.goBack()
            })
          }, 150)
        },
      })
    })
  }

  const renderTitleModal = (): string => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      return 'Chọn tỉnh/ thành phố'
    else if (selectTypeRef.current == SELECT_TYPE.DISTRICT)
      return 'Chọn quận/ huyện'
    else return 'Chọn phường/ xã'
  }

  const renderDefaultValue = (): number | null => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      return listAddressIdRef.current.provinceId
    else if (selectTypeRef.current == SELECT_TYPE.DISTRICT)
      return listAddressIdRef.current.districtId
    else return listAddressIdRef.current.wardId
  }

  const updateListDataAddress = () => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      setListAddress(listProvince)
    else {
      const isDistrictPress = selectTypeRef.current == SELECT_TYPE.DISTRICT

      if (
        (isDistrictPress && !listAddressIdRef.current.provinceId) ||
        (!isDistrictPress && !listAddressIdRef.current.districtId)
      )
        setListAddress([])
      else
        callAPIHook({
          API: isDistrictPress ? getListDistrict : getListWard,
          useLoading: setIsLoadingAddress,
          payload: isDistrictPress
            ? { province_id: listAddressIdRef.current.provinceId }
            : { district_id: listAddressIdRef.current.districtId },
          onSuccess: res => {
            setListAddress(
              res.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            )
          },
        })
    }
  }

  const getUserData = () => {
    const payload = { id }
    callAPIHook({
      API: getReceiverInfor,
      payload,
      useLoading: setIsloading,
      onSuccess: res => {
        listAddressIdRef.current = {
          provinceId: res.data.DFProvince.id,
          districtId: res.data.DFDistrict.id,
          wardId: res.data.DFWard.id,
        }
        setUserData(res.data)
      },
    })
  }

  useEffect(() => {
    !!id && getUserData()
  }, [id])

  useEffect(() => {
    modalVisible && updateListDataAddress()
  }, [modalVisible])

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: userData?.name || '',
        phone: userData?.phone_number || '',
        address: userData?.address || '',
        province: !!userData?.province
          ? { name: userData?.province.name, id: userData.province.id }
          : null,
        district: !!userData?.district
          ? { name: userData.district.name, id: userData.district.id }
          : null,
        ward: !!userData?.ward
          ? { name: userData.ward.name, id: userData.ward.id }
          : null,
        locationAddress: '',
        isDefault: isPayment ? true : Boolean(userData?.is_default),
      }}
      onSubmit={handleOnSubmit}
      validationSchema={EditUserSchema}
      children={({
        handleSubmit,
        handleChange,
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <ScreenWrapper
          back
          color={colors.black}
          titleHeader={!!id ? 'Chỉnh sửa người nhận' : 'Thêm người nhận'}
          backgroundHeader={colors.white}
          scroll
          isLoading={isLoading}
        >
          <View
            style={{ ...styleView.sharedStyle, marginTop: 2, paddingTop: 10 }}
          >
            <FormInput
              value={values.name}
              label={R.strings().full_name}
              placeholder={R.strings().type_name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={errors.name && touched.name ? errors.name : undefined}
            />
            <FormInput
              value={values.phone}
              label={R.strings().phone}
              placeholder={R.strings().type_phone}
              keyboardType={
                Platform.OS === 'android' ? 'numeric' : 'number-pad'
              }
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={errors.phone && touched.phone ? errors.phone : undefined}
            />
            <FormInput
              placeholder={'Chọn tỉnh/ thành phố'}
              label={'Tỉnh/ Thành phố'}
              selectedText={values.province?.name}
              clickable
              onPress={() => {
                selectTypeRef.current = SELECT_TYPE.PROVINCE
                setModalVisible(true)
              }}
              showRightIcon
              error={
                errors.province && touched.province && !values.province
                  ? 'Vui lòng chọn tỉnh/ thành phố'
                  : undefined
              }
            />
            <FormInput
              label={'Quận/ Huyện'}
              placeholder={'Chọn quận/ huyện'}
              selectedText={values.district?.name}
              onPress={() => {
                selectTypeRef.current = SELECT_TYPE.DISTRICT
                setModalVisible(true)
              }}
              clickable
              error={
                errors.district && touched.district && !values.district
                  ? 'Vui lòng chọn quận/ huyện'
                  : undefined
              }
              showRightIcon
            />
            <FormInput
              label={'Phường/ Xã'}
              placeholder={'Chọn phường/ xã'}
              selectedText={values.ward?.name}
              clickable
              onPress={() => {
                selectTypeRef.current = SELECT_TYPE.WARD
                setModalVisible(true)
              }}
              error={
                errors.ward && touched.ward && !values.ward
                  ? 'Vui lòng chọn phường/ xã'
                  : undefined
              }
              showRightIcon
            />
            <FormInput
              value={values.address}
              label={'Địa chỉ cụ thể'}
              placeholder={'Ví dụ: 179 Vĩnh Hưng'}
              onChangeText={handleChange('address')}
              error={
                errors.address && touched.address ? errors.address : undefined
              }
            />
          </View>
          <BottomInforEditableForm
            showDefaulBar
            showDeleteBar={!!id}
            onDeletePress={onDeletePress}
            switchValue={values.isDefault}
            onSwitchChange={() => setFieldValue('isDefault', !values.isDefault)}
          />
          <Button
            style={{
              ...styleView.centerItem,
              width: width - 40,
              height: 50,
              backgroundColor: colors.primary,
              borderRadius: 16,
              alignSelf: 'center',
              marginTop: 17,
            }}
            onPress={handleSubmit}
            children={
              <Text
                style={{ ...fonts.semi_bold16, color: colors.white }}
                children={R.strings().save}
              />
            }
          />
          <BottomModal
            title={renderTitleModal()}
            isVisible={modalVisible}
            data={listAddress}
            defaultValue={renderDefaultValue()}
            onClose={() => {
              if (selectTypeRef.current == SELECT_TYPE.PROVINCE) {
                setFieldTouched('province', true)
              } else if (selectTypeRef.current == SELECT_TYPE.DISTRICT) {
                setFieldTouched('district', true)
              } else {
                setFieldTouched('ward', true)
              }
              setModalVisible(false)
            }}
            onBackdropPress={() => setModalVisible(false)}
            isLoadingData={isLoadingAddress}
            onSelectChange={(item: any) => {
              if (selectTypeRef.current == SELECT_TYPE.PROVINCE) {
                if (listAddressIdRef.current.provinceId != item.value) {
                  listAddressIdRef.current.provinceId = item.value
                  setFieldValue('province', {
                    name: item.label,
                    id: item.value,
                  })
                  setFieldValue('ward', null)
                  setFieldValue('district', null)
                }
              } else if (selectTypeRef.current == SELECT_TYPE.DISTRICT) {
                if (listAddressIdRef.current.provinceId != item.value) {
                  listAddressIdRef.current.districtId = item.value
                  setFieldValue('district', {
                    name: item.label,
                    id: item.value,
                  })
                  setFieldValue('ward', null)
                }
              } else {
                listAddressIdRef.current.wardId = item.value
                setFieldValue('ward', { name: item.label, id: item.value })
              }

              setModalVisible(false)
            }}
          />
        </ScreenWrapper>
      )}
    />
  )
}

export default memo(EditReceiverInforScreen, isEqual)
