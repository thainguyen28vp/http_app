import R from '@app/assets/R'
import { BASE_REQUEST } from '@app/config/Constants'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { STATUS_LIST_LIVE } from '@app/screens/App/Livestream/YoutubeWatchingScreen'
import { ResponseType } from '@app/service/Network/model/ApiResponse'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import AsyncStorage from '@react-native-community/async-storage'
import reactotron from 'reactotron-react-native'
import AsyncStoreService from '../AsyncStorage/AsyncStorageService'
// import NavigationUtil from '@app/navigation/NavigationUtil';
const STOP_PING = 11
const START_LIVE = 19

const createAPI = () => {
  const APIInstant = require('axios').default.create()
  APIInstant.defaults.baseURL = BASE_REQUEST.API_URL
  APIInstant.defaults.timeout = 60000
  APIInstant.defaults.headers = { 'Content-Type': 'application/json' }
  APIInstant.interceptors.request.use(async (config: any) => {
    config.headers.token = (await AsyncStoreService.getToken()) || ''
    config.headers.platform = 'app'
    return config
  }, Promise.reject)

  APIInstant.interceptors.response.use(
    (response: ResponseType<any>) => {
      const data = response.data
      if (data && data.code === 401) {
        showMessages(R.strings().notification, R.strings().re_login, () => {
          AsyncStorage.setItem('token', '').then(() => {
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          })
        })
      } else if (data && data.status !== 1) {
        // if (data.code === STOP_PING) {
        //   showMessages(
        //     R.strings().notification,
        //     'Mất kết nối đến máy chủ! Vui lòng khởi tạo livestream mới.',
        //     () => {
        //       setTimeout(() => {
        //         NavigationUtil.pop(2)
        //       }, 300)
        //     }
        //   )
        //   return
        // }
        if (data.code === START_LIVE) {
          return
        }
        if (data && data.status) {
          return
        }
        if (data.code == 9 && data.status == 0) {
          showMessages(R.strings().notification, data.message)
          return
        }
        showMessages(R.strings().notification, data.message)
      }
      return response
    },
    (err: Error) => {
      console.log(err)
    }
  )
  return APIInstant
}

const axiosClient = createAPI()

function handleResult<T>(api: any) {
  return api.then((res: any) => {
    return handleResponse<T>(res.data)
  })
}

function handleResponse<T>(data: ResponseType<T>) {
  if (data.status !== 1)
    return Promise.reject(new Error(data?.message || 'Co loi xay ra'))
  return Promise.resolve(data)
}

export const ApiClient = {
  get: (url: string, payload?: any) =>
    handleResult(axiosClient.get(url, payload)),
  post: (url: string, payload?: any, options?: any) =>
    handleResult(axiosClient.post(url, payload, options)),
  put: (url: string, payload?: any) =>
    handleResult(axiosClient.put(url, payload)),
  path: (url: string, payload?: any) =>
    handleResult(axiosClient.patch(url, payload)),
  delete: (url: string, payload?: any) =>
    handleResult(axiosClient.delete(url, payload)),
}
