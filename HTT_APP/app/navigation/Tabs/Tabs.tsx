import R from '@app/assets/R'
import { scale } from '@app/common'
import { Block } from '@app/components/Block/Block'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { MAIN_TAB, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import AccountScreen from '@app/screens/App/Account/AccountScreen'
import RequestFlowerScreen from '@app/screens/App/Flower/RequestFlowerScreen'
import HomeScreen from '@app/screens/App/Home/HomeScreen'
import LiveStreamScreen from '@app/screens/App/Livestream/LiveStreamScreen'
import NotificationScreen from '@app/screens/App/Notification/NotificationScreen'
import { requestListNotificationThunk } from '@app/screens/App/Notification/slice/NotificationSlice'
import ProductScreen from '@app/screens/App/Product/ProductScreen'
import ShopScreen from '@app/screens/App/Shop/ShopScreen'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch, useAppSelector } from '@app/store'
import {
  colors,
  dimensions,
  fonts,
  HEIGHT,
  OS,
  styleView,
  WIDTH,
} from '@app/theme'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Svg, { Path } from 'react-native-svg'
import NavigationUtil from '../NavigationUtil'
import LiveStreamButton from './LiveStreamButton'
import { RouteProps } from './Tabs.props'

type TabBarOption = {
  name: string
  icon: any
  route: (props?: any) => JSX.Element
  title: string
}
const height = dimensions.height
const width = dimensions.width
const aspectRatio = height / width
const CHECK_IPHONE = aspectRatio > 1.6
const IS_IP5 = aspectRatio == 1.775
const CHECK_HEIGHT_BOTTOM_TAB_BAR =
  OS === 'ios' ? (isIphoneX() ? HEIGHT * 0.1 : HEIGHT * 0.13) : HEIGHT * 0.13
const CHECK_HEIGHT_SVG =
  Platform.OS === 'ios'
    ? isIphoneX()
      ? aspectRatio == 2.1653333333333333
        ? height * 0.15
        : height * 0.26
      : height * 0.16
    : height * 0.15
const CHECK_HEIGHT_VIEW_BOX_SVG =
  Platform.OS === 'ios'
    ? isIphoneX()
      ? aspectRatio == 2.1653333333333333
        ? height * 0.15
        : height * 0.2
      : CHECK_IPHONE
      ? height * 0.14
      : height * 0.068
    : height * 0.13
const CHECK_MARGIN_BOTTOM_ICON =
  Platform.OS === 'ios'
    ? isIphoneX()
      ? height * 0.03
      : CHECK_IPHONE
      ? IS_IP5
        ? height * 0.018
        : height * 0.06
      : height * 0.02
    : height * 0.06 //android
const { HOME, SHOP, LIVE_STREAM, NOTIFICATION, ACCOUNT } = MAIN_TAB

export const TAB_BAR: Record<string, TabBarOption> = {
  [HOME]: {
    name: MAIN_TAB.HOME,
    icon: R.images.ic_home,
    route: HomeScreen,
    title: R.strings().home,
  },
  [SHOP]: {
    name: MAIN_TAB.SHOP,
    icon: R.images.ic_shop,
    route: RequestFlowerScreen,
    title: 'Điện hoa' || R.strings().shop,
  },
  [LIVE_STREAM]: {
    name: MAIN_TAB.LIVE_STREAM,
    icon: R.images.ic_live_stream,
    route: LiveStreamScreen,
    title: 'Live stream',
  },
  [NOTIFICATION]: {
    name: MAIN_TAB.NOTIFICATION,
    icon: R.images.ic_notification,
    route: NotificationScreen,
    title: R.strings().notification,
  },
  [ACCOUNT]: {
    name: MAIN_TAB.ACCOUNT,
    icon: R.images.ic_home_acount,
    route: AccountScreen,
    title: R.strings().account,
  },
}

const Tab = createBottomTabNavigator()

