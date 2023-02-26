import {
  CustomStreamPublisherHandles,
  CustomStreamPublisherProps,
} from '@app/lib/CustomStream/CustomStreamPublisher'
import React from 'react'
import { NativeModules, requireNativeComponent } from 'react-native'

const { CustomModule } = NativeModules
const RCTCustomCamera = requireNativeComponent('RCTCameraAndroid')

const CustomLiveAndroid = React.forwardRef(
  (
    { onStatus, onReady, onStreamStats, ...props }: CustomStreamPublisherProps,
    ref: React.Ref<CustomStreamPublisherHandles>
  ) => {
    const playerRef = React.useRef<typeof RCTCustomCamera>()

    const handleStatusChanged = (e: any) => {
      const data = e.nativeEvent
      console.log('CustomStreamPublisher', 'handleStatusChanged', data)
      const status = data.status
      onStatus && onStatus(status, data)
    }
    const handleReadyChanged = (e: any) => {
      const data = e.nativeEvent
      console.log('handleReadyChanged', data)
      onReady && onReady(true)
    }
    const handleStreamStats = (e: any) => {
      const data = e.nativeEvent
      // console.log('handleStreamStats', data)
      onStreamStats &&
        onStreamStats({ data: { videodatarate: data?.videodatarate } })
    }

    React.useImperativeHandle(
      ref,
      () => ({
        switchCamera: () => {
          playerRef.current && CustomModule.switchCamera()
        },
        stop: () => {
          playerRef.current && CustomModule.stopLive()
        },
        start: () => {
          playerRef.current && CustomModule.startLive()
        },
      }),
      []
    )

    return (
      <RCTCustomCamera
        {...props}
        ref={playerRef}
        onStatus={handleStatusChanged}
        onReady={handleReadyChanged}
        onStreamStats={handleStreamStats}
      />
    )
  }
)
export default CustomLiveAndroid
