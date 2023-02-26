// import R from '@app/assets/R'
// import { Button } from '@app/components/Button/Button'
// import LoadingProgress from '@app/components/LoadingProgress'
// import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
// import { TYPE_ITEM } from '@app/config/Constants'
// import { SCREEN_ROUTER_APP } from '@app/config/screenType'
// import NavigationUtil, { RouteProps } from '@app/navigation/NavigationUtil'
// import { requestStartLiveStream } from '@app/service/Network/livestream/LiveStreamApi'
// import { useAppDispatch, useAppSelector } from '@app/store'
// import { callAPIHook } from '@app/utils/CallApiHelper'
// import { countProduct } from '@app/utils/FuncHelper'
// import { showMessages } from '@app/utils/GlobalAlertHelper'
// import { requestCameraAndAudioPermission } from '@app/utils/Permission'
// import React, { memo, useEffect, useRef, useState } from 'react'
// import isEqual from 'react-fast-compare'
// import { Platform, Text, View } from 'react-native'
// import RtcEngine, {
//   AudioLocalError,
//   AudioLocalState,
//   ChannelProfile,
//   ClientRole,
//   LocalVideoStreamState,
//   NetworkQuality,
//   RtcEngineConfig,
//   RtcLocalView,
//   VideoRenderMode,
// } from 'react-native-agora'
// import { useImmer } from 'use-immer'
// import { DataUserInfoProps } from '../Account/Model'
// import { updateListProductSelect } from '../Product/slice/ListProductSlice'
// import BeautyOptionModal, { BeautyConfig } from './component/BeautyOptionModal'
// import BottomModal from './component/BottomModal'
// import ButtonReaction from './component/ButtonReaction'
// import HeaderLive from './component/HeaderLive'
// import { styles } from './styles'

// const config = require('../../../../agora.config.json')
// export const DEFAULT_BEAUTY_OPTIONS: BeautyConfig = {
//   lighteningLevel: 0.7,
//   smoothnessLevel: 0.5,
//   rednessLevel: 0.1,
//   lighteningContrastLevel: 1,
// }
// interface PreviewScreenProps {
//   route: RouteProps
// }

// const PreviewScreenComponent = (props: PreviewScreenProps) => {
//   const userInfo = useAppSelector<DataUserInfoProps>(
//     state => state.accountReducer.data
//   )
//   const beautyModalRef = useRef(null)
//   const [beautySetting, setBeautySetting] = useImmer<{
//     visible: boolean
//     defaultOptions: BeautyConfig
//     options: BeautyConfig
//   }>({
//     visible: false,
//     defaultOptions: DEFAULT_BEAUTY_OPTIONS,
//     options: DEFAULT_BEAUTY_OPTIONS,
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const isBroadcaster = props.route.params.type === 'create'
//   const AgoraEngine = useRef<RtcEngine>()
//   const [isReady, setIsReady] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const dataProduct = useAppSelector(state => state.ListProductReducer)
//   const appDispatch = useAppDispatch()

