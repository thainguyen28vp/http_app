import ErrorBoundary from '@app/components/ErrorBoundary'
import store from '@app/store'
// import * as Sentry from '@sentry/react-native'
import React from 'react'
import { LogBox } from 'react-native'
import codePush from 'react-native-code-push'
import { RootSiblingParent } from 'react-native-root-siblings'
import { Provider } from 'react-redux'
import AppContainer from './AppContainer'
import Toast from 'react-native-toast-message'

// Sentry.init({
//   dsn: 'http://fca878ff72da40c08f52b700d5487d9b@sentry.winds.vn/39',
// })
LogBox.ignoreAllLogs()
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootSiblingParent>
          <AppContainer />
          <Toast ref={ref => Toast.setRef(ref)} />
        </RootSiblingParent>
      </Provider>
    </ErrorBoundary>
  )
}

let codePushOptions = {
  updateDialog: false,
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.MANUAL,
}

const MyApp = codePush(codePushOptions)(App)

export default MyApp
