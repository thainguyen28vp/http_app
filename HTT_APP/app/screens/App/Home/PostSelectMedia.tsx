import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  Image,
  StyleSheet,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { Button } from '@app/components/Button/Button'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { fancyTimeFormat } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import Picker from 'react-native-image-crop-picker'
import reactotron from 'ReactotronConfig'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'

const { width, height } = dimensions
const RATIO = width / 375

const MEDIA_TYPE = {
  VIDEO: 'video',
  IMAGE: 'image',
}

const PostSelectMedia = (props: any) => {
  const addMedia = props.route.params?.addMedia

  const [listMedia, setListMedia] = useState<any>([])
  const [mediaUpload, setMediaUpload] = useState<Array<any>>([])
  const [mediaPickerLoading, setMediaPickerLoading] = useState<boolean>(false)

  const onGalleryPress = () => {
    setMediaPickerLoading(true)
    Picker.openPicker({
      multiple: true,
      cropping: false,
      mediaType: 'any',
      maxFiles: 50,
    })
      .then(media => {
        const listRes = media.map((item: any) => ({
          type: 'image',
          uri: item.path,
          playableDuration: item?.duration,
        }))
        setListMedia(listRes)
      })
      .catch(err => console.log(err))
      .finally(() => {
        setMediaPickerLoading(false)
      })
  }

  const onMediaPress = (item: any, index: number) => {
    let arr = [...mediaUpload]
    if (mediaUpload.some((ele: any) => ele.uri == item.uri)) {
      arr.splice(
        mediaUpload.findIndex((i: any) => i.uri == item.uri),
        1
      )
    } else {
      arr.push(item)
    }
    setMediaUpload(arr)
  }

  useEffect(() => {
    onGalleryPress()
  }, [])

  const renderMediaItem: ListRenderItem<any> = ({ item, index }) => {
    const isMediaExist = mediaUpload.some((ele: any) => ele.uri == item.uri)

    const mediaItem = (
      <View
        style={{
          width: 93 * RATIO,
          aspectRatio: 1,
          marginRight: 1 * RATIO,
          position: 'relative',
        }}
      >
        <Image
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          source={{ uri: item?.uri }}
        />
        {item?.type == MEDIA_TYPE.VIDEO && (
          <Text
            style={{
              color: colors.white,
              position: 'absolute',
              ...fonts.medium13,
              bottom: 4,
              right: 4,
            }}
            children={fancyTimeFormat(item?.playableDuration)}
          />
        )}
        <View
          style={{
            ...styleView.centerItem,
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isMediaExist ? '#D5A227' : colors.white,
            backgroundColor: isMediaExist ? '#D5A227' : '#E8E8E8',
            position: 'absolute',
            top: 4,
            right: 4,
          }}
          children={
            isMediaExist && (
              <Text
                style={{
                  ...fonts.semi_bold12,
                  color: isMediaExist ? colors.white : 'black',
                }}
                children={
                  mediaUpload.findIndex((i: any) => i.uri == item.uri) + 1
                }
              />
            )
          }
        />
      </View>
    )

    return (
      <Button onPress={() => onMediaPress(item, index)} children={mediaItem} />
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      onBack={() => {
        addMedia(mediaUpload)
        NavigationUtil.goBack()
      }}
      isLoading={mediaPickerLoading}
      titleHeader={'Chọn ảnh'}
    >
      {!listMedia.length ? (
        <View style={{ flex: 1, ...styleView.centerItem }}>
          <FastImage
            style={{ width: width / 1.5, height: height / 3.5 }}
            resizeMode={'contain'}
            source={R.images.ic_empty}
          />
          <Text
            style={{ ...fonts.regular14, marginVertical: 15 }}
            children={'Danh sách trống!'}
          />
          <Button
            onPress={onGalleryPress}
            children={
              <View
                style={styles.reloadBtn}
                children={
                  <Text
                    style={{ ...fonts.regular12, color: colors.white }}
                    children={'Thêm ảnh'}
                  />
                }
              />
            }
          />
        </View>
      ) : (
        <FlatList
          data={listMedia}
          bounces={false}
          renderItem={renderMediaItem}
          keyExtractor={(_, index) => `${index}`}
          numColumns={4}
          ItemSeparatorComponent={() => <View style={{ height: 1 * RATIO }} />}
        />
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  reloadBtn: {
    width: 100,
    height: 40,
    ...styleView.centerItem,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
})

export default PostSelectMedia
