import R from '@app/assets/R'
import DateUtil from '@app/utils/DateUtil'
import { formatPrice } from '@app/utils/FuncHelper'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import Line from '../../Shop/components/Line'
import { styles } from '../styles'

const MyLiveItem = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const Reacttion = ({
    source,
    value,
  }: {
    source: Source
    value: string | number | undefined
  }) => {
    return (
      <View style={styles.vItemReaction}>
        <FastImage
          source={source}
          style={styles.vImgReaction}
          tintColor={'#595959'}
        />
        <Text style={styles.txtReaction} children={value} />
      </View>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.vItemMyLive}>
      <View style={styles.vContentMyLive}>
        <FastImage
          source={{ uri: item.cover_image_url }}
          style={styles.vImgLive}
        >
          <FastImage source={R.images.img_play} style={styles.vImgPlay} />
        </FastImage>
        <View style={styles.vContent}>
          <Text
            numberOfLines={3}
            style={styles.txtTitle}
            children={item?.title || R.strings().not_update}
          />
          <Text
            style={styles.txtTime}
            children={DateUtil.formatTimeDate(item.create_at)}
          />
          <View style={styles.vReactionMyLive}>
            <Reacttion
              source={R.images.img_show}
              value={formatPrice(item.count_viewed) || 0}
            />
            <Reacttion
              source={R.images.img_comment}
              value={formatPrice(item.count_comment) || 0}
            />
            <Reacttion
              source={R.images.img_interative}
              value={formatPrice(item.count_reaction) || 0}
            />
          </View>
        </View>
      </View>
      <Line size={4} />
    </TouchableOpacity>
  )
}

export default MyLiveItem
