import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import FormInput from '@app/components/FormInput'
import { colors, fonts } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import { DebounceButton } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '@app/components/FstImage/FstImage'

const DetailRequestFlower = (props: any) => {
  const data = props.route.params.data

  const renderBody = () => {
    return (
      <ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <DebounceButton
              onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER_APP.MEDIA_VIEWER, {
                  data: data.images.map(
                    (item: any) => (item = { url: item.image_url, type: 0 })
                  ),
                  index: 0,
                })
              }}
              children={
                <FastImage
                  source={
                    data?.images?.length
                      ? { uri: data?.images[0]?.image_url }
                      : R.images.image_logo
                  }
                  style={{
                    width: 152,
                    height: 152,
                    borderRadius: 16,
                    aspectRatio: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 6,
                      paddingLeft: 6,

                      // justifyContent: 'space-around',
                    }}
                  >
                    {data?.images?.length > 1 &&
                      data?.images?.map((item: any, index) => {
                        if (index == 0) return
                        return (
                          <FstImage
                            style={{
                              width: 30,
                              height: 30,
                              marginRight: 6,
                              borderWidth: 2,
                              borderColor: colors.primary,
                              borderRadius: 8,
                            }}
                            source={{ uri: item.image_url }}
                            resizeMode={'cover'}
                          />
                        )
                      })}
                  </View>
                </FastImage>
              }
            />
            <View style={{ paddingLeft: 24, flex: 1 }}>
              <Text
                style={{ ...fonts.regular12, color: '#7B7B7B' }}
                children={DateUtil.formatTimeDateReview(data.created_at)}
              />
              <Text
                style={{
                  marginTop: 10,
                  color:
                    data.status == 1
                      ? '#F1A22A'
                      : data.status == 2
                      ? '#2A91F1'
                      : 'red',
                  ...fonts.regular12,
                }}
                children={
                  data.status == 1
                    ? `Đã yêu cầu`
                    : data.status == 2
                    ? 'Phê duyệt'
                    : 'Từ chối'
                }
              />
              {data.status == 3 && (
                <Text
                  style={{
                    ...fonts.regular12,
                    color: '#7B7B7B',
                    marginTop: 10,
                  }}
                  children={'Lý do: ' + data?.reject_note}
                />
              )}
            </View>
          </View>
          {renderInfo()}
        </View>
      </ScrollView>
    )
  }
  const renderInfo = () => {
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={{ ...fonts.medium16 }} children={'Thông tin điện hoa'} />
        <View style={{ marginTop: 24 }}>
          <FormInput
            disableEdit
            require
            value={data.receiver_name}
            label={'Tên người nhận'}
            placeholder={'Nhập tên người nhận'}
            rightIcon={R.images.ic_heart}
          />
          <FormInput
            disableEdit
            require
            value={data.phone_number}
            label={'Số điện thoại người nhận'}
            placeholder={'Nhập số điện người nhận'}
          />
          <FormInput
            disableEdit
            require
            value={data?.province?.name}
            label={'Tỉnh thành'}
          />
          <FormInput
            disableEdit
            require
            value={data.address}
            label={'Địa chỉ giao hàng'}
            placeholder={'Nhập địa chỉ giao hàng'}
          />
          <FormInput
            disableEdit
            require
            value={data.note}
            label={'Ghi chú'}
            placeholder={'Nhập ghi chú'}
          />
        </View>
      </View>
    )
  }
  return (
    <ScreenWrapper
      //   isLoading={isLoading}
      titleHeader={'Chi tiết'}
      back
      children={renderBody()}
    />
  )
}

export default DetailRequestFlower

const styles = StyleSheet.create({})