const isNotLiveStream = (title: string) => {
  return title !== TAB_BAR.LIVE_STREAM.title
}
const RenderSVG = () => {
  let d =
    'M240.7 7H238.1C228.2 7.5 219.9 13.7 216.3 22.5C216 23.3 215.8 24.2 215.4 25C211 36 200.1 43.8 187.5 43.8C174.9 43.8 164 36 159.6 25C159.3 24.2 159 23.4 158.7 22.5C155.1 13.8 146.8 7.5 136.9 7H134.3H0V67H187.5H375V7H240.7Z'
  return (
    <Svg
      style={[styles.svgShadow]}
      width={WIDTH}
      height={CHECK_HEIGHT_SVG}
      viewBox={`0 7 ${375} ${CHECK_HEIGHT_VIEW_BOX_SVG + 10}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <Path
        d="M240.7 7h-2.6c-9.9.5-18.2 6.7-21.8 15.5-.3.8-.5 1.7-.9 2.5-4.4 11-15.3 18.8-27.9 18.8-12.6 0-23.5-7.8-27.9-18.8-.3-.8-.6-1.6-.9-2.5-3.6-8.7-11.9-15-21.8-15.5H0v60h375V7H240.7z"
        fill="white"
      />
    </Svg>
  )
}
const renderTabBar = (props: any) => {
  return (
    <Block
      style={[
        styles.navigatorContainer,
        { height: OS == 'android' ? HEIGHT * 0.11 : HEIGHT * 0.105 },
      ]}
    >
      <RenderSVG />
      <BottomTabBar {...props} style={[styles.customTabBar]} />
    </Block>
  )
}

const IconLiveStream = ({
  focused,
  route,
  tintColor,
}: {
  focused?: any
  route?: any
  tintColor?: any
}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:
          OS === 'ios'
            ? isNotLiveStream(TAB_BAR[route.name].title)
              ? 12
              : 0
            : 0,
      }}
    >
      {isNotLiveStream(TAB_BAR[route.name].title) ? (
        <FastImage
          style={styles.img_icon}
          tintColor={tintColor}
          source={TAB_BAR[route.name].icon}
          resizeMode={'contain'}
        />
      ) : (
        <LiveStreamButton style={styles.liveStreamBtn} />
      )}
      <Text
        style={[
          styles.txtLabel,
          {
            bottom: isNotLiveStream(TAB_BAR[route.name].title)
              ? 0
              : OS === 'ios'
              ? -25
              : -15,
            color: tintColor,
            fontFamily: focused ? R.fonts.sf_semi_bold : R.fonts.sf_regular,
          },
        ]}
        numberOfLines={1}
      >
        {route.name == MAIN_TAB.LIVE_STREAM ? '' : TAB_BAR[route.name].title}
      </Text>
    </View>
  )
}

export const Tabs = ({ route }: { route: RouteProps }) => {
  const { countNotification } = useAppSelector(
    state => state.NotificationReducer
  )
  const Dispatch = useAppDispatch()

  return (
    <Tab.Navigator
      tabBar={props => renderTabBar(props)}
      tabBarOptions={{
        keyboardHidesTabBar: false,
        tabStyle: {
          flexDirection: 'column',
        },
      }}
      screenOptions={({ navigation, route }) => ({
        tabBarIcon: ({ focused }) => {
          const tintColor = focused ? colors.primary : colors.focus
          if (route.name == MAIN_TAB.NOTIFICATION) {
            const renderCountBadge =
              countNotification?.toString().length! < 3
                ? countNotification
                : '99'

            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop:
                    OS === 'ios'
                      ? isNotLiveStream(TAB_BAR[route.name].title)
                        ? 12
                        : 0
                      : 0,
                }}
              >
                <FastImage
                  style={[styles.img_icon]}
                  tintColor={tintColor}
                  source={TAB_BAR[route.name].icon}
                />
                {!!countNotification && (
                  <View
                    style={[
                      styles.badge,
                      {
                        position: 'absolute',
                        right: '15%',
                        top: OS === 'ios' ? 8 : 0,
                      },
                    ]}
                    children={
                      <Text
                        style={{ ...fonts.medium10, color: colors.white }}
                        children={renderCountBadge}
                      />
                    }
                  />
                )}
                <Text
                  style={[
                    styles.txtLabel,
                    {
                      top: 0,
                      color: tintColor,
                      fontFamily: focused
                        ? R.fonts.sf_semi_bold
                        : R.fonts.sf_regular,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {TAB_BAR[route.name].title}
                </Text>
              </View>
            )
          }
          return (
            <IconLiveStream
              focused={focused}
              route={route}
              tintColor={tintColor}
            />
          )
        },
        tabBarLabel: ({ focused }) => null,
        tabBarButton: props => {
          return (
            <TouchableOpacity
              {...props}
              onPress={async e => {
                const token = await AsyncStorageService.getToken()
                if (route.name != MAIN_TAB.HOME && !token) {
                  showConfirm(
                    R.strings().notification,
                    R.strings().require_login_message,
                    () => {
                      NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
                    },
                    R.strings().login,
                    ''
                  )
                  return
                }
                if (props.onPress) props.onPress(e)
                // if (route.name == MAIN_TAB.NOTIFICATION) {
                //   Dispatch(
                //     requestListNotificationThunk({ page: DEFAULT_PARAMS.PAGE })
                //   )
                // }
                // if (route.name == MAIN_TAB.NOTIFICATION) {
                //   Dispatch(requestListNotificationThunk({ page: 1 }))
                // }
              }}
            />
          )
        },
      })}
    >
      {Object.keys(TAB_BAR).map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={TAB_BAR[item].name}
            component={TAB_BAR[item].route}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 11,
  },
  img_icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  liveStreamIcon: {
    width: 50,
    height: 50,
    // position: 'absolute',
    bottom: OS === 'android' ? 8 : 5,
    resizeMode: 'contain',
  },
  text_tab: {
    fontSize: 12,
    marginTop: 2,
  },
  txtLabel: {
    lineHeight: 20,
    fontSize: 12,
    // fontSize: Platform.OS == 'ios' ? 12 : 18,
  },
  badge: {
    ...styleView.centerItem,
    width: 17,
    height: 17,
    backgroundColor: colors.primary,
    borderRadius: 9,
    position: 'absolute',
    top: -3,
    right: -3,
  },
  navigatorContainer: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  customTabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderColor: 'transparent',
    height: scale(CHECK_HEIGHT_BOTTOM_TAB_BAR),
    elevation: 0,
  },
  svgShadow: {
    shadowColor: 'rgba(0, 0, 0, 1.0)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  liveStreamBtn: {
    position: 'absolute',
    width: width * 0.17,
    height: width * 0.17,
    bottom: CHECK_MARGIN_BOTTOM_ICON,
  },
})
