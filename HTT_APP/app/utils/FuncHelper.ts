import { EMOTIONS } from '@app/config/Constants'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { HEIGHT, WIDTH } from '@app/theme'
import moment from 'moment'
import { useCallback } from 'react'
import { Animated, Platform } from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import Share, { ShareOptions } from 'react-native-share'
import reactotron from 'reactotron-react-native'
import { showConfirm } from './GlobalAlertHelper'

export function formatPrice(num: string) {
  if (
    num === null ||
    num === undefined ||
    num == '0' ||
    Number.isNaN(parseFloat(num))
  )
    return ''
  var result = num.toString().replace(/,/g, '')
  return result
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    .replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|' '|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g,
      ''
    )
}

export function jsonToArray(jsonData: any) {
  var result = []
  for (var i in jsonData) result.push(jsonData[i])
  return result
}

export const phonePattern =
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/

export const mailPattern =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export function formatNumberToString(value: any) {
  if (!value) return ''
  return value.toString().split(',').join('')
}
export const pureString = /^[aA-zZ0-9\s]+$/

export const _move = (y, yScroll) => {
  var hide
  var currentOffset = y
  var direction =
    currentOffset > this.offset && currentOffset > 0 ? 'down' : 'up'
  if (currentOffset - this.offset > 10) hide = true
  if (currentOffset - this.offset < -10) hide = false
  this.offset = currentOffset

  if (direction == 'down' && hide) {
    Animated.spring(yScroll, {
      toValue: -200,
      useNativeDriver: false,
    }).start()
  }
  if ((direction == 'up' && !hide) || hide == undefined) {
    Animated.spring(yScroll, {
      toValue: 0,
      useNativeDriver: false,
    }).start()
  }
}

export const keyboardType = Platform.OS === 'android' ? 'numeric' : 'number-pad'

export const dateToString = (dateTime: Date) =>
  `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`

export const formatDate = (date: string) => {
  return date.replace(/-/g, '/')
}

export function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600)
  var mins = ~~((duration % 3600) / 60)
  var secs = ~~duration % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

export function convertPhToAssetLib(path: any, isPhoto: boolean) {
  if (/^[ph]{2}/.test(path)) {
    const appleId = path.substring(5, 41)
    const ext = isPhoto ? 'JPG' : 'MOV'
    return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`
  } else return path
}

export const handlePrice = (Price: String) => {
  if (Price) {
    let price = Price.split('-')
    let compare = price[0].trim() === price[1].trim()
    if (compare) return price[0]
    return Price
  }
  return '0đ'
}

export const countProduct = (count: number) => {
  if (count > 99) return '99+'
  return count
}

export const checkExistUser = async (func?: () => void) => {
  const token = await AsyncStorageService.getToken()

  if (!token) {
    showConfirm(
      '',
      'Vui lòng đăng nhập để thực hiện chức năng này!',
      () => {
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
      },
      'Đăng nhập'
    )
  } else !!func && func()
}

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export const returnReact = (type: number) => {
  switch (type) {
    case EMOTIONS.HEART.id:
      return EMOTIONS.HEART.icon
    case EMOTIONS.HAHA.id:
      return EMOTIONS.HAHA.icon
    case EMOTIONS.LIKE.id:
      return EMOTIONS.LIKE.icon
    case EMOTIONS.WOW.id:
      return EMOTIONS.WOW.icon
  }
}

export const handleShareSocial = (message?: string, url?: string) => {
  let options: ShareOptions = {
    title: 'Hoa Thanh Tước',
    message:
      message ||
      `Ứng dụng Hoa Thanh Tước xin gửi lời chào đến bạn! Để hiểu thêm Hoa Thanh Tước cũng như dịch vụ mà chung tôi cung cấp, xin vui lòng truy cập đường dẫn sau: https://www.facebook.com/khohoathanhtuoc/`,
    url: url || 'https://www.facebook.com/khohoathanhtuoc/',
  }
  Share.open(options)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      err && console.log(err)
    })
}

export const randomIDReaction = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const handleResizeImage = async res => {
  var url
  let actualWidth = res.width
  let actualHeight = res.height
  var imgRatio = actualWidth / actualHeight
  var maxRatio = HEIGHT / HEIGHT
  if (actualHeight > HEIGHT || actualWidth > WIDTH) {
    if (imgRatio < maxRatio) {
      imgRatio = HEIGHT / actualHeight
      actualWidth = imgRatio * actualWidth
      actualHeight = HEIGHT
    } else if (imgRatio > maxRatio) {
      imgRatio = WIDTH / actualWidth
      actualHeight = imgRatio * actualHeight
      actualWidth = WIDTH
    } else {
      actualHeight = HEIGHT
      actualWidth = WIDTH
    }
  }
  try {
    const response = await ImageResizer.createResizedImage(
      res.path,
      actualWidth,
      actualHeight,
      'JPEG',
      70,
      0
    )
    url = response
  } catch (error) {
    url = res
  }
  return url
}

export const handleCompareTime = useCallback((dataConfig: any) => {
  let start: any = moment.unix(dataConfig?.pre_order_from_time)
  let end: any = moment.unix(dataConfig?.pre_order_end_time)
  let timeStart = new Date(start)
  let timeNow = new Date()
  let timeEnd = new Date(end)
  let miniSecondTimeStart =
    timeStart.getHours() * (60 * 60 * 60) + timeStart.getMinutes() * 3600
  let miniSecondTimeNow =
    timeNow.getHours() * (60 * 60 * 60) + timeNow.getMinutes() * 3600
  let miniSecondTimeEnd =
    timeEnd.getHours() * (60 * 60 * 60) + timeEnd.getMinutes() * 3600
  return (
    (miniSecondTimeStart <= miniSecondTimeNow &&
      miniSecondTimeNow <= miniSecondTimeEnd) ||
    miniSecondTimeStart <= miniSecondTimeNow ||
    miniSecondTimeNow <= miniSecondTimeEnd
  )
}, [])
