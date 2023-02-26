import { dimensions } from '@app/theme'
import React, { useCallback, useRef, useState } from 'react'
import { View, Animated } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import reactotron from 'reactotron-react-native'
// import Animated, {
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   runOnJS,
// } from 'react-native-reanimated'

const { width } = dimensions

interface Props {
  url: string
}

// const ImageItem = (props: Props) => {
//   const { url } = props
//   const [enablePanGesture, setEnablePanGesture] = useState<boolean>(false)

//   const scale = useSharedValue(1)
//   const translateX = useSharedValue(0)

//   const AnimatedView = Animated.createAnimatedComponent(View)

//   const setEnablePanGestureHandle = useCallback(value => {
//     console.log(value)
//     if (value > 1) setEnablePanGesture(true)
//     else if (value == 1) setEnablePanGesture(false)
//   }, [])

//   const handleOnPinch =
//     useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
//       onActive: event => {
//         if (event.scale > 1) {
//           scale.value = event.scale
//           // runOnJS(setEnablePanGestureHandle)(scale.value)
//         }
//       },
//       onEnd: () => {
//         // scale.value = 1
//         runOnJS(setEnablePanGestureHandle)(scale.value)
//       },
//     })

//   const handleOnPan = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
//     onActive: event => {
//       translateX.value = event.translationX
//     },
//   })

//   const rStyle = useAnimatedStyle(() => {
//     'worklet'
//     return {
//       transform: [{ scale: scale.value }],
//     }
//   })

//   const tStyle = useAnimatedStyle(() => {
//     'worklet'
//     return {
//       transform: [{ translateX: translateX.value }],
//     }
//   })

//   return (
//     <PanGestureHandler enabled={enablePanGesture} onGestureEvent={handleOnPan}>
//       <AnimatedView>
//         <PinchGestureHandler onGestureEvent={handleOnPinch}>
//           <AnimatedView style={[{ width, aspectRatio: 1 }, tStyle, rStyle]}>
//             <FastImage
//               style={{ width: '100%', height: '100%' }}
//               resizeMode={'contain'}
//               source={{ uri: url }}
//             />
//           </AnimatedView>
//         </PinchGestureHandler>
//       </AnimatedView>
//     </PanGestureHandler>
//   )
// }

const ImageItem = (props: Props) => {
  const { url } = props
  const [enablePanGesture, setEnablePanGesture] = useState<boolean>(false)

  const scale = useRef(new Animated.Value(1)).current
  const translateX = useRef(new Animated.Value(0)).current

  const AnimatedView = Animated.createAnimatedComponent(View)

  const handleOnPinch = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  })

  const handleOnPan = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  )
  reactotron.logImportant!('url', url)
  return (
    <PanGestureHandler enabled={enablePanGesture} onGestureEvent={handleOnPan}>
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
              style={{ width: '100%', height: '100%' }}
              resizeMode={'contain'}
              source={{ uri: url }}
            />
          </AnimatedView>
        </PinchGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  )
}

export default ImageItem
