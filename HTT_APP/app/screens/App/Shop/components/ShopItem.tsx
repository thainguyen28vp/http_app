import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import { requestFollowShop } from '@app/service/Network/shop/ShopApi'
import { colors, fonts, styleView } from '@app/theme'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Shop } from '../model/Shop'

interface ShopItemProps {
  status_follow?: number
  data: Shop
  onPress?: () => void
  chatIcon?: boolean
  onChatPress?: () => void
  onPressFollowShop?: (status: any, isLoading: boolean) => void
}

const ShopItem = (props: ShopItemProps) => {
  const {
    data,
    onPress,
    chatIcon,
    onChatPress,
    status_follow,
    onPressFollowShop,
  } = props
  const avtImg = data?.profile_picture_url
  const [isFollow, setIsFollow] = useState(status_follow || data.status_follow)
  const [isLoading, setIsLoading] = useState(false)
  const onPressFollow = async () => {
    const payload = {
      shopId: data.id,
      body: {
        status: !isFollow ? 1 : 0,
      },
    }
    try {
      const res = await requestFollowShop(payload)
      if (res.status === 1) {
        setIsFollow(prev => (prev = prev ? 0 : 1))
        onPressFollowShop(res.data)
      } else {
        showMessages(
          R.strings().notification,
          'Đã có lỗi xảy ra! Vui lòng thử lại.'
        )
      }
    } catch (error) {}
  }

  const ShopItemView = (
    <View style={styles.shopItemView}>
      <FastImage
        style={{ width: 57, height: 57, borderRadius: 29 }}
        source={avtImg ? { uri: avtImg } : R.images.img_user}
      />
      <View
        style={{
          ...styleView.rowItem,
          alignItems: 'center',
          marginLeft: 16,
          flex: 1,
        }}
      >
        <View style={{ justifyContent: 'space-between', height: 57, flex: 1 }}>
          <Text style={{ ...fonts.medium16 }} children={data.name} />
          <Text
            numberOfLines={1}
            style={{ ...fonts.regular14, color: '#8C8C8C' }}
          >
            <Text
              style={{ color: colors.primary }}
              children={data?.count_product}
            />{' '}
            sản phẩm
            {'  '}
            <Text
              style={{ color: colors.primary }}
              children={
                Number.isInteger(data?.star)
                  ? data?.star
                  : data?.star?.toFixed(1) || 0
              }
            />{' '}
            đánh giá
          </Text>
        </View>
        {chatIcon && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onPress={() => !!onChatPress && onChatPress()}
              children={
                <FastImage
                  style={{ width: 24, height: 24 }}
                  source={R.images.icon_chat_forum}
                />
              }
            />
            <DebounceButton
              style={{
                borderWidth: 1,
                borderColor: isFollow ? 'red' : '#DDD',
                borderRadius: 20,
                marginTop: 8,
                backgroundColor: isFollow ? 'red' : 'white',
              }}
              onPress={onPressFollow}
              children={
                <Text
                  style={{
                    ...fonts.medium10,
                    marginHorizontal: 8,
                    marginVertical: 5,
                    color: isFollow === 1 ? 'white' : 'black',
                  }}
                  children={'Theo dõi'}
                />
              }
            />
          </View>
        )}
      </View>
    </View>
  )

  return (
    <Button
      disabled={!onPress}
      onPress={() => {
        !!onPress && onPress()
      }}
      children={ShopItemView}
    />
  )
}

const styles = StyleSheet.create({
  shopItemView: {
    ...styleView.rowItem,
    backgroundColor: colors.white,
    marginBottom: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
})

export default ShopItem
