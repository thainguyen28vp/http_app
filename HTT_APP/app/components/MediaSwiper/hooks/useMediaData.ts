import { useMemo } from 'react'

interface Payload {
  dataMedia: Array<MediaItem>
}

export type MediaItem = {
  url: string
  type: MEDIA_TYPE | undefined
}

export enum MEDIA_TYPE {
  IMAGE = 0,
  VIDEO,
  OTHER,
}

const IMAGE = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'jfif',
  'JPG',
  'JPEG',
  'HEIC',
  'WEBP',
  'GIF',
]
const VIDEO = ['mp4', 'avi', 'mov', 'MP4', 'MOV', 'AVI']

const useMediaData = (data: any): Payload => {
  const fileExtension = (file: string) => {
    if (!file) return
    const pattern = new RegExp('.[0-9a-zA-Z]+$')
    const extension = file.match(pattern)?.toString().slice(1)

    return IMAGE.includes(extension!)
      ? MEDIA_TYPE.IMAGE
      : VIDEO.includes(extension!)
      ? MEDIA_TYPE.VIDEO
      : MEDIA_TYPE.OTHER
  }

  const dataMedia = useMemo(() => {
    let list = Array.isArray(data) ? data : [data]

    var dataParser = list
      .map((item: string) => ({ url: item, type: fileExtension(item) }))
      .filter((item: MediaItem) => item.type !== MEDIA_TYPE.OTHER)

    dataParser.forEach((item, index) => {
      if (item.type == MEDIA_TYPE.VIDEO) {
        dataParser.splice(index, 1)
        dataParser.unshift(item)
      }
    })

    return dataParser
  }, [data])

  return { dataMedia }
}

export default useMediaData
