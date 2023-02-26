import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import { LIVESTREAM_STATUS } from '@app/config/Constants'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'

const { height } = dimensions
interface LiveItemProp {
  data: any
}

const ShopLiveItem = ({ data }: LiveItemProp) => {
  const renderLiveState = () => {
    const liveExist = <View></View>
    const liveRecord = (
      <View
        style={{
          paddingHorizontal: 6,
          paddingVertical: 3,
          backgroundColor: 'rgba(0,0,0,.7)',
          borderRadius: 6,
        }}
      >
        <Text
          style={{ color: colors.white }}
          children={DateUtil.formatTimeDate(data?.create_at)}
        />
      </View>
    )

    return data.status == LIVESTREAM_STATUS.FINISHED ? liveRecord : liveExist
  }

  return (
    <View style={styles.liveItemView}>
      <FastImage
        style={styles.liveItemImg}
        source={{ uri: data.cover_image_url }}
      />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ marginTop: 15, marginLeft: 15, ...styleView.rowItem }}>
          {renderLiveState()}
          <View style={{ flex: 1 }} />
        </View>
        <View
          style={{
            width: '100%',
            paddingBottom: 15,
            paddingLeft: 15,
          }}
        >
          <Text
            style={{ ...fonts.medium18, color: colors.white, marginBottom: 10 }}
            children={`${data.title}`}
          />
          <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
            <FastImage
              style={{ width: 20, height: 20 }}
              source={R.images.img_view}
            />
            <Text
              style={{ ...fonts.regular14, marginLeft: 4, color: colors.white }}
              children={`${data.count_viewed}`}
            />
            <FastImage
              style={{ width: 20, height: 20, marginLeft: 10 }}
              tintColor={colors.white}
              source={R.images.ic_chat_live}
            />
            <Text
              style={{ ...fonts.regular16, marginLeft: 4, color: colors.white }}
              children={data.count_comment}
            />
            <FastImage
              style={{ width: 20, height: 20, marginLeft: 10 }}
              tintColor={colors.white}
              source={R.images.ic_heart}
            />
            <Text
              style={{ ...fonts.regular16, marginLeft: 4, color: colors.white }}
              children={data.count_reaction}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const ShopLivestreamTab = (props: any) => {
  const { data, isLoading, onRefresh } = props

  if (isLoading) return <Loading />

  return (
    <FlatList
      data={data.rows}
      refreshing={isLoading}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      keyExtractor={(_, index) => `${index}`}
      contentContainerStyle={{
        paddingBottom: isIphoneX() ? 20 : 0,
        paddingHorizontal: 15,
      }}
      renderItem={({ item, _ }) => <ShopLiveItem data={item} />}
      ListEmptyComponent={
        <Empty
          imageStyle={{ height: height / 4 }}
          backgroundColor={'transparent'}
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  liveItemView: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginTop: 16,
  },
  liveItemImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    zIndex: -1,
  },
})

export default ShopLivestreamTab
