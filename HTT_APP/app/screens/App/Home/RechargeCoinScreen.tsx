import R from '@app/assets/R'
import { DebounceButton } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { useAppSelector } from '@app/store'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Clipboard,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import ViewShot from 'react-native-view-shot'
import { useDispatch } from 'react-redux'
import { requestConfigThunk } from '../Config/ConfigSlice'
import CameraRoll from '@react-native-community/cameraroll'
import reactotron from 'ReactotronConfig'
import Toast from 'react-native-root-toast'

const RechargeCoinScreen = () => {
  const dispatch = useDispatch()
  const refCapture = useRef<any>()
  const [imageSave, setImageSave] = useState<any>()
  const pointData: any = useAppSelector(state => state.ConfigReducer.data)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const getData = () => {
    dispatch(requestConfigThunk())
  }

  React.useEffect(() => {
    getData()
  }, [])

  return (
    <ScreenWrapper back unsafe titleHeader={'Nạp xu'}>
      <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
          <Text style={{ ...fonts.regular14, color: '#8C8C8C' }}>
            {pointData?.coin_up_guidance}
          </Text>
          <View
            style={{
              alignSelf: 'center',
              marginTop: 25,
            }}
          >
            <ViewShot
              ref={refCapture}
              options={{
                fileName: 'Your-File-Name',
                format: 'jpg',
                quality: 0.9,
              }}
            >
              <View>
                <FstImage
                  source={{
                    uri: pointData?.transfer_money_information.bank_qr_code,
                  }}
                  style={{ width: WIDTH / 2.1, aspectRatio: 1 }}
                  resizeMode={'cover'}
                />
              </View>
            </ViewShot>
            <DebounceButton
              style={{ marginTop: 20 }}
              onPress={() => {
                refCapture.current.capture().then((uri: any) => {
                  CameraRoll.save(uri, {
                    type: 'photo',
                    album: 'Hoa Thanh Tước',
                  })
                  Toast.show(
                    'Tải ảnh thành công! Ảnh đã được lưu vào bộ nhớ máy.',
                    {
                      position: HEIGHT - 80,
                      animation: true,
                    }
                  )
                })
              }}
              children={
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                    alignSelf: 'center',
                    borderRadius: 8,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                  }}
                >
                  <FastImage
                    source={R.images.img_save_image}
                    style={{ width: 18, height: 18 }}
                  />
                  <Text
                    style={{
                      ...fonts.regular12,
                      marginLeft: 6,
                    }}
                    children={'Tải về'}
                  />
                </View>
              }
            />
          </View>
          <View>
            <Text
              style={{ marginTop: 14, ...fonts.medium15 }}
              children={'Thông tin ngân hàng '}
            />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F5F5F5',
                padding: 10,
                marginTop: 14,
              }}
            >
              <Text
                style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
                children={`Người nhận: ${pointData?.transfer_money_information.bank_account_name}`}
              />
              <DebounceButton
                onPress={() => {
                  Clipboard.setString(
                    pointData?.transfer_money_information.bank_account_name
                  )
                  Toast.show(
                    `${pointData?.transfer_money_information.bank_account_name}`,
                    {
                      position: HEIGHT - 80,
                      animation: true,
                    }
                  )
                }}
                children={
                  <Image
                    source={R.images.icon_coppy}
                    style={{ width: 16, height: 16, tintColor: '#DDD' }}
                  />
                }
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F5F5F5',
                padding: 10,
                marginTop: 14,
              }}
            >
              <Text
                style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
                children={`Ngân hàng: ${pointData?.transfer_money_information.bank_name}`}
              />
              <DebounceButton
                onPress={() => {
                  Clipboard.setString(
                    pointData?.transfer_money_information.bank_name
                  )
                  Toast.show(
                    `${pointData?.transfer_money_information.bank_name}`,
                    {
                      position: HEIGHT - 80,
                      animation: true,
                    }
                  )
                }}
                children={
                  <Image
                    source={R.images.icon_coppy}
                    style={{ width: 16, height: 16, tintColor: '#DDD' }}
                  />
                }
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F5F5F5',
                padding: 10,
                marginTop: 14,
              }}
            >
              <Text
                style={{ flex: 1, ...fonts.regular14, lineHeight: 20 }}
                children={`STK: ${pointData?.transfer_money_information.bank_account_number}`}
              />
              <DebounceButton
                onPress={() => {
                  Clipboard.setString(
                    pointData?.transfer_money_information.bank_account_number
                  )
                  Toast.show(
                    `${pointData?.transfer_money_information.bank_account_number}`,
                    {
                      position: HEIGHT - 80,
                      animation: true,
                    }
                  )
                }}
                children={
                  <Image
                    source={R.images.icon_coppy}
                    style={{ width: 16, height: 16, tintColor: '#DDD' }}
                  />
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* {imageSave && (
        <Animated.View style={[styles.viewShot]}>
          <TouchableOpacity
            onPress={() => {
              setImageSave(undefined)
            }}
          >
            <FastImage
              source={{ uri: imageSave }}
              style={{
                width: WIDTH / 3,
                aspectRatio: 1,
                borderWidth: 5,
                borderRadius: 5,
                borderColor: colors.white,
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      )} */}
    </ScreenWrapper>
  )
}

export default RechargeCoinScreen

const styles = StyleSheet.create({
  viewShot: { position: 'absolute', bottom: 10, right: 10 },
})
