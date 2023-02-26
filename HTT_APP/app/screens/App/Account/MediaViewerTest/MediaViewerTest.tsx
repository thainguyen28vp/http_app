import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import { dimensions, styleView } from '@app/theme'
import React, { useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import FastImage from 'react-native-fast-image'
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'

interface Props {}

const { width } = dimensions

const MediaItem = (props: any) => {
  const AnimatedView = Animated.createAnimatedComponent(View)

  const scale = useRef(new Animated.Value(1)).current
  const translateX = useRef(new Animated.Value(0)).current

  const handleOnPinch = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  })

  const handleOnPan = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  )

  return (
    <View
      key={props.key}
      style={{ width: '100%', height: '100%', ...styleView.centerItem }}
    >
      {/* <FstImage
        style={{ width, aspectRatio: 1 }}
        source={R.images.img_product}
      /> */}
      <PanGestureHandler onGestureEvent={handleOnPan}>
        <AnimatedView>
          <PinchGestureHandler onGestureEvent={handleOnPinch}>
            <AnimatedView
              style={{
                width,
                aspectRatio: 1,
                transform: [{ scale }, { translateX }],
              }}
            >
              <FastImage
                style={{ width, aspectRatio: 1 }}
                resizeMode={'contain'}
                source={R.images.img_product}
              />
            </AnimatedView>
          </PinchGestureHandler>
        </AnimatedView>
      </PanGestureHandler>
    </View>
  )
}

const MediaViewerTest = (props: Props) => {
  return (
    <PagerView style={{ flex: 1 }} onPageScroll={event => console.log(event)}>
      <MediaItem key={'1'} />
      <MediaItem key={'2'} />
    </PagerView>
  )
}

const styles = StyleSheet.create({})

export default MediaViewerTest
