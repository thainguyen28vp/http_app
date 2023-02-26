import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import { Button } from '@app/components/Button/Button'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { GIFT_TYPE } from '@app/config/Constants'
import {
  getListGift,
  requestPurchaseGift,
} from '@app/service/Network/home/HomeApi'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice } from '@app/utils/FuncHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Modal from 'react-native-modal'
import R from '@app/assets/R'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import reactotron from 'ReactotronConfig'

const { width } = dimensions

const ListGiftScreen = (props: any) => {
  const [listGift, setListGift] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [userAddress, setUserAddress] = useState<any>()

  const giftIdRef = useRef<number>()

  const onPurchaseVoucher = (dfType: number, giftId: number) => {
    if (dfType == GIFT_TYPE.DISCOUNT_CODE) {
      showConfirm('', 'Bạn có chắc chắn muốn đổi quà tặng này', () => {
        callAPIHook({
          API: requestPurchaseGift,
          payload: { gift_id: giftId, body: {} },
          useLoading: setDialogLoading,
          onSuccess: res => {
            showMessages('', 'Đổi quà tặng thành công')
          },
        })
      })
    } else {
      giftIdRef.current = giftId
      setIsVisible(true)
    }
  }

  const handleOnModalSubmit = () => {
    if (!userAddress) {
      setIsVisible(false)
      showMessages('', 'Vui lòng chọn địa chỉ', () => setIsVisible(true))
    } else {
      setIsVisible(false)
      callAPIHook({
        API: requestPurchaseGift,
        payload: {
          gift_id: giftIdRef.current,
          body: {
            shipping_province_id: userAddress?.province_id,
            shipping_district_id: userAddress?.district_id,
            shipping_ward_id: userAddress?.ward_id,
            shipping_address: userAddress?.address,
            shipping_name: userAddress?.name,
            shipping_phone_number: userAddress?.phone_number,
          },
        },
        useLoading: setDialogLoading,
        onSuccess: res => {
          showMessages('', 'Đổi quà tặng thành công')
        },
      })
    }
  }

  const getData = () => {
    callAPIHook({
      API: getListGift,
      useLoading: setIsLoading,
      onSuccess: res => {
        setListGift(
          res.data.filter(item => !!item.quantity && !!item.is_active)
        )
      },
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const renderGiftItem: ListRenderItem<any> = ({ item }) => {
    return (
      <View
        style={{
          ...styleView.rowItem,
          width: '100%',
          padding: 15,
          backgroundColor: colors.white,
          borderRadius: 16,
        }}
      >
        <FastImage
          style={{ width: 118, height: 118, borderRadius: 16 }}
          source={{ uri: item.icon_url }}
        />
        <View
          style={{ flex: 1, marginLeft: 16, justifyContent: 'space-between' }}
        >
          <Text style={{ ...fonts.medium16 }} children={item.name} />
          {item.df_type_gift_id != GIFT_TYPE.GIFT && (
            <Text
              style={{ ...fonts.regular14 }}
              numberOfLines={2}
              children={`Giảm ${item.discount_percent || 0}%, tối đa ${
                formatPrice(item.max_discount_money?.toString()) || '0'
              }đ`}
            />
          )}
          <Button
            style={{
              width: 119,
              height: 32,
              ...styleView.centerItem,
              backgroundColor: !item.quantity ? 'rgba(0,0,0,.2)' : '#FCA931',
              borderRadius: 16,
              alignSelf: 'flex-end',
            }}
            disabled={!item.quantity}
            onPress={() => onPurchaseVoucher(item.df_type_gift_id, item.id)}
            children={
              <Text
                style={{
                  ...fonts.medium16,
                  color: colors.white,
                  marginHorizontal: 5,
                }}
                numberOfLines={1}
                children={`${formatPrice(item?.price?.toString())} điểm`}
              />
            }
          />
        </View>
      </View>
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 16 }} />,
    []
  )

  return (
    <ScreenWrapper
      back
      unsafe
      isLoading={isLoading}
      dialogLoading={dialogLoading}
      titleHeader={'Danh sách quà tặng'}
    >
      <FlatList
        data={listGift}
        refreshing={isLoading}
        onRefresh={getData}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 16,
          paddingBottom: isIphoneX() ? 20 : 0,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={renderGiftItem}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={renderItemSeparator}
      />
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationOutTiming={100}
        isVisible={isVisible}
        style={{ alignItems: 'center' }}
      >
        <View
          style={{
            width: width - 30,
            marginHorizontal: 15,
            backgroundColor: colors.white,
            height: 160,
            borderRadius: 16,
            padding: 20,
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ ...fonts.regular14 }} children={'Địa chỉ'} />
          <Button
            onPress={() => {
              setIsVisible(false)
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_RECEIVER, {
                giftSign: true,
                selectUserAddress: (user: any) => setUserAddress(user),
                setVisible: () => setIsVisible(true),
              })
            }}
            children={
              <View
                style={{
                  ...styleView.rowItemBetween,
                  borderBottomWidth: 1,
                  borderBottomColor: '#BFBFBF',
                  paddingBottom: 7,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ ...fonts.regular16, flex: 1 }}
                  numberOfLines={3}
                  children={
                    !!userAddress
                      ? `${userAddress.address}, ${userAddress.ward?.name}, ${userAddress.district?.name}, ${userAddress.province?.name}`
                      : 'Chọn địa chỉ'
                  }
                />
                <FastImage
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                  source={R.images.ic_arrow_right}
                />
              </View>
            }
          />
          <View style={{ ...styleView.rowItemBetween, marginHorizontal: 5 }}>
            <Button
              style={[styles.btnModal, { backgroundColor: '#CED4DA' }]}
              onPress={() => setIsVisible(false)}
              children={
                <Text
                  style={{ ...fonts.medium16, color: '#69747E' }}
                  children={'Huỷ'}
                />
              }
            />
            <Button
              style={[styles.btnModal, { backgroundColor: '#E84343' }]}
              onPress={handleOnModalSubmit}
              children={
                <Text
                  style={{ ...fonts.medium16, color: colors.white }}
                  children={'Xác nhận'}
                />
              }
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  )
}

export default ListGiftScreen

const styles = StyleSheet.create({
  btnModal: {
    ...styleView.centerItem,
    width: 140,
    height: 40,
    borderRadius: 50,
  },
})
