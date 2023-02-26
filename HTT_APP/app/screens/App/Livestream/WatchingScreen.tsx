// import R from '@app/assets/R'
// import LoadingProgress from '@app/components/LoadingProgress'
// import {
//   EMOTIONS,
//   LIVESTREAM_EVENT,
//   LIVESTREAM_STATUS,
//   TYPE_ITEM,
// } from '@app/config/Constants'
// import NavigationUtil from '@app/navigation/NavigationUtil'
// import {
//   requestCreateCommentLive,
//   requestLeaveLive,
//   requestReaction,
// } from '@app/service/Network/livestream/LiveStreamApi'
// import { useAppDispatch, useAppSelector } from '@app/store'
// import { OS, WIDTH } from '@app/theme'
// import { showConfirm } from '@app/utils/AlertHelper'
// import { callAPIHook } from '@app/utils/CallApiHelper'
// import { handleShareSocial, randomIntFromInterval } from '@app/utils/FuncHelper'
// import { showMessages } from '@app/utils/GlobalAlertHelper'
// import { requestCameraAndAudioPermission } from '@app/utils/Permission'
// import { useNavigation } from '@react-navigation/core'
// import React, {
//   memo,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react'
// import isEqual from 'react-fast-compare'
// import { BackHandler, Keyboard, KeyboardAvoidingView, View } from 'react-native'
// import RtcEngine, {
//   ChannelProfile,
//   ClientRole,
//   RtcEngineContext,
//   UserOfflineReason,
//   VideoRemoteState,
// } from 'react-native-agora'
// import KeepAwake from 'react-native-keep-awake'
// import reactotron from 'ReactotronConfig'
// import io, { Socket } from 'socket.io-client'
// import { DataUserInfoProps } from '../Account/Model'
// import BottomModalWatching from './component/BottomModalWatching'
// import ButtonReaction from './component/ButtonReaction'
// import FinishLive from './component/FinishLive'
// import HeaderLiveWatching from './component/HeaderLiveWatching'
// import InputCommentWatching from './component/InputCommentWatching'
// import ListCommentWatching from './component/ListCommentWatching'
// import ListProductHozironWatching from './component/ListProductHozironWatching'
// import { getVideoRemoteState } from './component/LiveStreamState'
// import LoadingLiveCustomer from './component/LoadingLiveCustomer'
// import Reaction from './component/Reaction'
// import VideoWatching from './component/VideoWatching'
// import {
//   updateNameProductComment,
//   updateShowModalBottom,
//   updateUserOffileState,
//   updateVideoState,
// } from './slice/LiveSlice'
// import { getListLiveStreamThunk } from './slice/LiveStreamSlice'
// import { styles } from './styles'

// const {
//   SERVER_STOP_LIVESTREAM,
//   REACTION,
//   COMMENT,
//   DELETE_COMMENT,
//   COUNT_SUBSCRIBER,
//   CREATE_UPDATE_PRODUCT,
//   HIGHLIGHT_PRODUCT,
//   DELETE_PRODUCT,
//   SHOP_STOP_LIVESTREAM,
// } = LIVESTREAM_EVENT
// const { notification, confirm_close_live_cus, ok } = R.strings()
// export const STATUS_LIST_LIVE = {
//   status: LIVESTREAM_STATUS.STREAMING,
// }
// const WatchingScreenComponent = (props: any) => {
//   const {
//     LivestreamProducts,
//     count_viewed,
//     count_subcriber,
//     shop,
//     highlightProduct,
//     livestream_id,
//     channelId,
//     token,
//     appId,
//     tokenUser,
//     shopId,
//   } = props.route.params
//   const socket = useMemo<Socket>(() => {
//     return io('http://api.ogo.winds.vn/', {
//       auth: { token: tokenUser },
//     })
//   }, [])
//   const navigation = useNavigation()
//   const appDispatch = useAppDispatch()
//   const [config, setConfig] = useState({
//     appId: appId,
//     token: token,
//     channelId: channelId,
//   })

//   const [isReady, setIsReady] = useState(false)
//   const [joined, setJoined] = useState(false)
//   const AgoraEngine = useRef<RtcEngine>()
//   const userInfo = useAppSelector<DataUserInfoProps>(
//     state => state.accountReducer.data
//   )

//   const [isLoading, setIsLoading] = useState(false)
//   const [liveStreamEnded, setLiveStreamEnded] = useState<number | undefined>()
//   const [broadcasterVideoState, setBroadcasterVideoState] = useState(
//     VideoRemoteState.Decoding
//   )
//   const reactionRef = useRef(null)
//   const refInputComment = useRef(null)

