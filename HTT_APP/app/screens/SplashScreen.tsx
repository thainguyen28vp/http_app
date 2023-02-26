import R from '@app/assets/R'
import { SCREEN_ROUTER } from '@app/config/screenType'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch } from '@app/store'
import { colors, dimensions, fonts, OS } from '@app/theme'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import codePush from 'react-native-code-push'
import FastImage from 'react-native-fast-image'
import ProgressBar from 'react-native-progress/Bar'
import { connect } from 'react-redux'
import { requestUserThunk } from './App/Account/slice/AccountSlice'
import {
  clearBadgeData,
  updateCountCart,
  updateCountChat,
  updateCountNotification,
} from './App/Notification/utils/NotificationUtils'

const { MAIN } = SCREEN_ROUTER

const SplashScreen = (props: any) => {
  const Dispatch = useAppDispatch()
  const [isNeedUpdate, setIsNeedUpdate] = React.useState(false)
  const [progress, setProgress] = React.useState({
    receivedBytes: 0,
    totalBytes: 1,
  })

  const checkToken = async () => {
    const token = await AsyncStorageService.getToken()
    clearBadgeData(Dispatch)
    if (token) {
      Dispatch(requestUserThunk())
      updateCountNotification(Dispatch)
      updateCountChat(Dispatch)
      // updateCountCart(Dispatch)
      SocketHelper.init(token)
      SocketHelperLivestream.init(token)
    }
  }

  useEffect(() => {
    checkToken()
    // if (__DEV__) {
    //   checkAccount()
    //   return
    // }
    checkAccount()
    // OS == 'android' ? checkAccount() : checkUpdate()
    // checkUpdate()
  }, [])

  const checkAccount = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: MAIN }],
    })
  }
  const checkUpdate = async () => {
    codePush
      .checkForUpdate()
      .then(update => {
        if (!update) {
          checkAccount()
        } else {
          codePush.notifyAppReady()
          codePush.sync(
            {
              updateDialog: null,
              installMode: codePush.InstallMode.IMMEDIATE,
            },
            status => {
              console.log('status', status)
              if (
                status == codePush.SyncStatus.DOWNLOADING_PACKAGE ||
                status == codePush.SyncStatus.CHECKING_FOR_UPDATE ||
                status == codePush.SyncStatus.SYNC_IN_PROGRESS ||
                status == codePush.SyncStatus.INSTALLING_UPDATE
              ) {
              } else {
              }
              if (status == codePush.SyncStatus.UPDATE_INSTALLED) {
                codePush.allowRestart()
              }
            },
            progress => {
              setProgress(progress)
              setIsNeedUpdate(true)
            }
          )
        }
      })
      .catch(err => {
        checkAccount()
      })
    codePush.notifyAppReady()
  }
  return (
    <FastImage
      source={R.images.img_splash}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode={'cover'}
    >
      {isNeedUpdate ? (
        <View style={{ marginTop: dimensions.height * 0.2 }}>
          <ProgressBar
            progress={progress.receivedBytes / progress.totalBytes}
            width={dimensions.width / 2}
            height={1.5}
            color={colors.primary}
          />
          <Text
            style={{
              ...fonts.semi_bold12,
              textAlign: 'center',
              marginVertical: 8,
              color: colors.primary,
            }}
            children={`Đang đồng bộ dữ liệu ${Math.round(
              (progress.receivedBytes / progress.totalBytes) * 100
            )}%`}
          />
        </View>
      ) : (
        <View style={{ position: 'absolute', bottom: 40 }}>
          <ActivityIndicator
            style={{ marginTop: 50 }}
            size={'large'}
            color={colors.primary}
          />
        </View>
      )}
    </FastImage>
  )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)
