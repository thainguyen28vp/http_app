import React, { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, View } from 'react-native'

interface AppStateListenerProps {
  onAppToForeground?: () => void
  onAppToBackground?: () => void
}

const AppStateListener = (props: AppStateListenerProps) => {
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current === 'background' && nextAppState === 'active') {
        props.onAppToForeground && props.onAppToForeground()
        console.log('App has come to the foreground!')
      } else if (
        appState.current === 'active' &&
        nextAppState === 'background'
      ) {
        console.log('App has come to the background!')
        props.onAppToBackground && props.onAppToBackground()
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      console.log('AppState', appState.current)
    }

    AppState.addEventListener('change', _handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange)
    }
  }, [props])

  return null
}

export default AppStateListener
