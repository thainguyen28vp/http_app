import R from '@app/assets/R'
import { LIVESTREAM_EVENT, LIVESTREAM_STATUS } from '@app/config/Constants'
import { requestGetDetailLiveStream } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts, HEIGHT, OS, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  AppState,
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import Video from 'react-native-video'
import YoutubePlayer from 'react-native-youtube-iframe'
import ytdl from 'react-native-ytdl'
import reactotron from 'ReactotronConfig'
import { ref } from 'yup'
import { DataUserInfoProps } from '../Account/Model'
import BottomModalWatching from './component/BottomModalWatching'
import CoverFullLoading from './component/CoverFullLoading'
import HeaderLiveWatching from './component/HeaderLiveWatching'
import LiveFooterWatching from './component/LiveFooterWatching'
import Reaction from './component/Reaction'
import EndLiveScreen from './EndLiveScreen'
import { styles } from './styles'

const SUPPORT_QUALITIES = ['720p', '720p60', '480p', '360p', '240p']
export enum VideoState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  UNSTARTED = 'unstarted',
  ENDED = 'ended',
  ERROR = 'error',
  BUFFERING = 'buffering',
}

const BUFFER_CONFIG = {
  minBufferMs: 500,
  maxBufferMs: 10000,
  bufferForPlaybackMs: 100,
  bufferForPlaybackAfterRebufferMs: 100,
}

export type YoutubeWatchViewHandles = {
  refresh: () => void
}

const { notification, confirm_close_live_cus, ok } = R.strings()
export const STATUS_LIST_LIVE = {
  status: LIVESTREAM_STATUS.STREAMING,
}
const { SERVER_STOP_LIVESTREAM, SHOP_STOP_LIVESTREAM, COMMENT } =
  LIVESTREAM_EVENT