//   const [localVideoState, setLocalVideoState] = useState(
//     LocalVideoStreamState.Stopped
//   )
//   const [localAudioState, setLocalAudioState] = useState(
//     AudioLocalState.Stopped
//   )
//   const [localNetworkQuality, setLocalNetworkQuality] = useState({
//     uid: null,
//     upLink: NetworkQuality.Unknown,
//   })
//   const [remoteNetworkQuality, setRemoteNetworkQuality] = useState({
//     uid: null,
//     downLink: NetworkQuality.Unknown,
//   })
//   const init = async () => {
//     AgoraEngine.current = await RtcEngine.createWithConfig(
//       new RtcEngineConfig(config.appId)
//     )
//     await AgoraEngine.current.enableVideo()
//     await AgoraEngine.current.startPreview()
//     await AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting)
//     await AgoraEngine.current.setClientRole(ClientRole.Broadcaster)
//     setIsReady(true)
//     addListeners()
//   }
//   const addListeners = () => {
//     AgoraEngine.current?.addListener(
//       'LocalVideoStateChanged',
//       (localVideoState, error) => {
//         console.log('LocalVideoStateChanged', localVideoState, error)
//         setLocalVideoState(localVideoState)
//       }
//     )
//     AgoraEngine.current?.addListener(
//       'LocalAudioStateChanged',
//       (state: AudioLocalState, error: AudioLocalError) => {
//         console.log('LocalAudioStateChanged', state, error)
//         setLocalAudioState(state)
//       }
//     )
//   }
//   const onGoLive = () => {
//     const livestream_id = props.route.params.livestream_id
//     callAPIHook({
//       API: requestStartLiveStream,
//       payload: livestream_id,
//       useLoading: setIsLoading,
//       onSuccess: res => {
//         appDispatch(updateListProductSelect({ data: res.data.product }))
//         NavigationUtil.replace(SCREEN_ROUTER_APP.LIVE, {
//           type: 'create',
//           livestream_id: livestream_id,
//           user_id: props.route.params.user_id,
//           token_publisher: res.data.token_publisher,
//           app_id: res.data.app_id,
//           tokenUser: userInfo.token,
//         })
//       },
//       onError: err => {
//         showMessages(
//           R.strings().notification,
//           'Đã có lỗi xảy ra! Vui lòng thử lại.',
//           () => {}
//         )
//       },
//     })
//   }
//   const onUnMounting = () => {
//     AgoraEngine.current?.stopPreview()
//     // AgoraEngine.current?.destroy()
//   }
//   const onSwitchCamera = () => AgoraEngine.current?.switchCamera()

//   const handleBeautySettingChange = React.useCallback(
//     v => {
//       setBeautySetting(prev => {
//         prev.options = v
//       })
//       AgoraEngine.current?.setBeautyEffectOptions(true, v)
//     },
//     [setBeautySetting]
//   )

//   useEffect(() => {
//     if (Platform.OS === 'android') requestCameraAndAudioPermission()
//     init()
//     return () => {
//       onUnMounting()
//     }
//   }, [])

//   const renderVideo = () => (
//     <RtcLocalView.SurfaceView
//       renderMode={VideoRenderMode.Hidden}
//       style={styles.fullscreen}
//       channelId={config.channelId}
//     />
//   )
//   const FooterLive = () => {
//     return (
//       <View style={styles.buttonContainer}>
//         <ButtonReaction
//           icon={R.images.img_beauty}
//           onPress={() => {
//             beautyModalRef.current?.show()
//           }}
//         />
//         <ButtonReaction
//           isCart={!!dataProduct?.listProductSelect?.length}
//           icon={R.images.img_buy}
//           onPress={() => {
//             setShowModal(!showModal)
//           }}
//         />
//         <ButtonReaction
//           icon={R.images.img_swtich_camera}
//           onPress={onSwitchCamera}
//         />
//         <Button
//           style={styles.vBtnStart}
//           onPress={onGoLive}
//           children={<Text style={styles.txtStartLive}>Bắt đầu phát</Text>}
//         />
//       </View>
//     )
//   }
//   return (
//     <ScreenWrapper forceInset={['left']} unsafe>
//       {isReady && renderVideo()}
//       <HeaderLive
//         isPreview={true}
//         userNameLive={userInfo?.Shop?.name}
//         imgShop={userInfo?.Shop?.profile_picture_url}
//         onPressCloseLive={() => {
//           NavigationUtil.goBack()
//         }}
//       />
//       <FooterLive />
//       <BeautyOptionModal
//         ref={beautyModalRef}
//         onValueChange={handleBeautySettingChange}
//         value={beautySetting.defaultOptions}
//       />
//       <BottomModal
//         isPreview={true}
//         titleList={`Danh sách sản phẩm (${countProduct(
//           dataProduct?.listProductSelect.length
//         )})`}
//         typeItem={TYPE_ITEM.LIST_PRODUCT_CART}
//         isVisible={showModal}
//         onBackdropPress={() => setShowModal(!showModal)}
//         data={dataProduct?.listProductSelect}
//       />
//       {isLoading && <LoadingProgress />}
//     </ScreenWrapper>
//   )
// }
// const PreviewLiveScreen = memo(PreviewScreenComponent, isEqual)
// export default PreviewLiveScreen

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const PreviewLiveScreen = () => {
  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default PreviewLiveScreen

const styles = StyleSheet.create({})