//   const init = async () => {
//     try {
//       AgoraEngine.current = await RtcEngine.createWithContext(
//         new RtcEngineContext(config.appId)
//       )
//       await AgoraEngine.current.enableVideo()
//       await AgoraEngine.current.setChannelProfile(
//         ChannelProfile.LiveBroadcasting
//       )
//       await AgoraEngine.current.setClientRole(ClientRole.Audience)
//       await AgoraEngine.current.setDefaultAudioRoutetoSpeakerphone(true)
//       addListeners()
//       setIsReady(true)
//     } catch (error) {
//       console.log('error_init', error)
//     }
//   }
//   const addListeners = () => {
//     listenToEvents()
//     AgoraEngine.current?.addListener(
//       'RemoteVideoStateChanged',
//       (uid, state) => {
//         console.log('RemoteVideoStateChanged', 'state', state)
//         appDispatch(updateVideoState({ state }))
//       }
//     )
//     AgoraEngine.current?.addListener('UserOffline', (uid, reason) => {
//       if (reason === UserOfflineReason.Quit) {
//         setLiveStreamEnded(reason)
//         appDispatch(updateUserOffileState({ userOffileState: reason }))
//       }
//       if (reason === UserOfflineReason.Dropped) {
//         appDispatch(updateUserOffileState({ userOffileState: reason }))
//       }
//       console.log('UserOffline', 'uid,', reason)
//     })
//     AgoraEngine.current?.addListener(
//       'JoinChannelSuccess',
//       (channel, uid, elapsed) => {
//         console.log('JoinChannelSuccess', uid)
//         setJoined(true)
//       }
//     )
//     AgoraEngine.current?.addListener('UserJoined', uid => {
//       console.log('UserJoined ', uid)
//       setJoined(true)
//     })
//     setIsReady(true)
//   }
//   const listenToEvents = () => {
//     const events = [
//       'Warning',
//       'Error',
//       'ConnectionStateChanged',
//       'RemoteVideoStateChanged',
//       'LocalVideoStateChanged',
//       'LocalAudioStateChanged',
//     ]
//     events.forEach((event: string) => {
//       // @ts-ignore
//       AgoraEngine.current?.addListener(event, (evt: any) => {
//         console.log(event, evt)
//       })
//     })
//   }
//   const onJoinChannel = async () => {
//     try {
//       const uid = userInfo.id
//       await AgoraEngine.current
//         ?.joinChannel(config.token, config.channelId, null, uid, undefined)
//         .then(() => console.log('joinChannel'))
//     } catch (error) {
//       console.log('error', error)
//     }
//   }
//   const onLeaveChannel = async () => {
//     const { livestream_id } = props.route?.params
//     callAPIHook({
//       API: requestLeaveLive,
//       payload: livestream_id,
//       useLoading: setIsLoading,
//       onSuccess: async res => {
//         appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
//         await AgoraEngine.current?.leaveChannel()
//         await AgoraEngine.current?.destroy()
//         NavigationUtil.goBack()
//       },
//       onError: err => {
//         console.log('onLeaveChannel', 'err', err)
//         showMessages(
//           R.strings().notification,
//           'Livestream đã kết thúc hoặc không tồn tại!',
//           async () => {
//             appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
//             await AgoraEngine.current?.leaveChannel()
//             await AgoraEngine.current?.destroy()
//             NavigationUtil.goBack()
//           }
//         )
//       },
//     })
//   }
//   const handleOnPressCloseLive = () => {
//     showConfirm(
//       notification,
//       confirm_close_live_cus,
//       () => {
//         onLeaveChannel()
//       },
//       '',
//       ok
//     )
//   }
//   const handleBackOffStream = async () => {
//     await AgoraEngine.current?.leaveChannel()
//     await AgoraEngine.current?.destroy()
//     appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
//     setTimeout(() => {
//       NavigationUtil.goBack()
//     }, 200)
//   }

//   const createComment = (inputComment: string) => {
//     Keyboard.dismiss()
//     const payload = {
//       livestream_id,
//       body: {
//         content: inputComment,
//       },
//     }
//     callAPIHook({
//       API: requestCreateCommentLive,
//       payload: payload,
//       onSuccess: async res => {
//         appDispatch(
//           updateNameProductComment({
//             name: '',
//           })
//         )
//       },
//       onError: err => { },
//     })
//   }
//   const randomIDReaction = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min)
//   }
//   const handleReaction = () => {
//     let idReact = randomIDReaction(1, 4)
//     const payload = {
//       livestream_id,
//       body: {
//         df_reaction_id: idReact,
//       },
//     }
//     callAPIHook({
//       API: requestReaction,
//       payload: payload,
//       onSuccess: async res => { },
//       onError: err => { },
//     })
//   }

//   const getRandomEmotion = (value: number) => {
//     // reactionRef.current?.chooseReact(value)
//     handleReaction()
//   }

//   const sendComment = (inputComment: string) => {
//     createComment(inputComment)
//   }

//   const handleOnPressItemProductHoziron = (item: any) => {
//     appDispatch(
//       updateNameProductComment({
//         name: item.code_product_livestream || item.name,
//       })
//     )
//   }

