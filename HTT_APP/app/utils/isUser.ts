import R from '@app/assets/R'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import AsyncStorage from '@react-native-community/async-storage'
import { showConfirm } from './AlertHelper'

const isUser = async (action: () => void) => {
  const token = await AsyncStorageService.getToken()
  // const user = await AsyncStorage.getItem('user_id')

  if (!token) {
    showConfirm(
      R.strings().notification,
      R.strings().require_login_message,
      () => {
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
      }
    )
    return
  }
  action()
}

export default isUser