const throttle = function (callback, timeout) {
  var time = undefined
  function handle() {
    console.log({ time })
    if (time && Date.now() - time < timeout) {
      return
    }
    time = Date.now()

    callback(arguments)
  }
  return handle
}
const RenderVideo = React.forwardRef<YoutubeWatchViewHandles, any>(
  ({ data, loadPlayed }: any, ref: React.Ref<YoutubeWatchViewHandles>) => {
    const [hasPlayed, setHasPlayed] = useState(loadPlayed)
    const [isReady, setReady] = useState(false)
    const [playerKey, setPlayerKey] = useState(data.broadcast_id)
    const refReload = useRef<React.ElementRef<typeof YTPlayStreamIOS> | null>(
      null
    )
    const [isBuffer, setIsBuffer] = useState(false)
    const throttleRefresh = useCallback(
      throttle(() => {
        if (Platform.OS === 'ios') {
          setViewStylesTimeOut({
            height: height,
            width: width,
            backgroundColor: 'black',
            alignSelf: 'center',
          })
        }
        setPlayerKey(`${Date.now()}`)
      }, 2000),
      []
    )
    useEffect(() => {
      console.log({ playerKey })
    }, [playerKey])
    const { height, width } = useWindowDimensions()
    const [videoStatus, setVideoStatus] = useState<VideoState>()
    const defaultStyle = React.useMemo(() => {
      return {
        height: height,
        width: width,
        backgroundColor: 'black',
        alignSelf: 'center',
      }
    }, [height])
    const zoomStyle = React.useMemo(() => {
      return {
        height: height,
        width: Math.floor((height * 16) / 9),
        backgroundColor: 'black',
        alignSelf: 'center',
      }
    }, [height])
    const [webViewStyle, setWebViewStyle] = useState<ViewStyle>({
      height: height,
      width: width,
      backgroundColor: 'black',
      alignSelf: 'center',
    })
    const refreshTimerRef = React.useRef<NodeJS.Timeout>()

    useImperativeHandle(ref, () => ({
      refresh: () => {
        if (Platform.OS === 'ios') {
          setViewStylesTimeOut({
            height: height,
            width: width,
            backgroundColor: 'black',
            alignSelf: 'center',
          })
        }
        setPlayerKey(`${Date.now()}`)
        // throttleRefresh()
      },
    }))
    const onVideoStateChanged = useCallback(
      (state: VideoState, message: string) => {
        if (state === VideoState.PLAYING) {
          // setJoined(true)
        }
      },
      []
    )
    const onError = useCallback((event: string) => {
      console.log('onError', event)
    }, [])
    const onReady = useCallback(() => {
      setReady(true)
    }, [])
    const onPlaybackQualityChange = useCallback((event: string) => {
      console.log('onPlaybackQualityChange', event)
    }, [])
    const onStateChange = useCallback(
      state => {
        onVideoStateChanged(state, state)
        switch (state) {
          case VideoState.PLAYING: {
            setViewStylesTimeOut({
              height: height,
              width: Math.floor((height * 16) / 9),
              backgroundColor: 'black',
              alignSelf: 'center',
            })
            setHasPlayed(true)
            break
          }
          case VideoState.ENDED: {
            break
          }
          case VideoState.UNSTARTED: {
            break
          }
          default:
        }
      },
      [height, onVideoStateChanged]
    )
    const viewStyleTimeoutRef = useRef<NodeJS.Timer>()
    const setViewStylesTimeOut = useCallback(style => {
      if (viewStyleTimeoutRef.current) {
        clearTimeout(viewStyleTimeoutRef.current)
      }
      viewStyleTimeoutRef.current = setTimeout(() => {
        setWebViewStyle(style)
      }, 300)
    }, [])

    const onStateChangeIOS = useCallback(
      state => {
        setVideoStatus(state)
        onVideoStateChanged(state, state)
        switch (state) {
          case VideoState.PLAYING: {
            setViewStylesTimeOut({
              height: height,
              width: Math.floor((height * 16) / 9),
              backgroundColor: 'black',
              alignSelf: 'center',
            })
            setHasPlayed(true)
            break
          }
          case VideoState.ENDED: {
            break
          }
          default:
        }
      },
      [height, onVideoStateChanged]
    )

    useEffect(() => {}, [webViewStyle])
    useEffect(() => {
      if (
        refreshTimerRef.current &&
        videoStatus &&
        [(VideoState.PLAYING, VideoState.ENDED, VideoState.BUFFERING)].includes(
          videoStatus
        )
      ) {
        refreshTimerRef.current && clearTimeout(refreshTimerRef.current)
      }

      if (videoStatus === VideoState.BUFFERING) {
        refreshTimerRef.current = setTimeout(() => {
          setPlayerKey(`${Date.now()}`)
        }, 15000)
      } else if (videoStatus === VideoState.ENDED) {
        refreshTimerRef.current = setTimeout(() => {
          setPlayerKey(`${Date.now()}`)
        }, 3000)
      }
      return () => {
        refreshTimerRef.current && clearTimeout(refreshTimerRef.current)
      }
    }, [videoStatus])
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <View style={styles.fullscreenVideo}>
          {OS == 'ios' ? (
            <YTPlayStreamIOS
              key={playerKey}
              ref={refReload}
              onChangeState={onStateChange}
              onReady={onReady}
              onError={onError}
              onBuffer={setIsBuffer}
              videoId={data.broadcast_id}
              style={styles.coverFullScreen}
            />
          ) : (
            <YoutubePlayer
              key={playerKey}
              height={height}
              width={width}
              play={true}
              forceAndroidAutoplay={true}
              videoId={data.broadcast_id}
              // onChangeState={onStateChange}
              onChangeState={
                Platform.OS === 'ios' ? onStateChangeIOS : onStateChange
              }
              onError={onError}
              onReady={onReady}
              useLocalHTML={true}
              onPlaybackQualityChange={onPlaybackQualityChange}
              webViewStyle={webViewStyle}
              webViewProps={{
                userAgent: 'Mozilla/5.0 (Macintosh; Intel)',
                scalesPageToFit: true,
                injectedJavaScript: `
                    var element = document.getElementsByClassName('container')[0];
                    element.style.position = 'unset';
                    element.style.paddingBottom = '0';
                    true;
                  `,
                containerStyle: { backgroundColor: 'black' },
              }}
              initialPlayerParams={{
                controls: false,
                preventFullScreen: true,
                modestbranding: false,
                iv_load_policy: 3,
                width: width,
                height: height,
                rel: false,
              }}
            />
          )}
          {!hasPlayed && <CoverFullLoading data={data} />}
          <View style={styles.coverFullScreen} />
          {OS == 'ios' ? (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                top: '10%',
                right: 10,
                justifyContent: 'center',
                backgroundColor: 'rgba(1,1,1,0.5)',
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text
                style={{ ...fonts.regular14, color: 'white' }}
                children={'Chất lượng mạng: '}
              />
              <Text
                style={{
                  ...fonts.medium14,
                  color: isBuffer ? 'red' : '#6BCB77',
                }}
                children={isBuffer ? 'Yếu' : 'Tốt'}
              />
            </View>
          ) : null}

          {OS == 'ios' && isBuffer ? (
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: HEIGHT / 2 - 50,
                width: '70%',
                backgroundColor: 'rgba(1,1,1,0.5)',
                borderRadius: 10,
                paddingVertical: 15,
              }}
            >
              <ActivityIndicator size={'large'} color={colors.white} />
              <Text
                style={{
                  marginTop: 5,
                  color: colors.white,
                  ...fonts.medium14,
                  textAlign: 'center',
                }}
                children={
                  'Kết nối của bạn không ổn định!\n Vui lòng kiểm tra lại mạng.'
                }
              />
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    )
  }
)

