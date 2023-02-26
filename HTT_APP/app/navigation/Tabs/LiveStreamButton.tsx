import R from '@app/assets/R'
import { colors, dimensions, OS } from '@app/theme'
import React, { useEffect, useMemo } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native'
const height = dimensions.height
const width = dimensions.width
interface LiveStreamButtonProps {
  style?: StyleProp<ViewStyle>
}
const LiveStreamButton = ({ style }: LiveStreamButtonProps) => {
  const shakeAnimation = new Animated.Value(1 / 6)
  const scaleAnimation = useMemo(() => new Animated.Value(1.2), [])
  const viewAnimation = useMemo(() => new Animated.Value(1.1), [])
  const rotation = React.useMemo(
    () =>
      shakeAnimation.interpolate({
        inputRange: [1 / 6, 2 / 6, 0.5, 4 / 6, 5 / 6, 1],
        outputRange: ['0deg', '-12deg', '12deg', '-12deg', '12deg', '0deg'],
      }),
    []
  )
  const startScaleIcon = (): any => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => startShake())
  }
  const startShake = (): any => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1 / 6,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() =>
      // setTimeout(() => {
      //   Animated.parallel([startScaleIcon(), startScaleView()])
      // }, 300)
      Animated.parallel([startScaleIcon(), startScaleView()])
    )
  }
  const startScaleView = () => {
    Animated.sequence([
      Animated.timing(viewAnimation, {
        toValue: 1.1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(viewAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()
  }
  useEffect(() => {
    // Animated.parallel([startScaleIcon(), startScaleView()])
    startScaleIcon()
    return () => {}
  }, [])

  return (
    <Animated.View
      style={[
        style,
        styles.liveStreamBtn,
        { transform: [{ scale: viewAnimation }] },
      ]}
    >
      <Animated.Image
        style={[
          styles.icLiveStream,
          {
            transform: [
              { rotate: rotation },
              { scale: scaleAnimation },
              // {
              //   translateX: shakeAnimation,
              // },
            ],
          },
        ]}
        source={R.images.ic_live_stream}
      />
    </Animated.View>
  )
}

export default LiveStreamButton

const styles = StyleSheet.create({
  liveStreamBtn: {
    bottom: OS === 'ios' ? -2 : 10,
    width: width * 0.133,
    height: width * 0.133,
    backgroundColor: colors.primary,
    borderRadius: (width * 0.133) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icLiveStream: { width: 50, height: 50 },
})
