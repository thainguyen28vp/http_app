// import NavigationUtil from '@app/navigation/NavigationUtil'
// import { useAppDispatch, useAppSelector } from '@app/store'
// import React from 'react'
// import { View } from 'react-native'
// import {
//   RtcRemoteView,
//   VideoRemoteState,
//   VideoRenderMode,
// } from 'react-native-agora'
// import { getListLiveStreamThunk } from '../slice/LiveStreamSlice'
// import { styles } from '../styles'
// import { STATUS_LIST_LIVE } from '../WatchingScreen'
// import LoadingLiveCustomer from './LoadingLiveCustomer'

// const VideoWatching = (props: any) => {
//   const { uid, channelId, AgoraEngine } = props
//   const appDispatch = useAppDispatch()
//   const { videoState, userOffileState } = useAppSelector(
//     state => state.LiveReducer
//   )

//   const handleBackOffStream = async () => {
//     await AgoraEngine?.leaveChannel()
//     await AgoraEngine?.destroy()
//     appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
//     setTimeout(() => {
//       NavigationUtil.goBack()
//     }, 200)
//   }
//   if (
//     videoState === VideoRemoteState.Decoding ||
//     videoState === VideoRemoteState.Starting
//   )
//     return (
//       <View style={styles.vContainWatching}>
//         <RtcRemoteView.SurfaceView
//           uid={uid}
//           style={styles.fullscreen}
//           channelId={channelId}
//           renderMode={VideoRenderMode.Hidden}
//           zOrderMediaOverlay={true}
//         />
//       </View>
//     )
//   if (videoState === VideoRemoteState.Frozen)
//     return (
//       <LoadingLiveCustomer
//         hide
//         title={'Đường truyền mạng không ổn định! Xin vui lòng đợi.'}
//         handleBackOffStream={handleBackOffStream}
//       />
//     )
//   if (videoState === VideoRemoteState.Stopped || userOffileState == 1)
//     return (
//       <LoadingLiveCustomer
//         hide
//         title={'Video bị gián đoạn! Xin vui lòng đợi.'}
//         handleBackOffStream={handleBackOffStream}
//       />
//     )
//   return null
// }

// export default VideoWatching

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const VideoWatching = () => {
  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default VideoWatching

const styles = StyleSheet.create({})
