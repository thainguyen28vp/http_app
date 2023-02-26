import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions'
import { Platform } from 'react-native'
import { showConfirm } from '@app/utils/GlobalAlertHelper'

const PHOTO_PERMISSION = {
  ANDROID: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  IOS: PERMISSIONS.IOS.PHOTO_LIBRARY,
}

export const checkPickerPermission = async () => {
  const permission = await check(
    Platform.OS == 'ios' ? PHOTO_PERMISSION.IOS : PHOTO_PERMISSION.ANDROID
  )

  const requestOpenSetting = () => {
    showConfirm(
      '',
      'Bạn cần cấp quyền truy cập ảnh trong cài đặt để cho phép chức năng này hoạt động',
      () => openSettings(),
      'Cài đặt'
    )
  }

  const requestPickerPermission = async () => {
    const requestRes = await request(
      Platform.OS == 'ios' ? PHOTO_PERMISSION.IOS : PHOTO_PERMISSION.ANDROID
    )

    if (requestRes == RESULTS.GRANTED) console.log('granted')
  }

  switch (permission) {
    case RESULTS.GRANTED:
      return
    case RESULTS.DENIED:
      return requestPickerPermission()
    case RESULTS.BLOCKED:
      return requestOpenSetting()
  }
}
