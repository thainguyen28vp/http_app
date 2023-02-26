import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import { LIVESTREAM_STATUS } from '@app/config/Constants'
import { colors, fonts, WIDTH } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import { formatPrice } from '@app/utils/FuncHelper'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import { LiveStremItemProps } from '../props'
import { styles } from '../styles'

const LiveStreamItem = ({
  item,
  index,
  onPress,
  status,
}: {
  item: LiveStremItemProps
  index: number
  status?: number
  onPress: () => void
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginRight: index % 2 !== 0 ? 0 : 15,
        marginTop: 15,
      }}
    >
      <FstImage
        source={{ uri: item.cover_image_url }}
        style={{ width: WIDTH / 2.2, height: WIDTH / 2.2, borderRadius: 5 }}
        resizeMode={'cover'}
      />
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 12,
          flexDirection: 'row',
          borderRadius: 5,
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      >
        <Text
          style={{
            backgroundColor:
              status == LIVESTREAM_STATUS.STREAMING
                ? colors.primary
                : '#D5A227',
            ...fonts.regular14,
            color: colors.white,
            paddingVertical: 3,
            paddingHorizontal: 5,
          }}
          children={`• ${
            status == LIVESTREAM_STATUS.STREAMING
              ? 'Live'
              : DateUtil.formatShortDate(item.start_at)
          }`}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 4,
            paddingLeft: 2,
            paddingRight: 4,
            alignItems: 'center',
          }}
        >
          <FastImage
            source={R.images.img_eye}
            style={{ width: 15, height: 15 }}
            resizeMode={'contain'}
          />
          <Text
            style={{ color: colors.white, ...fonts.regular12, marginLeft: 3 }}
            children={formatPrice(item?.count_viewed) || 0}
          />
        </View>
      </View>
      <FastImage
        source={R.images.img_shadow}
        style={{
          width: '100%',
          height: '80%',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'flex-end',
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          // overflow: 'hidden',
        }}
      >
        <View style={{ bottom: 8, paddingHorizontal: 10 }}>
          <Text
            numberOfLines={2}
            style={{ color: colors.white, ...fonts.semi_bold14 }}
            children={item?.title}
          />
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <FastImage
              source={
                item?.Shop?.profile_picture_url
                  ? { uri: item?.Shop?.profile_picture_url }
                  : R.images.img_user
              }
              style={{ width: 24, height: 24, borderRadius: 24 / 2 }}
            />
            <Text
              style={{
                color: colors.white,
                ...fonts.semi_bold14,
                marginLeft: 6,
                flex: 1,
                marginTop: 2,
              }}
              children={item?.Shop?.name}
            />
          </View>
        </View>
      </FastImage>
    </TouchableOpacity>
  )
}

export default LiveStreamItem
