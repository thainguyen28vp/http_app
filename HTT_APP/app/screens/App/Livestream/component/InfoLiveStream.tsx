import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useContext } from 'react'
import { styles } from '../styles'
import isEqual from 'react-fast-compare'
import reactotron from 'reactotron-react-native'
import {
  useInfoStreaming,
  useUpdateProductSell,
} from '../context/YoutubeLIveContext'

const InfoLiveStream = memo((props: any) => {
  const { status, stats } = props

  return (
    <View style={styles.statsContainer}>
      {/* <Text style={styles.statsText}>{status}</Text> */}
      {/* <Text style={styles.statsText}>Tốc độ: {stats.data?.videodatarate}</Text> */}
      <Text style={styles.statsText}>Số khung hình: {stats.fps}</Text>
      <Text style={styles.statsText}>
        Tốc độ phát live: {stats.outKbps} Kbps
      </Text>
      {/* <Text style={styles.statsText}>
        Độ phân giải: {`${stats.data?.width}x${stats.data?.height}`}
      </Text> */}
    </View>
  )
}, isEqual)

export default InfoLiveStream
