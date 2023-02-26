import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { GIFT_TYPE } from '@app/config/Constants'
import { colors, fonts, styleView } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import FastImage from 'react-native-fast-image'

interface Props {
  data: any
  onPress?: () => void
  disable?: boolean
}

const GiftItem = ({ data, onPress, disable }: Props) => {
  return (
    <Button
      style={{ marginTop: 2 }}
      onPress={() => {
        !!onPress && onPress()
      }}
      disabled={disable || !onPress}
      children={
        <View
          style={[
            styles.listGiftView,
            { backgroundColor: disable ? 'rgba(0,0,0, .05)' : colors.white },
          ]}
        >
          <FastImage
            style={styles.giftImg}
            source={
              data?.icon_url ? { uri: data.icon_url } : R.images.image_logo
            }
            resizeMode={'cover'}
          />
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <Text
              style={{ ...fonts.medium16, color: '#262626' }}
              children={data?.name}
            />
            <View
              style={{
                width: '100%',
                ...styleView.rowItemBetween,
                marginTop: 10,
              }}
            >
              <Text
                style={{ ...fonts.regular15 }}
                children={
                  data?.df_type_gift_id == GIFT_TYPE.GIFT
                    ? `${data.type_gift_name}`
                    : `Giảm ${data?.discount_percent || 0}%`
                }
              />
              <Text
                style={{ ...fonts.regular14, color: '#595959' }}
                children={DateUtil.formatDisplayDate(data?.created_at)}
              />
            </View>
            <Text
              style={{ ...fonts.regular12, marginTop: 8, color: '#595959' }}
              children={`Số lượng: ${data?.quantity}`}
            />

            {disable && (
              <Text
                style={{
                  ...fonts.regular15,
                  color: colors.primary,
                  marginTop: 10,
                }}
                children={'Đã sử dụng'}
              />
            )}
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  listGiftView: {
    ...styleView.rowItem,
    width: '100%',
    paddingVertical: 10,
    // height: 96,
  },
  giftImg: {
    width: 96,
    height: 96,
  },
})

export default GiftItem
