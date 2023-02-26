import throttle from 'lodash/throttle'
import React, { memo, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, Button, Text, View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts } from '@app/theme'
import R from '@app/assets/R'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP, SCREEN_ROUTER_AUTH } from '@app/config/screenType'

const WelcomeScreen = (props: any) => {
  const requireDebouce = throttle(() => {
    console.log('throttle')
    requestLogin()
  }, 2000)

  let isMounted = false
  const [loading, setLoading] = React.useState(false)
  const requestLogin = () => {
    if (loading) {
      return
    }
    setLoading(true)
    console.log('request login')
    setTimeout(() => {
      if (!isMounted) {
        console.log('login component unmounted')
        return
      }
      setLoading(false)
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'SplashScreen' }],
      })
    }, 5000)
  }
  // React.useEffect(() => {
  //   console.log('login mounted')
  //   isMounted = true
  //   return () => {
  //     isMounted = false
  //     console.log('login unmounted')
  //   }
  // }, [])
  const scrollRef = useRef<ScrollView>(null)
  const keyboardShowRef = useRef(false)
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
    }
  }, [])

  const keyboardDidShow = (listener: KeyboardEvent) => {
    scrollRef.current?.scrollToEnd()
    keyboardShowRef.current = true
  }
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     alignItems: 'center',
    //     paddingTop: 100,
    //     backgroundColor: '#336',
    //   }}
    // >
    //   <Text style={{ marginBottom: 100 }}>Login</Text>
    //   <Button
    //     onPress={() => {
    //       requireDebouce()
    //     }}
    //     title="Login to continue"
    //   />
    //   <Button
    //     onPress={() => {
    //       props.navigation.pop()
    //     }}
    //     title="Cancel"
    //   />
    //   {loading && <ActivityIndicator />}
    // </View>
    <>
      <ScreenWrapper unsafe backgroundColor={colors.white}>

        <ImageBackground source={R.images.img_bgr_login}
          style={{ width: '100%', height: '100%' }}
          resizeMode='stretch'>
          <View style={{ position: 'absolute', width: '100%', bottom: 130 }}>
            <TouchableOpacity
              style={{ backgroundColor: colors.primary, margin: 20, padding: 20, alignItems: 'center', borderRadius: 10, }}
              onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
              }}
            >
              <Text style={styles.textButtonlogin} children={R.strings().login} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', margin: 20, padding: 20, alignItems: 'center', borderRadius: 10, marginTop: 0, }}
              onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER_AUTH.REGISTER)
              }}>
              <Text style={styles.textButton} children={R.strings().sign_up} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

      </ScreenWrapper>
    </>
  )
}
const styles = StyleSheet.create({
  textButton: {
    ...fonts.bold16,
    color: colors.black,
  },
  textButtonlogin: {
    ...fonts.bold16,
    color: colors.white,
  }
})

export default WelcomeScreen
