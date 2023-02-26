import OneSignalUtil from '@app/utils/OneSignalUtils'
import AppUpdateChecker from '@app/components/AppUpdateChecker'
import React, { useEffect } from 'react'
import OneSignal from 'react-native-onesignal'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import VersionCheck from 'react-native-version-check'
import reactotron from 'ReactotronConfig'
import AppNavigator from './app/navigation/AppNavigator'
import { useAppDispatch } from '@app/store'
import { useInConversation } from '@app/screens/App/Chat/ChatContext'
import { RootProvider } from '@app/rootContext'
import CodePushUtil from '@app/utils/CodePushUtil'
import Orientation from 'react-native-orientation'

const AppContainer = () => {
  const Dispatch = useAppDispatch()

  useEffect(() => {
    Orientation.lockToPortrait()
    OneSignalUtil.initialize(Dispatch)
    CodePushUtil.getCodePushMetadata()
    !__DEV__ && CodePushUtil.checkCodePushUpdate()
    // CodePushUtil.checkCodePushUpdate()
  }, [])

  return (
    <SafeAreaProvider>
      {!__DEV__ ? <AppUpdateChecker /> : null}
      <AppNavigator />
    </SafeAreaProvider>
  )
}

export default () => (
  <RootProvider>
    <AppContainer />
  </RootProvider>
)
