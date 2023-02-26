import {
  StreamStatus,
  StreamVideoPreset,
} from '@app/screens/App/Livestream/component/types'
import React from 'react'
import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  ViewProps,
} from 'react-native'

const CustomStreamNodeKey = 'RCTCustomStream'
let RNStreamPublisher = requireNativeComponent(CustomStreamNodeKey)

export type CustomStreamPublisherHandles = {
  start?: () => void
  stop?: () => void
  switchCamera: () => void
}
export type CustomStreamPublisherProps = {
  streamKey?: string
  streamServer?: string
  shouldSetup?: boolean
  videoPreset?: StreamVideoPreset
  onStatus?: (status: StreamStatus, data?: any) => void
  onReady?: (isReady: boolean) => void
  onStreamError?: (error: any) => void
  onStreamStats?: (
    stats:
      | { fps: any; outKbps: any; data: any }
      | { data: { videodatarate: number } }
  ) => void
} & ViewProps

const StatusMapping = {
  'NetConnection.Call.BadVersion': StreamStatus.aborted,
  'NetConnection.Call.Failed': StreamStatus.aborted,
  'NetConnection.Call.Prohibited': StreamStatus.aborted,
  'NetConnection.Connect.AppShutdown': StreamStatus.aborted,
  'NetConnection.Connect.Closed': StreamStatus.connecting,
  'NetConnection.Connect.Failed': StreamStatus.aborted,
  'NetConnection.Connect.IdleTimeOut': StreamStatus.aborted,
  'NetConnection.Connect.InvalidApp': StreamStatus.aborted,
  'NetConnection.Connect.NetworkChange': StreamStatus.connecting,
  'NetConnection.Connect.Rejected': StreamStatus.aborted,
  'NetConnection.Connect.Success': StreamStatus.connecting,
  'NetStream.Publish.Start': StreamStatus.start,
}

const CustomStreamPublisher = React.forwardRef(
  (
    { onStatus, onReady, onStreamStats, ...props }: CustomStreamPublisherProps,
    ref: React.Ref<CustomStreamPublisherHandles>
  ) => {
    const playerRef = React.useRef<typeof RNStreamPublisher>()
    React.useImperativeHandle(
      ref,
      () => ({
        start: () => {
          playerRef.current &&
            UIManager.dispatchViewManagerCommand(
              findNodeHandle(playerRef.current),
              UIManager.getViewManagerConfig(CustomStreamNodeKey).Commands
                .start,
              []
            )
          // playerRef.current && playerRef.current?.start();
        },
        stop: () => {
          playerRef.current &&
            UIManager.dispatchViewManagerCommand(
              findNodeHandle(playerRef.current),
              UIManager.getViewManagerConfig(CustomStreamNodeKey).Commands.stop,
              []
            )
        },
        switchCamera: () => {
          playerRef.current &&
            UIManager.dispatchViewManagerCommand(
              findNodeHandle(playerRef.current),
              UIManager.getViewManagerConfig(CustomStreamNodeKey).Commands
                .switchCamera,
              []
            )
        },
      }),
      []
    )
    const handleStatusChanged = (e: any) => {
      const data = e.nativeEvent
      // console.log('CustomStreamPublisher', 'handleStatusChanged', data)
      const status = StatusMapping[data.code]
      onStatus && onStatus(status, data)
    }
    const handleReadyChanged = (e: any) => {
      const data = e.nativeEvent
      // console.log('CustomStreamPublisher', data)
      onReady && onReady(true)
    }
    const handleStreamStats = (e: any) => {
      const data = e.nativeEvent
      // console.log('CustomStreamPublisher', data)
      onStreamStats && onStreamStats(data)
    }
    return (
      <RNStreamPublisher
        ref={playerRef}
        onStatus={handleStatusChanged}
        onReady={handleReadyChanged}
        onStreamStats={handleStreamStats}
        {...props}
      />
    )
  }
)
export default CustomStreamPublisher
