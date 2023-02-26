import { colors, dimensions, OS, WIDTH } from '@app/theme'
import React, { useCallback } from 'react'
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { scale, StyleSheet } from 'react-native-size-scaling'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '../FstImage/FstImage'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import FastImage from 'react-native-fast-image'

const BannerHome = ({ listBanner }: any) => {
  const { width, height } = useWindowDimensions()
  const renderItemBanner = useCallback(
    ({ item }: { item: any; index: number }) => {
      return (
        <TouchableOpacity
          style={{
            width: width,
            paddingHorizontal: 10,
          }}
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
              type: 2,
              item,
              id: item.id,
            })
          }}
          children={
            <FastImage
              source={{ uri: item?.image_url }}
              style={{
                width: width - 20,
                aspectRatio: (width - 20) / 226,
                borderRadius: 10,
              }}
              resizeMode={'cover'}
            />
          }
        />
      )
    },
    []
  )
  const keyExtractor = useCallback(item => `${item.id}`, [])

  return (
    <>
      {listBanner && !!listBanner.length && (
        <View style={styles.vBanner}>
          <SwiperFlatList
            paginationStyle={{ bottom: -5 }}
            paginationStyleItemInactive={{ width: 4, height: 4 }}
            paginationStyleItemActive={{ width: 6, height: 6 }}
            autoplay
            autoplayLoop
            index={0}
            showPagination={true}
            data={listBanner}
            renderItem={renderItemBanner}
            paginationDefaultColor={'#D8D8D8'}
            paginationActiveColor={colors.primary}
            paginationStyleItem={styles.normalDot}
            keyExtractor={keyExtractor}
          />
        </View>
      )}
    </>
  )
}

export default BannerHome

const styles = StyleSheet.create({
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  v_pagination: {
    paddingTop: 0,
  },
  vBanner: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 10,
  },
})
