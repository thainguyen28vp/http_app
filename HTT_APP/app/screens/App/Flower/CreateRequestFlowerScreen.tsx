import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { colors, fonts, HEIGHT, OS, WIDTH } from '@app/theme'
import { DebounceButton } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  requestCreateFlower,
  requestGetListFlower,
} from '@app/service/Network/shop/ShopApi'
import MediaPickerModal from '@app/components/MediaPickerModal'
import {
  requestGetProvinceKiotVietInviteCode,
  requestUploadImage,
  requestUploadMultipleImage,
} from '@app/service/Network/livestream/LiveStreamApi'
import { showMessages } from '@app/utils/AlertHelper'
import { handleResizeImage } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import LoadingProgress from '@app/components/LoadingProgress'
import reactotron from 'ReactotronConfig'
import Loading from '@app/components/Loading'
import stylesLogin from '@app/screens/Auth/styles/stylesLogin'
import { Dropdown } from 'react-native-element-dropdown'
import FstImage from '@app/components/FstImage/FstImage'
import { useAppSelector } from '@app/store'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CreateRequestFlowerScreen = (props: any) => {
  const getListFlower = props.route.params.getListFlower
  const listProvince = useAppSelector(state => state.ProvinceReducer.data)
  const [imgFlower, setImgFlower] = useState<Array<any>>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listKiot, setListKiot] = useState([])
  const [loadingRequest, setLoadingRequest] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [info, setInfo] = useState({
    receiver_name: '',
    phone_number: '',
    note: '',
    address: '',
    province_id: '',
    // kiotviet_id: 1,
  })

  const handleConfirm = () => {
    if (!imgFlower?.length) {
      return showMessages(
        R.strings().notification,
        'Vui lòng chọn ảnh điện hoa!'
      )
    }
    if (
      !info.receiver_name.trim() ||
      !info.phone_number.trim() ||
      !info.address.trim() ||
      !info.province_id
      // !info.kiotviet_id ||
      // !info.note
    ) {
      return showMessages(
        R.strings().notification,
        'Vui lòng nhập đầy đủ các trường thông tin bắt buộc!'
      )
    }
    if (info?.receiver_name?.length < 3) {
      return showMessages(
        R.strings().notification,
        '"Tên người nhận" không được ít hơn 3 ký tự!'
      )
    }
    if (info?.phone_number?.length < 9) {
      return showMessages(
        R.strings().notification,
        '"Số điện thoại" không được ít hơn 9 số!'
      )
    }
    const payload = {
      image_url: imgFlower.map(item => item.url),
      receiver_name: info.receiver_name?.trim(),
      phone_number: info.phone_number?.trim(),
      note: info.note?.trim(),
      address: info.address?.trim(),
      province_id: info.province_id,
    }
    callAPIHook({
      API: requestCreateFlower,
      useLoading: setLoadingRequest,
      payload,
      onSuccess: res => {
        showMessages(
          R.strings().notification,
          'Gửi yêu cầu thành công!',
          () => {
            getListFlower()
            NavigationUtil.goBack()
          }
        )
      },
    })
  }
  const uploadImage = (data: []) => {
    const formData = new FormData()
    data.map((item: any) => {
      formData.append('file', {
        name: `images${new Date().getTime()}.jpg`,
        type: 'image/jpeg',
        uri: item.path,
      })
    })
    const payload = {
      type: 1,
      formData,
    }

    callAPIHook({
      API: requestUploadMultipleImage,
      payload: payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        let arrTemp = imgFlower?.concat(res.data)
        if (arrTemp?.length > 5) {
          showMessages(
            'Thông báo',
            'Số lượng ảnh cho phép tải lên tối đa là 5 ảnh!'
          )
          setImgFlower(arrTemp.slice(0, 5))
          return
        }
        setImgFlower(arrTemp)
      },
      onError: err => {
        showMessages(R.strings().notification, 'Tải ảnh lỗi! Vui lòng thử lại.')
      },
    })
  }

  const handleDeleteImage = (index: number) => {
    let arr = [...imgFlower]
    arr = arr.filter((el, idx) => idx !== index)
    setImgFlower(arr)
  }

  const getProvinceKiotViet = () => {
    callAPIHook({
      API: requestGetProvinceKiotVietInviteCode,
      useLoading: setLoadingData,
      onSuccess: res => {
        setListKiot(res.data)
      },
      onError: error => {},
    })
  }

  const handleOnPicker = async (res: any) => {
    // let url = await handleResizeImage(res.data[0])
    uploadImage(res.data)
  }

  useEffect(() => {
    getProvinceKiotViet()
  }, [])

  const renderBody = () => {
    if (loadingData) return <Loading />
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          // contentContainerStyle={{ paddingBottom: HEIGHT * 0.01 }}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  width: WIDTH,
                  justifyContent: !imgFlower?.length ? 'center' : undefined,
                }}
              >
                {!imgFlower?.length ? (
                  <FastImage
                    source={R.images.img_flower_request}
                    style={{
                      width: WIDTH * 0.3,
                      height: WIDTH * 0.3,
                      borderRadius: 16,
                      aspectRatio: 1,
                      borderWidth: 1,
                      borderColor: '#DDD',
                    }}
                    resizeMode={'cover'}
                  />
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 10,
                    }}
                  >
                    <>
                      {imgFlower?.map((item, index) => (
                        <FstImage
                          source={{ uri: item.url }}
                          style={{
                            width: 131,
                            height: 131,
                            borderRadius: 16,
                            aspectRatio: 1,
                            marginRight: 10,
                            alignItems: 'flex-end',
                          }}
                          resizeMode={'cover'}
                        >
                          <DebounceButton
                            onPress={() => handleDeleteImage(index)}
                            style={{ padding: 8 }}
                            children={
                              <FastImage
                                source={R.images.close_avatar}
                                style={{ width: 25, height: 25 }}
                              />
                            }
                          />
                        </FstImage>
                      ))}
                    </>
                  </ScrollView>
                )}
              </View>
              <DebounceButton
                onPress={() => {
                  setIsVisible(prev => !prev)
                }}
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary,
                  alignSelf: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  marginTop: 20,
                }}
                children={
                  <View style={{ flexDirection: 'row' }}>
                    <FastImage
                      source={R.images.img_upload}
                      style={{ width: 13, height: 13, marginRight: 14 }}
                    />
                    <Text
                      style={{ color: colors.primary }}
                      children={'Tải mẫu điện hoa'}
                    />
                  </View>
                }
              />
              {renderInfo()}
              {loadingRequest && <LoadingProgress />}
              <MediaPickerModal
                multiply
                isVisible={isVisible}
                useVisible={setIsVisible}
                onPicker={handleOnPicker}
              />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <View
          style={{
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#DDD',
            paddingBottom: 10,
          }}
        >
          <DebounceButton
            onPress={handleConfirm}
            style={{
              borderColor: colors.white,
              borderRadius: 10,
              marginTop: 8,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 15,
              paddingVertical: 15,
            }}
            children={
              <Text
                style={{ color: colors.white, ...fonts.regular16 }}
                children={'Yêu cầu'}
              />
            }
          />
        </View>
        {isLoading && <LoadingProgress />}
      </View>
    )
  }

  const renderInfo = () => {
    return (
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <Text style={{ ...fonts.medium16 }} children={'Thông tin điện hoa'} />
        <View style={{ marginTop: 24 }}>
          <FormInput
            style={{ color: 'red' }}
            require
            value={info.receiver_name}
            label={'Tên người nhận'}
            placeholderTextColor={'black'}
            placeholder={'Nhập tên người nhận'}
            onChangeText={receiver_name => {
              setInfo({
                ...info,
                receiver_name,
              })
            }}
            rightIcon={R.images.ic_heart}
          />
          <FormInput
            require
            keyboardType="numeric"
            value={info.phone_number}
            label={'Số điện thoại người nhận'}
            placeholder={'Nhập số điện người nhận'}
            onChangeText={phone_number => {
              setInfo({
                ...info,
                phone_number,
              })
            }}
          />
          {/* <View style={{}}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  {
                    ...fonts.regular16,
                    marginBottom: 7,
                  },
                ]}
                children={'Khu vực'}
              />

              <Text style={{ color: 'red' }} children={'*'} />
            </View>
            <Dropdown
              search={false}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={listKiot}
              // maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder="Chọn khu vực"
              value={''}
              onChange={item => {
                console.log('item', item)
                setInfo({ ...info, kiotviet_id: item.id })
              }}
            />
          </View> */}
          <View style={{}}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  {
                    ...fonts.regular16,
                    marginBottom: 7,
                  },
                ]}
                children={'Tỉnh thành'}
              />

              <Text style={{ color: 'red' }} children={'*'} />
            </View>
            <Dropdown
              search={true}
              searchPlaceholder={'Nhập tên thành phố'}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={listProvince}
              // maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder="Chọn tỉnh thành"
              value={''}
              onChange={item => {
                console.log('item', item)
                setInfo({ ...info, province_id: item.id })
              }}
            />
          </View>
          <FormInput
            style={{ marginTop: 20 }}
            require
            value={info.address}
            label={'Địa chỉ giao hàng'}
            placeholder={'Nhập địa chỉ giao hàng'}
            onChangeText={address => {
              setInfo({
                ...info,
                address,
              })
            }}
          />
          <FormInput
            require
            value={info.note}
            label={'Ghi chú'}
            placeholder={'Nhập ghi chú'}
            onChangeText={note => {
              setInfo({
                ...info,
                note,
              })
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <ScreenWrapper
      back
      titleHeader={'Yêu cầu điện hoa'}
      children={renderBody()}
      backgroundColor={colors.white}
    />
  )
}

export default CreateRequestFlowerScreen

const styles = StyleSheet.create({
  dropdown: {
    // margin: 16,
    // height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    ...fonts.regular16,
    color: '#8C8C8C',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})
