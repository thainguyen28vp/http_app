import React from 'react'
import {
  AuthStack,
  MainStack,
  StackAppScreen,
  StackAuthScreen,
} from './AppStack'
import {
  ROOT_STACK,
  SCREEN_ROUTER,
  SCREEN_ROUTER_APP,
} from '@app/config/screenType'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackHeaderInterpolationProps,
  TransitionPresets,
} from '@react-navigation/stack'
import NavigationUtil from './NavigationUtil'
import GlobalAlert from '@app/components/GlobalAlert'
import GlobalConfirm from '@app/components/GlobalConfirm'
import { Tabs } from './Tabs/Tabs'
import ListProductLiveScreen from '@app/screens/App/Livestream/ListProductLiveScreen'
import YoutubeLiveScreen from '@app/screens/App/Livestream/YoutubeLiveScreen'

const { MAIN } = SCREEN_ROUTER

const RootStack = createStackNavigator()

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({
    current: { progress },
  }: StackHeaderInterpolationProps & any) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
}

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
}
const modalOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent', marginTop: 1 },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.1, 0.3, 0.9],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      }),
    },
  }),
}
const AppNavigator = () => {
  const mainApp = () => {
    return (
      <AuthStack.Navigator
        headerMode="none"
        screenOptions={TransitionScreenOptions}
      >
        {StackAuthScreen()}
        <MainStack.Screen name={MAIN} component={Tabs} />
        {StackAppScreen()}
      </AuthStack.Navigator>
    )
  }

  return (
    <NavigationContainer
      ref={navigatorRef => {
        if (navigatorRef) NavigationUtil.setTopLevelNavigator(navigatorRef)
      }}
    >
      <RootStack.Navigator
        headerMode="none"
        screenOptions={screenOptions}
        mode="modal"
        initialRouteName={ROOT_STACK.MAIN_APP}
      >
        <RootStack.Screen name={ROOT_STACK.MAIN_APP} component={mainApp} />
        {/* <RootStack.Screen
          name={SCREEN_ROUTER_APP.YOUTUBE_LIVE}
          key={SCREEN_ROUTER_APP.YOUTUBE_LIVE}
          component={YoutubeLiveScreen}
          options={modalOptions} />
        <RootStack.Screen
          name={SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE}
          key={SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE}
          component={ListProductLiveScreen}
          options={modalOptions} /> */}
        <RootStack.Screen
          name={ROOT_STACK.GLOBAL_ALERT}
          component={GlobalAlert}
          options={{ gestureEnabled: false }}
        />
        <RootStack.Screen
          name={ROOT_STACK.GLOBAL_CONFIRM}
          component={GlobalConfirm}
          options={{ gestureEnabled: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
