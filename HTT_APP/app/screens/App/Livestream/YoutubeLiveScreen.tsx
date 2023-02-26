import R from '@app/assets/R'
import LoadingProgress from '@app/components/LoadingProgress'
import { LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import CustomStreamPublisher, {
  CustomStreamPublisherHandles,
} from '@app/lib/CustomStream/CustomStreamPublisher'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  requestPing,
  requestStartLiveStream,
  requestStopLiveStream,
} from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { OS } from '@app/theme'
import { showConfirm, showMessages } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { handleShareSocial } from '@app/utils/FuncHelper'
import { requestCameraAndAudioPermission } from '@app/utils/Permission'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import { useNavigation } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  BackHandler,
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import reactotron from 'reactotron-react-native'
import { DataUserInfoProps } from '../Account/Model'
import {
  setListproductDeleteAndAddEmpty,
  updateCodeProduct,
  updateListProductSelect,
} from '../Product/slice/ListProductSlice'
import BottomModal from './component/BottomModal'
import CustomLiveAndroid from './component/CustomLiveandroid'
import EndLivestream from './component/EndLivestream'
import FooterLive from './component/FooterLive'
import FooterLivePreview from './component/FooterLivePreview'
import HeaderLive from './component/HeaderLive'
import InfoLiveStream from './component/InfoLiveStream'
import Reaction from './component/Reaction'
import { StreamStatus, StreamVideoPreset } from './component/types'
import YoutubeProvider, {
  useInfoStreaming,
  useToggleInfoStreaming,
  useToggleShowButtonAddProduct,
  useToggleUpdateProductSell,
} from './context/YoutubeLIveContext'
import { styles } from './styles'

const { SERVER_STOP_LIVESTREAM, CREATE_UPDATE_PRODUCT, WARNING_LIVESTREAM } =
  LIVESTREAM_EVENT
const { notification, confirm_close_live, ok, end_live } = R.strings()

