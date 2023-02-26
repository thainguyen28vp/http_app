import React, { useEffect, useState } from 'react'
import { View, Text, ViewStyle } from 'react-native'
import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import useMediaData, {
  MEDIA_TYPE,
} from '@app/components/MediaSwiper/hooks/useMediaData'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import reactotron from 'ReactotronConfig'
import { PostMedia } from '../model/Forum'
import { createThumbnail } from 'react-native-create-thumbnail'
import FastImage from 'react-native-fast-image'
import { fancyTimeFormat } from '@app/utils/FuncHelper'

interface Props {
  data: Array<PostMedia>
}

const { width } = dimensions
const ACTUAL_WIDTH = width - 30
const RATIO = width / 375

const PostImageArea = (props: Props) => {
  const { data } = props

  let duration = data.filter((item: any) => {
    if (item?.type == 2) return item.duration
  })
  let { dataMedia } = useMediaData(data.map(item => item.media_url))

  // if (dataMedia[0]?.type == MEDIA_TYPE.VIDEO) {
  //   dataMedia.splice(0, 1)
  // }
  const count = dataMedia?.length

  const [thumbnailVideo, setThumbnailVideo] = useState<string>()
  const [isLoadingThumb, setIsLoadingThumb] = useState<boolean>(true)
  // const [duration, setDuration] = useState(0)

  const renderThumbnail = async () => {
    try {
      setIsLoadingThumb(true)
      const thumbnail = await createThumbnail({
        url: dataMedia[0]?.url,
        format: 'jpeg',
        timeStamp: 0,
      })
      setThumbnailVideo(thumbnail.path)
    } catch (err) {
      // console.log(err)
    } finally {
      setIsLoadingThumb(false)
    }
  }

  useEffect(() => {
    // dataMedia[0]?.type == MEDIA_TYPE.VIDEO && renderThumbnail()
  }, [])

  const renderFisrtImage = (style?: ViewStyle) => {
    if (dataMedia[0]?.type == MEDIA_TYPE.VIDEO) {
      // if (isLoadingThumb)
      //   return (
      //     <View style={[{ ...styleView.centerItem }, style]}>
      //       <ActivityIndicator size="small" />
      //     </View>
      //   )
      return (
        <View style={style}>
          <FstImage
            style={{ width: '100%', height: '100%', borderRadius: 5 }}
            source={{
              uri: duration[0]?.video_thumbnail,
            }}
            resizeMode={'cover'}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.3)' }}>
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  ...styleView.centerItem,
                }}
              >
                <FastImage
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    opacity: 0.7,
                  }}
                  source={R.images.img_play_video}
                  tintColor={colors.white}
                />
              </View>
            </View>
          </FstImage>

          <View
            style={{
              bottom: 5,
              right: 5,
              position: 'absolute',
              backgroundColor: 'rgba(1,1,1,0.5)',
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                color: colors.white,
                ...fonts.medium13,
              }}
              children={fancyTimeFormat(duration[0]?.duration / 1000 + 1)}
            />
          </View>
        </View>
      )
    } else
      return (
        <View style={style}>
          <FstImage
            style={{ width: '100%', height: '100%', borderRadius: 5 }}
            source={{ uri: dataMedia[0]?.url }}
            resizeMode={'cover'}
          />
        </View>
      )
  }

  const renderImage = () => {
    switch (count) {
      case 0:
        return (
          <View>
            <FastImage
              style={{
                width: 345 * RATIO,
                height: 229 * RATIO,
                borderRadius: 5 * RATIO,
              }}
              source={R.images.img_default}
            />
          </View>
        )
      case 1:
        return renderFisrtImage({
          width: 345 * RATIO,
          height: 229 * RATIO,
          borderRadius: 5 * RATIO,
        })
      case 2:
        return (
          <View
            style={{ flex: 1, ...styleView.rowItemBetween, aspectRatio: 1.5 }}
          >
            {renderFisrtImage({
              width: 171 * RATIO,
              height: '100%',
              borderRadius: 5,
            })}
            <View
              style={{ width: ACTUAL_WIDTH * 0.495 }}
              children={
                <FstImage
                  style={{ width: '100%', height: '100%', borderRadius: 5 }}
                  source={{ uri: dataMedia[1]?.url }}
                  resizeMode={'cover'}
                />
              }
            />
          </View>
        )
      case 3:
        return (
          <View style={{ flex: 1, ...styleView.rowItemBetween }}>
            {renderFisrtImage({ width: 229 * RATIO })}
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginLeft: 3 * RATIO,
              }}
            >
              <View
                style={{ width: '100%', height: 113 * RATIO }}
                children={
                  <FstImage
                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                    source={{ uri: dataMedia[1]?.url }}
                    resizeMode={'cover'}
                  />
                }
              />
              <View
                style={{
                  width: '100%',
                  height: 113 * RATIO,
                  marginTop: 3 * RATIO,
                }}
                children={
                  <FstImage
                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                    source={{ uri: dataMedia[2]?.url }}
                    resizeMode={'cover'}
                  />
                }
              />
            </View>
          </View>
        )
      default:
        return (
          <View style={{ ...styleView.rowItemBetween, height: 229 * RATIO }}>
            {renderFisrtImage({ width: 229 * RATIO })}
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginLeft: 3 * RATIO,
              }}
            >
              <View
                style={{ width: '100%', height: 113 * RATIO }}
                children={
                  <FstImage
                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                    source={{ uri: dataMedia[1]?.url }}
                    resizeMode={'cover'}
                  />
                }
              />
              <View
                style={{
                  width: '100%',
                  height: 113 * RATIO,
                  marginTop: 3 * RATIO,
                }}
                children={
                  <FstImage
                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                    source={{ uri: dataMedia[2]?.url }}
                    resizeMode={'cover'}
                  />
                }
              />
              <View
                style={{
                  ...styleView.centerItem,
                  width: '100%',
                  height: 113 * RATIO,
                  backgroundColor: 'rgba(0,0,0,.4)',
                  position: 'absolute',
                  bottom: 0,
                  borderRadius: 5,
                }}
                children={
                  <Text
                    style={{ ...fonts.regular24, color: colors.white }}
                    children={`+${count - 3}`}
                  />
                }
              />
            </View>
          </View>
        )
    }
  }

  return <View style={{ width: '100%' }}>{renderImage()}</View>
}

export default PostImageArea
