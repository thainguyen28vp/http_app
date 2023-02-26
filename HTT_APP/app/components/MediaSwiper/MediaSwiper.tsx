import React, { useRef, useState, useEffect, memo } from 'react'
import { View, FlatList, ViewStyle } from 'react-native'
import { colors, dimensions } from '@app/theme'
import Video from 'react-native-video'
import useMediaData, { MediaItem, MEDIA_TYPE } from './hooks/useMediaData'
import MediaControls from './MediaControls'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import NavigationUtil from '@app/navigation/NavigationUtil'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import mergeRefs from 'react-merge-refs'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '../FstImage/FstImage'
import reactotron from 'reactotron-react-native'

const { width } = dimensions

interface Props {
  style?: ViewStyle
  data: Array<any>
  itemWidth?: number
  aspectRatio?: number
  showIndicator?: boolean
  indicatorStyle?: ViewStyle
  indicatorDistance?: number
  indicatorBottomDistance?: number
  activeDotColor?: string
  inactiveDotColor?: string
}

const MediaSwiperComponent = (props: Props) => {
  const {
    style,
    data,
    itemWidth,
    showIndicator = true,
    indicatorBottomDistance,
    indicatorDistance,
    indicatorStyle,
    activeDotColor = colors.primary,
    inactiveDotColor = colors.white,
  } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoPause, setVideoPause] = useState<boolean>(false)
  const { dataMedia } = useMediaData(data)
  const onViewRef = useRef((viewableItems: any) => {
    setVideoPause(viewableItems.viewableItems[0].item.type != MEDIA_TYPE.VIDEO)
    setCurrentIndex(viewableItems.viewableItems[0].index)
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })
  const currentTime = useRef<number>()
  const videoRef = useRef<Video>(null)
  const isVideoEnd = useRef<boolean>(false)

  const renderMediaItem = ({
    item,
    index,
  }: {
    item: MediaItem
    index: number
  }) => {
    const imageView = (
      <TouchableWithoutFeedback
        onPress={() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.MEDIA_VIEWER, {
            data: dataMedia.filter(item => item.type !== MEDIA_TYPE.OTHER),
            index,
            currentTime: currentTime ? currentTime : 0,
          })
        }}
      >
        <FstImage
          style={{ width: itemWidth, aspectRatio: 1, borderRadius: 5 }}
          source={{ uri: item.url }}
        />
      </TouchableWithoutFeedback>
    )

    const videoView = (
      <MediaControls
        mediaPause={videoPause}
        useMediaPause={setVideoPause}
        doubleTap={() => {
          setVideoPause(true)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.MEDIA_VIEWER, {
            data: dataMedia.filter(item => item.type !== MEDIA_TYPE.OTHER),
            index,
            currentTime,
          })
        }}
        children={(playerRef, isMute) => (
          <Video
            resizeMode="contain"
            ref={mergeRefs([playerRef, videoRef])}
            paused={videoPause}
            onEnd={() => {
              isVideoEnd.current = true
              setVideoPause(true)
            }}
            volume={isMute ? 0 : 1}
            onProgress={data => (currentTime.current = data.currentTime)}
            style={{
              width: itemWidth,
              aspectRatio: 1,
              borderRadius: 5,
              backgroundColor: 'rgba(102, 107, 122, .3)',
            }}
            source={{ uri: item.url }}
          />
        )}
      />
    )
    return (
      <View
        // style={{ backgroundColor: 'red' }}
        children={
          item.type == MEDIA_TYPE.IMAGE
            ? imageView
            : item.type == MEDIA_TYPE.VIDEO
            ? videoView
            : null
        }
      />
    )
  }

  const renderIndicator = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={[
          {
            width: 8,
            height: 8,
            backgroundColor:
              index == currentIndex ? activeDotColor : inactiveDotColor,
            borderRadius: 4,
          },
          indicatorStyle,
        ]}
      />
    )
  }

  useEffect(() => {
    if (isVideoEnd.current && videoPause) {
      videoRef.current?.seek(0)
      isVideoEnd.current = false
    }
  }, [videoPause])
  return (
    <View style={style}>
      {Boolean(dataMedia.filter(item => item.type != undefined).length) ? (
        <>
          <FlatList
            data={dataMedia}
            // style={{ backgroundColor: 'rgba(0, 0, 0, .3)' }}
            horizontal
            pagingEnabled
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            renderItem={renderMediaItem}
          />
          {showIndicator && (
            <FlatList
              data={dataMedia}
              horizontal
              scrollEnabled={false}
              style={{
                position: 'absolute',
                bottom: indicatorBottomDistance || 20,
              }}
              contentContainerStyle={{
                justifyContent: 'center',
                flex: 1,
              }}
              scrollEventThrottle={16}
              ItemSeparatorComponent={() => (
                <View style={{ width: indicatorDistance || 8 }} />
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `${index}`}
              renderItem={renderIndicator}
            />
          )}
        </>
      ) : (
        <FastImage
          style={{ width, aspectRatio: 1 }}
          source={R.images.ic_default}
        />
      )}
    </View>
  )
}

const MediaSwiper = memo(MediaSwiperComponent)

export default MediaSwiper