//   const handleOnPressReactionCart = () => {
//     appDispatch(
//       updateShowModalBottom({
//         showModal: true,
//         typeItem:
//           userInfo?.Shop?.id === shopId
//             ? TYPE_ITEM.LIST_PRODUCT
//             : TYPE_ITEM.LIST_PRODUCT_CART,
//       })
//     )
//   }
//   // Handle back android
//   const handleBackActionAndroid = () => {
//     console.log('handleBackActionAndroid')
//     handleOnPressCloseLive()
//     return true
//   }
//   //Disable swipe back ios
//   useLayoutEffect(() => {
//     navigation.setOptions({ gestureEnabled: false })
//   }, [navigation])

//   useEffect(() => {
//     //handle back android
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       handleBackActionAndroid
//     )
//     // handle lock screen
//     KeepAwake.activate()

//     if (OS == 'android') requestCameraAndAudioPermission()
//     init().then(() => {
//       onJoinChannel()
//     })
//     return () => {
//       backHandler.remove()
//       KeepAwake.deactivate()
//     }
//   }, [])

//   useEffect(() => {
//     socket?.on(channelId, (res: any) => {
//       reactotron.logImportant!('watching', 'BottomModalWatching', res)
//       if (
//         res.type_action == SERVER_STOP_LIVESTREAM ||
//         res.type_action == SHOP_STOP_LIVESTREAM
//       ) {
//         setBroadcasterVideoState(VideoRemoteState.Stopped)
//         setLiveStreamEnded(0)
//         return
//       }
//     })
//   }, [])

//   const FooterLive = () => {
//     return (
//       <KeyboardAvoidingView
//         style={{
//           width: WIDTH,
//           position: 'absolute',
//           bottom: 0,
//         }}
//         behavior={OS === 'ios' ? 'padding' : undefined}
//       >
//         <View style={[styles.vReactionWatching]}>
//           <ButtonReaction
//             isCart={true}
//             icon={R.images.img_buy}
//             onPress={handleOnPressReactionCart}
//           />
//           <InputCommentWatching
//             ref={refInputComment}
//             onPressSend={sendComment}
//           />
//           <ButtonReaction
//             icon={R.images.img_share}
//             onPress={handleShareSocial}
//           />
//           <ButtonReaction
//             icon={R.images.img_reaction_live}
//             onPress={() => {
//               getRandomEmotion(
//                 randomIntFromInterval(EMOTIONS.HEART.id, EMOTIONS.WOW.id)
//               )
//             }}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     )
//   }
//   const ProductAndComment = () => {
//     return (
//       <View style={[styles.vFooterWatching, { paddingBottom: '6%' }]}>
//         <ListCommentWatching
//           shopId={shopId}
//           socket={socket}
//           channelId={channelId}
//           livestream_id={livestream_id}
//         />
//         <ListProductHozironWatching
//           socket={socket}
//           channelId={channelId}
//           onPressItem={handleOnPressItemProductHoziron}
//         />
//       </View>
//     )
//   }
//   return (
//     <View style={styles.vContainWatching}>
//       {!joined ? (
//         <LoadingLiveCustomer handleBackOffStream={handleBackOffStream} />
//       ) : (
//         <>
//           <VideoWatching
//             uid={props.route.params.uid}
//             channelId={config.channelId}
//             AgoraEngine={AgoraEngine.current}
//           />
//           <HeaderLiveWatching
//             LivestreamProducts={LivestreamProducts}
//             socket={socket}
//             isShop={!!(userInfo?.Shop?.id === shopId)}
//             userNameLive={shop?.name}
//             count_subcriber={count_subcriber}
//             imgShop={shop?.profile_picture_url}
//             highlightProduct={highlightProduct}
//             channelId={channelId}
//             onPressCloseLive={handleOnPressCloseLive}
//           />
//           <ProductAndComment />
//           <Reaction channelId={channelId} socket={socket} ref={reactionRef} />
//           <FooterLive />
//           <BottomModalWatching
//             shopId={shopId}
//             livestream_id={livestream_id}
//             socket={socket}
//             channelId={channelId}
//             LivestreamProducts={LivestreamProducts}
//           />
//           {liveStreamEnded == 0 &&
//             broadcasterVideoState == VideoRemoteState.Stopped ? (
//             <FinishLive
//               statusLive={getVideoRemoteState(broadcasterVideoState)}
//               handleBackOffStream={handleBackOffStream}
//             />
//           ) : null}
//         </>
//       )}
//       {isLoading && <LoadingProgress />}
//     </View>
//   )
// }
// const WatchingScreen = memo(WatchingScreenComponent, isEqual)
// export default WatchingScreen
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const WatchingScreen = () => {
  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default WatchingScreen

const styles = StyleSheet.create({})
