import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import CustomStreamPublisher, {
  CustomStreamPublisherHandles,
} from '@app/lib/CustomStream/CustomStreamPublisher'
import { styles } from '../Livestream/styles'
import { StreamStatus, StreamVideoPreset } from '../Livestream/component/types'

const CameraTest = () => {
  const playerRef = useRef<CustomStreamPublisherHandles>()
  const refVb = useRef<any>(null)

  const handleIOSVideoStatus = useCallback((code: StreamStatus) => {
    console.log('status', code, StreamStatus[code])
    if (code === StreamStatus.start) {
    }
  }, [])
  const handleStreamStats = useCallback(stats => {
    console.log!('STATUS:', stats)
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <CustomStreamPublisher
        style={styles.liveView}
        ref={playerRef}
        shouldSetup={true}
        onReady={v => {
          console.log('onReady', v)
          if (v) {
            refVb.current?.start()
          }
        }}
        videoPreset={StreamVideoPreset.yt_hd_720p_30fps_2mbps}
        streamKey={'8djs-ep9h-vfqq-9acw-cwu7'}
        streamServer={'rtmp://a.rtmp.youtube.com/live2/'}
        onStatus={handleIOSVideoStatus}
        onStreamStats={handleStreamStats}
      />
    </View>
  )
}

export default CameraTest