const YoutubeWatchingScreen = (props: any) => {
  const data = props.route.params.data
  const {
    LivestreamProducts,
    count_viewed,
    count_subcriber,
    shop,
    highlightProduct,
    channelId,
    token,
    appId,
    tokenUser,
    shopId,
    channel,
    livestream_id,
  } = props.route.params

  const [dataDetailLive, setDataDetailLive] = useState<any>()
  const [endLive, setEndLive] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [listComment, setListComment] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const appDispatch = useAppDispatch()
  const refVp = useRef<any>(null)
  const reactionRef = useRef<any>(null)
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  const getDetailLiveStream = () => {
    try {
      callAPIHook({
        API: requestGetDetailLiveStream,
        payload: livestream_id,
        useLoading: setIsLoading,
        onSuccess: async res => {
          setDataDetailLive(data)
          setListComment(res.data.comments?.reverse())
        },
        onError: err => {},
      })
    } catch (error) {}
  }

  const handleSocket = (res: any) => {
    if (
      res.type_action == SERVER_STOP_LIVESTREAM ||
      res.type_action == SHOP_STOP_LIVESTREAM
    ) {
      setEndLive(true)
      return
    }
  }

  useEffect(() => {
    KeepAwake.activate()
    SocketHelperLivestream?.socket?.on(channelId, handleSocket)
    return () => {
      SocketHelperLivestream.socket?.off(channelId, handleSocket)
      KeepAwake.deactivate()
    }
  }, [])

  useEffect(() => {
    getDetailLiveStream()
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refVp && refVp?.current && refVp?.current?.refresh()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const renderBody = () => {
    if (isLoading) return
    return (
      <>
        <RenderVideo data={data} ref={refVp} loadPlayed={hasPlayed} />
        <View style={styles.coverFullScreen}>
          <HeaderLiveWatching
            livestream_id={livestream_id}
            onPressReload={() => {
              refVp?.current.refresh()
            }}
            LivestreamProducts={
              LivestreamProducts || dataDetailLive?.LivestreamProducts
            }
            isShop={false}
            userNameLive={dataDetailLive?.title}
            count_subcriber={count_subcriber || data?.count_subcriber}
            imgShop={shop?.profile_picture_url}
            highlightProduct={
              highlightProduct || data?.HighlightProduct?.product
            }
            channelId={channelId}
          />
          <Reaction channelId={channelId} ref={reactionRef} />
          <LiveFooterWatching
            livestream_id={livestream_id}
            shopId={shopId}
            channelId={channelId}
            listComment={listComment}
            pushEmoji={id => {
              reactionRef.current.chooseReact(id)
            }}
          />
          <BottomModalWatching
            shopId={shopId}
            livestream_id={livestream_id}
            channelId={channelId}
            LivestreamProducts={LivestreamProducts || dataDetailLive?.products}
          />
        </View>
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {!endLive ? renderBody() : <EndLiveScreen data={data} />}
    </View>
  )
}

export default YoutubeWatchingScreen

type YTPlayStreamIOSProps = {
  onChangeState: (event: string) => void
  onBuffer: (isBuffering: boolean) => void
  onReady: () => void
  onError: (event: string) => void
  videoId: string
  style: any
}
const YTPlayStreamIOS = forwardRef(
  (
    {
      videoId,
      onChangeState,
      onBuffer,
      onReady,
      ...props
    }: YTPlayStreamIOSProps,
    ref: React.Ref<YoutubeWatchViewHandles>
  ) => {
    const playerRef = React.useRef(null)
    const [livestreamUrl, setLivestreamUrl] =
      useState<{ url: string; itag: number }>(null)
    const [playing, setPlaying] = useState(false)
    const [videoKey, setVideoKey] = useState(videoId)
    const reloadTimerRef = React.useRef<NodeJS.Timer>()
    const timerRef = React.useRef<NodeJS.Timer>()
    const [hasNetworkError, setHasNetworkError] = useState(false)

    const requestLiveStreamUrl = useCallback(async () => {
      try {
        const foundUrls: any[] = []

        const youtubeURL = 'http://www.youtube.com/watch?v=' + videoId
        // const urls = await ytdl(youtubeURL, { quality: '247' })
        const urls: any[] = await ytdl(youtubeURL, {
          filter: (format: any) => {
            const linkSupported =
              SUPPORT_QUALITIES.includes(format.qualityLabel) &&
              format.container === 'ts'
            if (linkSupported) {
              foundUrls.push(format)
            }
            return linkSupported
          },
        })
        if (foundUrls && foundUrls.length > 0) {
          foundUrls.sort((l, r) => (l?.qualityLabel > r?.qualityLabel ? -1 : 1))
          const data: { [key: string]: any } = {}
          foundUrls.forEach(v => {
            data[v.qualityLabel] = v
          })
        } else {
        }
      } catch (e) {
        // _log('requestLiveStreamUrl', 'error', e)
        // if (!livestreamUrl) {
        //   onError('Có lỗi xảy ra khi kết nối livestream', e)
        // }
      } finally {
      }
    }, [videoId])

    const handleVideoError = useCallback(
      data => {
        // requestLiveStreamUrl()
        handleReloadVideo()
        if (data?.code == 1001) {
          setHasNetworkError(true)
        } else {
        }
      },
      [handleReloadVideo]
    )
    const handleReloadVideo = useCallback(() => {
      if (reloadTimerRef.current) {
        clearTimeout(reloadTimerRef.current)
      }
      reloadTimerRef.current = setTimeout(() => {
        setVideoKey(`${Date.now()}`)
        handleRestartVideo()
      }, 10000)
    }, [handleRestartVideo])

    const handleRestartVideo = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        requestLiveStreamUrl()
      }, 20000)
    }, [requestLiveStreamUrl])

    useEffect(() => {
      return () => {
        if (playerRef.current) playerRef.current.stop()
      }
    }, [])

    React.useImperativeHandle(ref, () => ({
      refresh: () => {
        requestLiveStreamUrl()
      },
    }))
    useEffect(() => {
      async function getUrls() {
        const youtubeURL = 'http://www.youtube.com/watch?v=' + videoId
        const urls = await ytdl(youtubeURL, { quality: 'highestvideo' })
        return urls
      }
      // // getUrls()
      getUrls()
        .then(v => {
          if (v && v.length > 0) {
            setLivestreamUrl(v[0])
            onChangeState(VideoState.UNSTARTED)
          }
        })
        .catch(err => {
          console.log(err)
          props.onError('notfound')
        })
        .finally(() => {
          props.onReady()
        })
    }, [])
    useEffect(() => {
      console.log('livestream', livestreamUrl)
    }, [livestreamUrl])

    const togglePlaying = React.useCallback(() => {
      setPlaying(prev => !prev)
    }, [])

    const handleReadyForDisplay = React.useCallback(() => {
      onChangeState(VideoState.PLAYING)
    }, [onChangeState])
    const handleBuffer = React.useCallback(
      res => {
        onBuffer(res.isBuffering)
      },
      [onBuffer]
    )
    return (
      <Video
        key={videoKey}
        source={{
          uri: livestreamUrl?.url,
        }} // Can be a URL or a local file.
        ref={playerRef} // Store reference
        style={props.style}
        resizeMode="contain"
        onReadyForDisplay={handleReadyForDisplay}
        // automaticallyWaitsToMinimizeStalling={false}
        // playWhenInactive={true}
        bufferConfig={BUFFER_CONFIG}
        onVideoBuffer={() => {}}
        onBandwidthUpdate={res => {}}
        onPlaybackRateChange={res => {}}
        onBuffer={handleBuffer}
        // onError={handleVideoError}
      />
    )
  }
)
