import React, { useEffect } from 'react'
import { StyleSheet, Easing, Animated } from 'react-native'
import R from '@app/assets/R'

export interface EmotionProps {
  source?: string
  style?: any
}

export const Emotion: React.FC<EmotionProps> = React.memo(props => {
  let { source, style, ...rest } = props
  const animated = new Animated.Value(1)
  const iconMoveX = animated.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    // inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 10, -15, 0],
    // outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  })
  const iconMoveY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 896],
    extrapolate: 'clamp',
  })
  const iconScale = animated.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 1.2, 1.3, 1.4, 1.5],
    extrapolate: 'clamp',
  })
  const opacity = animated.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [2.5, 2, 1.5, 1, 0],
  })
  useEffect(() => {
    _run()
  }, [])

  const _run = () => {
    Animated.timing(animated, {
      toValue: 0,
      duration: 5000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.Image
      style={[
        styles.icon,
        {
          transform: [
            { translateX: iconMoveX },
            { translateY: iconMoveY },
            { scale: iconScale },
          ],
          opacity,
        },
        style,
      ]}
      // source={!!source ? { uri: source } : Images.ic_mapPin}
      source={source}
      {...rest}
    />
  )
})

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    position: 'absolute',
    right: 10,
    top: -20,
  },
})