const YoutubeLiveScreen = (props: any) => {
  const appDispatch = useAppDispatch()
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const refToast: any = useRef(null)
  const livestream_id = props.route.params.data.id
  const { data, streamName, ingestionAddress, joinLive } = props?.route?.params
  const url = `${ingestionAddress}/${streamName}`
  const refVb = useRef<any>(null)
  const refProductSell = useRef<any>(null)
  const [itemProduct, setItemProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [started, setStarted] = useState(joinLive || false)
  const [showModal, setShowModal] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [typeItemModal, setTypeItemModal] = useState(TYPE_ITEM.LIST_PRODUCT)
  const [showButtonAddProduct, setShowButtonAddProduct] = useState(true)
  const refChannelID = useRef(null)
  const playerRef = useRef<CustomStreamPublisherHandles | any>()
  const [stats, setStats] = useState<
    { fps: any; outKbps: any; data: any } | any
  >({})
  const [status, setStatus] = useState('')
  const navigation = useNavigation()
  const [stopPing, setStopPing] = useState(false)
  const [stopLive, setStopLive] = useState()
  const [showEndLive, setShowEndLive] = useState<any>(false)
  const onPressSetInfoStreamming = useToggleInfoStreaming()
  const onPressShowButtonAddproduct = useToggleShowButtonAddProduct()
  const onPressUpdateProduct = useToggleUpdateProductSell()

  const onGoLive = () => {
    callAPIHook({
      API: requestStartLiveStream,
      payload: livestream_id,
      useLoading: setIsLoading,
      onSuccess: res => {
        playerRef && playerRef?.current?.start()
        refChannelID.current = res.data.channel
        !joinLive ? setStarted(true) : null
      },
      onError: err => {
        // console.log('err', err)
        showMessages(R.strings().notification, end_live, () => {
          onStopChannel()
        })
      },
    })
  }
  const onStopChannel = async () => {
    callAPIHook({
      API: requestStopLiveStream,
      payload: livestream_id,
      useLoading: setIsLoading,
      onSuccess: async res => {
        playerRef?.current?.stop()
        setStopLive(res.data)
      },
      onError: err => {
        playerRef?.current?.stop()
        setTimeout(() => {
          NavigationUtil.pop(2)
        }, 300)
      },
    })
  }
  const handleOnPressCloseLive = () => {
    if (started) {
      showConfirm(
        notification,
        confirm_close_live,
        () => {
          // setStopPing(true)
          onStopChannel()
        },
        '',
        ok
      )
      return
    }
    playerRef?.current?.stop()
    NavigationUtil.pop(2)
  }
  const handleBackActionAndroid = () => {
    if (started) {
      handleOnPressCloseLive()
      return true
    }
    playerRef.current?.stop()
    setTimeout(() => {
      NavigationUtil.pop(2)
    }, 500)
    return true
  }
  const handleOnChangeCode = (code: any, item: any) => {
    appDispatch(
      updateCodeProduct({
        id: item.id,
        code_product_livestream: code,
      })
    )
  }
  const handleActionAddProduct = () => {
    setShowModal(!showModal)
    setTimeout(() => {
      appDispatch(setListproductDeleteAndAddEmpty({}))
      NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE, {
        livestream_id,
      })
    }, 300)
  }

  const handleTypeActionSocket = (res: any) => {
    switch (res?.type_action) {
      case CREATE_UPDATE_PRODUCT:
        let reverseData = res?.data
        appDispatch(updateListProductSelect({ data: reverseData }))
        break
      case SERVER_STOP_LIVESTREAM:
        showMessages(
          notification,
          'Thời gian livestream của bạn đã hết! Vui lòng liên hệ với admin để gia hạn thêm thời gian livestream.',
          async () => {
            setShowEndLive(res.data)
          }
        )
        break
      case WARNING_LIVESTREAM:
        showMessages(
          notification,
          `Thời gian livestream của bạn còn ${res.data.warning_type} phút, livestream sẽ tắt sau ${res.data.warning_type} phút. Vui lòng liên hệ admin để gia hạn thêm thời gian livestream! `,
          async () => {}
        )
        break
      default:
        break
    }
  }
  const handleStreamStatusChanged = useCallback(
    (status: StreamStatus, message) => {
      setStatus((status && StreamStatus[status]) || '')
      if (status === StreamStatus.start) {
        // setStreamSuccess(true)
        // setStreamClosed(false)
      } else if (status === StreamStatus.closed) {
        // setStreamClosed(true)
      }
    },
    []
  )

  const requestPingToServer = () => {
    callAPIHook({
      API: requestPing,
      payload: livestream_id,
      onSuccess: async res => {},
      onError: err => {
        setStopPing(true)
        playerRef.current?.stop()
      },
    })
  }

  const handleVideoStatus = useCallback((code: StreamStatus, msg) => {
    // console.log('onStatus=' + code + ' msg=' + msg)
    // props.onStatusChanged(code, msg)
  }, [])

  const handleStreamStats = useCallback(stats => {
    setStats(stats)
  }, [])

  useEffect(() => {
    if (joinLive) {
      onGoLive()
      return
    }
    return () => {}
  }, [joinLive])

  useEffect(() => {
    if (started) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackActionAndroid
      )
      return () => {
        backHandler.remove()
      }
    }
  }, [started])

  // useEffect(() => {
  //   let ping: any
  //   if (started && !stopPing)
  //     ping = setInterval(() => {
  //       reactotron.log!('ping to server')
  //       requestPingToServer()
  //     }, 10000)
  //   return () => {
  //     clearInterval(ping)
  //   }
  // }, [started, stopPing])

  useEffect(() => {
    KeepAwake.activate()
    if (OS === 'android') {
      requestCameraAndAudioPermission()
      return
    }
    return () => {
      KeepAwake.deactivate()
    }
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false })
  }, [navigation])

  useEffect(() => {
    SocketHelperLivestream?.socket?.on(
      `livestream_${livestream_id}`,
      handleTypeActionSocket
    )
    return () => {
      SocketHelperLivestream?.socket?.off(
        `livestream_${livestream_id}`,
        handleTypeActionSocket
      )
    }
  }, [])

  // useEffect(() => {
  //   SocketHelperLivestream.socket?.emit(`subscribe_livestream_channel`, data.id)
  // }, [])

  __DEV__ && console.log('Youtube Live')

  return (
    <YoutubeProvider>
      <View style={{ flex: 1 }}>
        {OS === 'ios' ? (
          <>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss()
              }}
            >
              <CustomStreamPublisher
                style={styles.liveView}
                ref={playerRef}
                shouldSetup={true}
                onReady={v => {
                  // console.log('onReady', v)
                  if (v) {
                    refVb.current?.start()
                  }
                }}
                videoPreset={StreamVideoPreset.yt_hd_720p_30fps_1mbps}
                streamKey={streamName}
                streamServer={ingestionAddress}
                onStatus={handleStreamStatusChanged}
                onStreamStats={handleStreamStats}
              />
            </TouchableWithoutFeedback>
            {started ? <InfoLiveStream stats={stats} status={status} /> : null}
          </>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss()
            }}
          >
            <CustomLiveAndroid
              ref={playerRef}
              style={{ flex: 1, backgroundColor: 'black' }}
              streamKey={streamName}
              onStatus={handleVideoStatus}
              streamServer={ingestionAddress}
            />
          </TouchableWithoutFeedback>
        )}

        <HeaderLive
          livestream_id={livestream_id}
          imgShop={userInfo?.Shop?.profile_picture_url}
          userNameLive={userInfo?.full_name}
          isPreview={!started}
          onPressCloseLive={handleOnPressCloseLive}
        />
        <Reaction channelId={refChannelID.current} />

        {started ? (
          <FooterLive
            livestream_id={livestream_id}
            onSwitchCamera={() => {
              playerRef?.current?.switchCamera()
            }}
            onPressSocial={handleShareSocial}
          />
        ) : (
          <FooterLivePreview
            onPressStart={onGoLive}
            onPressSwtichCamera={() => {
              playerRef?.current?.switchCamera()
            }}
          />
        )}

        <BottomModal
          livestream_id={livestream_id}
          isPreview={!started}
          refToast={refToast}
          isShop={!!userInfo?.shop_id}
          loadingModal={loadingModal}
          onChangeCode={handleOnChangeCode}
          actionAddProduct={handleActionAddProduct}
        />
        {(stopLive || !!showEndLive) && (
          <EndLivestream data={stopLive || showEndLive} />
        )}
        {isLoading && <LoadingProgress />}
      </View>
    </YoutubeProvider>
  )
}

export default YoutubeLiveScreen
