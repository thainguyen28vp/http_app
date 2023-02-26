import { useEffect } from 'react'
import { Alert, BackHandler, Linking, StyleSheet } from 'react-native'
import VersionCheck from 'react-native-version-check'
import reactotron from 'ReactotronConfig'

const AppUpdateChecker = () => {
  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate()
      if (updateNeeded && updateNeeded.isNeeded) {
        //Alert the user and direct to the app url
        Alert.alert(
          'Có bản cập nhật mới',
          'Bạn vui lòng cập nhật ứng dụng lên phiên bản mới nhất để tiếp tục sử dụng.',
          [
            {
              text: 'Cập nhật',
              onPress: () => {
                BackHandler.exitApp()
                Linking.openURL(updateNeeded.storeUrl)
              },
            },
            {
              text: 'Để sau',
              style: 'cancel',
              onPress: () => { },
            },
          ],
          { cancelable: true }
        )
      }
    } catch (err) {
      console.log('CheckUpdateStore', err)
    }
  }

  useEffect(() => {
    checkUpdateNeeded()
  }, [])
  return null
}

export default AppUpdateChecker

const styles = StyleSheet.create({})
