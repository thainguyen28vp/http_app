import React, { useState, useRef, memo, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, dimensions, fonts } from '@app/theme'
import Video from 'react-native-video'
import R from '@app/assets/R'
import FastImage from 'react-native-fast-image'
import { MEDIA_TYPE } from './hooks/useMediaData'
import ImageItem from './ImageItem'
import reactotron from 'ReactotronConfig'

const THUMB_SIZE = 75
const { width } = dimensions

const MediaViewerComponent = ({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) => {
  const { data, index, currentTime } = route.params

  reactotron.logImportant!('data', data)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoPause, setVideoPause] = useState<boolean>(false)
  const videoRef = useRef<Video>(null)
  const mediaSwiperRef = useRef<FlatList>(null)
  const thumbnailRef = useRef<FlatList>(null)
  const onViewRef = useRef((viewableItems: any) => {
    setCurrentIndex(viewableItems.viewableItems[0].index)
    setVideoPause(viewableItems.viewableItems[0].item.type != MEDIA_TYPE.VIDEO)
    thumbnailRef.current?.scrollToOffset({
      offset: viewableItems.viewableItems[0].index * THUMB_SIZE,
      animated: true,
    })
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  const onVideoLoad = videoData => {
    if (currentTime && typeof currentTime.current == 'number')
      videoRef.current?.seek(currentTime.current)
  }

  const _renderMediaItem = ({ item, index }: { item: any; index: number }) => {
    reactotron.logImportant!(item)
    return item.type == MEDIA_TYPE.IMAGE ? (
      <ImageItem key={index} url={item?.url || item?.image_url} />
    ) : item.type == MEDIA_TYPE.VIDEO ? (
      <Video
        controls
        ref={videoRef}
        paused={videoPause}
        onLoad={onVideoLoad}
        source={{
          uri: item.url,
        }}
        style={{ width, aspectRatio: 1920 / 1080 }}
      />
    ) : null
  }

  const _renderThumbnailItem = ({
    item,
    index,
  }: {
    item: any
    index: number
  }) => {
    const thumbnailItemView =
      item.type == MEDIA_TYPE.IMAGE ? (
        <FastImage
          style={[
            styles.thumbnailItem,
            {
              borderWidth: index === currentIndex ? 4 : 0.75,
              borderColor: index === currentIndex ? colors.primary : 'white',
              opacity: index === currentIndex ? 1 : 0.8,
            },
          ]}
          source={{ uri: item.url }}
        />
      ) : item.type == MEDIA_TYPE.VIDEO ? (
        <>
          <View style={{ alignItems: 'center' }}>
            <Video
              paused
              source={{
                uri: item.url,
              }}
              style={[
                styles.thumbnailItem,
                {
                  borderWidth: index === currentIndex ? 4 : 0.75,
                  borderColor:
                    index === currentIndex ? colors.primary : 'white',
                  opacity: index === currentIndex ? 1 : 0.8,
                },
              ]}
            />
            <FastImage
              style={{
                position: 'absolute',
                width: 24,
                height: 24,
                alignSelf: 'center',
                top: '35%',
              }}
              source={R.images.ic_play}
            />
          </View>
        </>
      ) : null

    return (
      <TouchableOpacity
        onPress={() => onThumbnailPress(index)}
        activeOpacity={0.9}
        children={thumbnailItemView}
      />
    )
  }

  const onThumbnailPress = (index: number) => {
    if (index == currentIndex) return

    mediaSwiperRef.current?.scrollToIndex({ index, animated: true })
  }

  useEffect(() => {
    mediaSwiperRef.current?.scrollToIndex({ index, animated: true })
  }, [index])

  return (
    <View style={styles.container}>
      <FlatList
        ref={mediaSwiperRef}
        style={{ width }}
        data={data}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: 'center' }}
        renderItem={_renderMediaItem}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(_, index) => `${index}`}
        initialNumToRender={data.length}
        snapToAlignment="center"
        decelerationRate="normal"
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            mediaSwiperRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            }),
              300
          })
        }}
      />

      <FlatList
        ref={thumbnailRef}
        horizontal={true}
        data={data}
        style={{ position: 'absolute', bottom: 50, width }}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        keyExtractor={(_, index) => `${index}`}
        renderItem={_renderThumbnailItem}
      />
      <View
        style={{
          position: 'absolute',
          top: 50,
        }}
      >
        <Text
          style={{
            color: 'white',
            ...fonts.semi_bold16,
          }}
        >
          {currentIndex + 1} / {data.length}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => NavigationUtil.goBack()}
        style={{ position: 'absolute', top: 50, right: 30 }}
        children={
          <FastImage
            style={{ width: 24, height: 24 }}
            tintColor="#fff"
            source={R.images.ic_close}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  thumbnailItem: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 16,
  },
})

const MediaViewer = memo(MediaViewerComponent)

export default MediaViewer
