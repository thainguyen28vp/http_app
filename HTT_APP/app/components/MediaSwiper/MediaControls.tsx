import R from '@app/assets/R'
import React, {
  useEffect,
  useState,
  useRef,
  LegacyRef,
  useCallback,
  memo,
} from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import Video from 'react-native-video'
import * as Animatable from 'react-native-animatable'

interface Props {
  mediaPause: boolean
  useMediaPause: (paused: boolean) => void
  videoControlHideTime?: number
  doubleTap?: () => void
  children: (playerRef: LegacyRef<Video>, isMute: boolean) => React.ReactNode
}

const MediaControlComponent = (props: Props) => {
  const {
    children,
    videoControlHideTime = 3000,
    doubleTap,
    mediaPause,
    useMediaPause,
  } = props
  const controlFadeValue = useSharedValue(0)
  const controlsHider = useRef<any>(0)
  const [showMediaControl, setShowMediaControl] = useState<boolean>(true)
  const playerRef = useRef<Video>(null)
  const doubleTapRef = useRef()
  const [isMute, setIsMute] = useState<boolean>(true)

  const toggleControl = () => setShowMediaControl(prev => !prev)

  useEffect(() => {
    toggleControl()
  }, [])

  useEffect(() => {
    controlFadeValue.value = withTiming(showMediaControl ? 1 : 0, {
      duration: 400,
    })
    if (showMediaControl) {
      clearTimeout(controlsHider.current)
      controlsHider.current = setTimeout(() => {
        setShowMediaControl(false)
      }, videoControlHideTime)
    }
    return () => {
      clearTimeout(controlsHider.current)
    }
  }, [showMediaControl])

  const animatedControlStyle = useAnimatedStyle(() => ({
    opacity: controlFadeValue.value,
  }))

  const onPlayButtonPress = () => {
    useMediaPause!(!mediaPause)
  }

  const onVolumePress = () => {
    setIsMute(prev => !prev)
  }

  return (
    <>
      <TapGestureHandler
        waitFor={doubleTapRef}
        onActivated={() => toggleControl()}
      >
        <TapGestureHandler
          maxDelayMs={200}
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={doubleTap}
        >
          <View style={styles.wrapper}>
            <Animated.View
              style={[styles.controls, animatedControlStyle]}
              pointerEvents={showMediaControl ? undefined : 'none'}
            >
              <View style={styles.centerControl}>
                <TapGestureHandler
                  onActivated={onPlayButtonPress}
                  children={
                    <Animatable.Image
                      animation="fadeIn"
                      style={styles.icon}
                      source={
                        !mediaPause ? R.images.ic_pause : R.images.ic_play
                      }
                    />
                  }
                />
              </View>
            </Animated.View>
            {children(playerRef, isMute)}
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
      <TapGestureHandler
        onActivated={onVolumePress}
        children={
          <Animatable.Image
            animation="fadeIn"
            style={styles.icSound}
            source={isMute ? R.images.ic_sound_off : R.images.ic_sound_on}
          />
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  centerControl: {},
  icon: {
    width: 67,
    height: 67,
  },
  icSound: {
    position: 'absolute',
    width: 30,
    height: 30,
    zIndex: 3,
    bottom: 30,
    right: 15,
  },
})

const MediaControls = memo(MediaControlComponent)

export default MediaControls
