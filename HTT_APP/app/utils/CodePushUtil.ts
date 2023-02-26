import store from '@app/store'
import CodePush from 'react-native-code-push'
import Toast from 'react-native-toast-message'
import reactotron from 'reactotron-react-native'
import { showConfirm, showMessages } from './AlertHelper'

export default abstract class CodePushUtil {
  static appName: string = 'HoaThanhTuoc®'
  static appVersion?: string
  static cpVersion?: string
  static isUpToDate: boolean = true
  static isChecking: boolean = false

  static disAllowRestart = () => {
    CodePush.disallowRestart()
  }

  static getCodePushMetadata = () => {
    CodePush.getUpdateMetadata()
      .then(res => {
        this.appVersion = res?.appVersion
        this.cpVersion = res?.label
      })
      .catch(err => {})
  }

  static checkCodePushUpdate = (showMsgUpToDate?: boolean) => {
    this.isChecking = true
    CodePush.checkForUpdate().then(update => {
      if (!!update) {
        this.isChecking = false
        this.isUpToDate = false
        showConfirm(
          'Có bản cập nhật mới',
          'Bạn có muốn cài đặt và khởi động lại ứng dụng?',
          () => {
            Toast.show({
              type: 'info',
              text1: `Bản cập nhật ${update.appVersion} ${update.label}`,
              text2: `Ứng dụng sẽ tự khởi động lại sau khi cập nhật hoàn tất!`,
              visibilityTime: 3000,
            })
            CodePush.sync(
              {
                updateDialog: undefined,
                installMode: CodePush.InstallMode.IMMEDIATE,
              },
              status => {
                if (
                  status == CodePush.SyncStatus.DOWNLOADING_PACKAGE ||
                  status == CodePush.SyncStatus.CHECKING_FOR_UPDATE ||
                  status == CodePush.SyncStatus.SYNC_IN_PROGRESS ||
                  status == CodePush.SyncStatus.INSTALLING_UPDATE
                ) {
                  this.isUpToDate = true
                } else {
                  this.isUpToDate = false
                }
                if (status == CodePush.SyncStatus.UPDATE_INSTALLED) {
                  Toast.show({
                    type: 'info',
                    text1: `Cập nhật thành công`,
                    text2: `Ứng dụng sẽ được khởi động lại sau 3 giây`,
                    visibilityTime: 2000,
                  })
                  setTimeout(() => {
                    CodePush.allowRestart()
                    CodePush.restartApp()
                  }, 3000)
                }
              },
              progress => {
                let data = progress.receivedBytes / progress.totalBytes
                store.dispatch({
                  type: 'DATA_CODE_PUSH',
                  payload: data,
                })
              }
            )
          },
          '',
          'Cập nhật'
        )
      } else {
        this.isChecking = false
        showMsgUpToDate &&
          Toast.show({
            type: 'info',
            text1: `Thông báo`,
            text2: `Ứng dụng đã cập nhật phiên bản mới nhất`,
            visibilityTime: 1000,
          })
        this.isUpToDate = true
      }
    })
  }

  static getVersionWithLabel = () => {
    return !!this.appVersion && !!this.cpVersion
      ? `${this.appName} ${this.appVersion} ${this.cpVersion}`
      : `${this.appName}`
  }
}
