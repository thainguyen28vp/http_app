import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ListRenderItem,
  FlatList,
  Platform,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import FastImage from 'react-native-fast-image'
import { Button } from '@app/components/Button/Button'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getListTopic,
  requestEditPost,
} from '@app/service/Network/home/HomeApi'
import Picker from 'react-native-image-crop-picker'
import reactotron from 'ReactotronConfig'
import { convertPhToAssetLib, fancyTimeFormat } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppSelector } from '@app/store'
import Modal from 'react-native-modal'
import SelectTopicView, { TopicItem } from './component/SelectTopicView'
import { checkPickerPermission } from './utils/HomeUtils'
import useMediaData from '@app/components/MediaSwiper/hooks/useMediaData'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import MediaPickerModal from '@app/components/MediaPickerModal'
import LoadingProgress from '@app/components/LoadingProgress'
import { createThumbnail } from 'react-native-create-thumbnail'
import { requestUploadImage } from '@app/service/Network/livestream/LiveStreamApi'

const { width } = dimensions
const RATIO = width / 375

const MEDIA_TYPE = {
  VIDEO: 'video',
  IMAGE: 'image',
}

const MAX_FILE_UPLOAD_IMAGE = 10
const MAX_FILE_UPLOAD_VIDEO = 11

const EditPostScreen = (props: any) => {
  const postData = props.route.params?.data
  const reloadList = props.route.params?.reloadList

  const { dataMedia } = useMediaData(
    postData.PostMedia.map((item: any) => {
      // reactotron.logImportant!({ item })
      return item.media_url
    })
  )

  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [mediaPickerLoading, setMediaPickerLoading] = useState<boolean>(false)
  const [content, setContent] = useState<string>(postData.content)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listMedia, setListMedia] = useState<any>(
    dataMedia.map((item, index) => ({
      uri: item.url,
      type: item.type == 0 ? MEDIA_TYPE.IMAGE : MEDIA_TYPE.VIDEO,
      id:
        index == 0
          ? postData.PostMedia[postData.PostMedia?.length - 1]?.id
          : postData.PostMedia[index - 1]?.id,
      playableDuration:
        index == 0
          ? postData.PostMedia[postData.PostMedia?.length - 1]?.duration
          : postData.PostMedia[index - 1]?.duration,
      video_thumbnail:
        index == 0
          ? postData.PostMedia[postData.PostMedia?.length - 1]?.video_thumbnail
          : postData.PostMedia[index - 1]?.video_thumbnail,
    }))
  )
  const [listTopic, setListTopic] = useState<Array<TopicItem>>([])
  const [currentTopic, setCurrentTopic] = useState<TopicItem>({
    label: postData.Topic.name,
    value: postData.Topic.id,
  })
  const [modalTopicVisible, setModalTopicVisible] = useState<boolean>(false)
  const [listDeleteMedia, setListDeleteMedia] = useState<Array<number>>([])

  const { data } = useAppSelector(state => state.accountReducer)
  const profile_avt = data?.avatar

  const onPostPress = () => {
    if (!content.trim().length) {
      showMessages('', 'Mô tả không được để trống')
      return
    } else if (!currentTopic.label) {
      showMessages('', 'Chưa chọn chủ đề')
      return
    }

    const body = new FormData()
    body.append('topic_id', `${currentTopic.value}`)
    body.append('content', content.trim())
    !!listDeleteMedia.length &&
      listDeleteMedia.forEach((item: any) => {
        body.append('media_delete', `${item}`)
      })
    listMedia.forEach((item: any) => {
      if (!item?.id) {
        if (item.typeMedia == MEDIA_TYPE.VIDEO) {
          body.append('post_video', {
            name: item.name,
            type: item.type,
            uri: item?.uri,
          })
          body.append('duration', item.playableDuration)
          body.append('video_thumbnail', item.urlThumbnail)
        } else
          body.append('post_media', {
            name: `images${new Date().getTime()}.png`,
            type: 'image/png',
            filename: 'image.png',
            uri:
              Platform.OS == 'ios'
                ? convertPhToAssetLib(item.uri, item.type == MEDIA_TYPE.IMAGE)
                : item.uri,
          })
      }
    })
    callAPIHook({
      API: requestEditPost,
      payload: { id: postData.id, body },
      useLoading: setIsLoading,
      onSuccess: res => {
        showMessages('', 'Cập nhật bài đăng thành công!', () => {
          !!reloadList && reloadList()
          NavigationUtil.goBack()
        })
      },
    })
  }

  const getTopic = () => {
    callAPIHook({
      API: getListTopic,
      onSuccess: res => {
        setListTopic(
          res.data.map((item: any) => ({ label: item.name, value: item.id }))
        )
      },
    })
  }

  const onDeleteMedia = (media: any, index: number) => {
    if (!!media.id) setListDeleteMedia(prev => [...prev, media.id])
    let cloneListMedia = [...listMedia]
    cloneListMedia.splice(index, 1)
    setListMedia(cloneListMedia)
  }
  const addMedia = (media: Array<any>) => {
    let cloneListImage = [...listMedia, ...media]
    setListMedia(cloneListImage)
  }

  const handleOnPicker = async (res: any) => {
    if (listMedia?.length > MAX_FILE_UPLOAD_IMAGE) {
      showMessages(
        'Thông báo',
        `Số lượng tối đa của ảnh/video là ${MAX_FILE_UPLOAD_IMAGE}.`
      )
      return
    }
    const cloneListMedia = [
      ...listMedia,
      {
        type: 'image',
        uri: res.path,
        id: null,
      },
    ]
    setListMedia(cloneListMedia)
    const cloneListImage = [...listMedia]
    const listRes = res.data.map((item: any, index: any) => ({
      type: item.filename,
      uri: item.path,
      playableDuration: item?.duration,
      typeMedia: MEDIA_TYPE.IMAGE,
    }))
    let concatData = [...cloneListImage, ...listRes]
    if (!!listMedia.length) {
      if (concatData?.length > MAX_FILE_UPLOAD_IMAGE) {
        showMessages(
          'Thông báo',
          `Số lượng ảnh tối đa là ${MAX_FILE_UPLOAD_IMAGE}.`,
          () => {
            setListMedia(concatData.slice(0, MAX_FILE_UPLOAD_IMAGE))
          }
        )
        return
      }
      setListMedia(concatData)
    } else {
      if (concatData?.length > MAX_FILE_UPLOAD_IMAGE) {
        showMessages(
          'Thông báo',
          `Số lượng ảnh tối đa là ${MAX_FILE_UPLOAD_IMAGE}.`,
          () => {
            setListMedia(concatData.slice(0, MAX_FILE_UPLOAD_IMAGE))
          }
        )
        return
      }
      setListMedia(listRes)
    }
  }

  const onGalleryPress = () => {
    setMediaPickerLoading(true)
    Picker.openPicker({
      multiple: true,
      cropping: false,
      mediaType: 'video',
      maxFiles: 1,
      compressVideoPreset: 'MediumQuality',
    })
      .then(async media => {
        setMediaPickerLoading(true)
        if (media[0].size / (1024 * 1024) > 199) {
          showMessages(
            'Thông báo',
            'Dung lượng video tối đa cho phép là 200MB.'
          )
          return
        }
        if (
          listMedia?.some(
            (item: any) =>
              item.typeMedia == MEDIA_TYPE.VIDEO ||
              item.type == MEDIA_TYPE.VIDEO
          )
        ) {
          showMessages(
            'Thông báo',
            'Video tối đa có thể chọn là 1 video! Để chọn video khác, vui lòng xoá video đã chọn trước đó.'
          )
          return
        }
        const cloneListImage = [...listMedia]
        createThumbnail({
          url: media[0].path,
          timeStamp: parseInt('1000', 10),
        })
          .then(thumbnail => {
            const formData = new FormData()
            formData.append('file', {
              name: `images${new Date().getTime()}.jpg`,
              type: 'image/jpeg',
              uri: thumbnail.path,
            })
            const payload = {
              type: 1,
              formData,
            }

            callAPIHook({
              API: requestUploadImage,
              payload: payload,
              // useLoading: setIsLoading,
              onSuccess: res => {
                const listRes = media.map((item: any, index: any) => ({
                  urlThumbnail: res.data.url,
                  uri: item.path,
                  typeMedia: MEDIA_TYPE.VIDEO,
                  type: item.mime,
                  name:
                    Platform.OS !== 'ios'
                      ? item.path.substring(item.path.lastIndexOf('/') + 1)
                      : item.filename,
                  playableDuration: item?.duration,
                }))
                let concatData = [...listRes, ...cloneListImage]
                if (!!listMedia.length) {
                  if (listRes?.length > 1) {
                    showMessages(
                      'Thông báo',
                      `Số lượng video tối đa là ${1}!`,
                      () => {
                        setListMedia([
                          ...listRes.slice(0, 1),
                          ...cloneListImage,
                        ])
                      }
                    )
                    return
                  }
                  setListMedia(concatData)
                } else {
                  if (listRes?.length > 1) {
                    showMessages(
                      'Thông báo',
                      `Số lượng video tối đa là ${1}!`,
                      () => {
                        setListMedia(concatData.slice(0, 1))
                      }
                    )
                    return
                  }
                  setListMedia(listRes)
                }
              },
              onError: err => {
                showMessages(
                  R.strings().notification,
                  'Tải ảnh lỗi! Vui lòng thử lại.'
                )
              },
            })
          })
          .catch(() => {
            const listRes = media.map((item: any) => ({
              type: item.filename,
              uri: item.path,
              playableDuration: item?.duration,
            }))
            if (!!listMedia.length)
              setListMedia([...cloneListImage, ...listRes])
            else setListMedia(listRes)
          })
      })
      .catch(err => console.log(err))
      .finally(() => {
        setMediaPickerLoading(false)
      })
  }

  const onCameraPress = () => {
    Picker.openCamera({
      width: 400,
      height: 400,
      cropping: false,
      mediaType: 'any',
    }).then(res => {
      const cloneListMedia = [
        ...listMedia,
        {
          type: 'image',
          uri: res.path,
          id: null,
        },
      ]
      setListMedia(cloneListMedia)
    })
  }

  useEffect(() => {
    getTopic()
  }, [])

  const renderMediaItem: ListRenderItem<any> = ({ item, index }) => {
    reactotron.logImportant!({ item })
    const mediaItem = (
      <View
        style={{
          width: 93 * RATIO,
          aspectRatio: 1,
          marginRight: 1 * RATIO,
          position: 'relative',
        }}
      >
        <FstImage
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              item?.typeMedia == MEDIA_TYPE.VIDEO ||
              item?.type == MEDIA_TYPE.VIDEO
                ? item.urlThumbnail || item?.video_thumbnail
                : item?.uri,
          }}
          resizeMode={'cover'}
        />
        {(item?.typeMedia == MEDIA_TYPE.VIDEO ||
          item?.type == MEDIA_TYPE.VIDEO) && (
          <View
            style={{
              bottom: 2,
              right: 2,
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
              children={fancyTimeFormat(
                (item?.playableDuration || item?.duration) / 1000 + 1
              )}
            />
          </View>
        )}
        {item?.typeMedia !== MEDIA_TYPE.VIDEO ||
        item?.type !== MEDIA_TYPE.VIDEO ? (
          <Button
            style={{ position: 'absolute', top: 4, right: 4 }}
            onPress={() => onDeleteMedia(item, index)}
            children={
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                }}
                source={R.images.ic_x}
              />
            }
          />
        ) : null}
        <View
          style={{
            backgroundColor: 'rgba(1,1,1,0.5)',
            position: 'absolute',
            left: 5,
            top: 5,
            height: 20,
            width: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25 / 2,
          }}
          children={
            <Text
              style={{
                color: colors.primary,
                ...fonts.bold12,
                textDecorationLine: 'underline',
              }}
              children={`${index + 1}`}
            />
          }
        />

        {(item?.typeMedia == MEDIA_TYPE.VIDEO ||
          item?.type == MEDIA_TYPE.VIDEO) && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              style={{ position: 'absolute', top: 4, right: 4 }}
              onPress={() => onDeleteMedia(item, index)}
              children={
                <FastImage
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={R.images.ic_x}
                />
              }
            />
            <FastImage
              style={{
                width: 30,
                height: 30,
              }}
              source={R.images.ic_play}
            />
          </View>
        )}
      </View>
    )

    return mediaItem
  }

  const renderBody = () => {
    return (
      <React.Fragment>
        <View style={styles.containerView}>
          <View style={{ ...styleView.rowItem, marginBottom: 15 }}>
            <FstImage
              style={{ width: 46, height: 46, borderRadius: 23 }}
              source={profile_avt ? { uri: profile_avt } : R.images.img_user}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ ...fonts.semi_bold15 }} children={data?.name} />
              {!!listTopic.length && (
                <Button
                  onPress={() => setModalTopicVisible(true)}
                  children={
                    <View
                      style={{
                        ...styleView.rowItemBetween,
                        marginTop: 6,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        backgroundColor: '#E8E8E8',
                        borderRadius: 16,
                      }}
                    >
                      <Text
                        style={{ ...fonts.regular14, color: '#595959' }}
                        children={currentTopic.label}
                      />
                      <FastImage
                        style={{ width: 20, height: 20, marginLeft: 13 }}
                        source={R.images.ic_down}
                      />
                    </View>
                  }
                />
              )}
            </View>
          </View>
          <TextInput
            value={content}
            onChangeText={text => setContent(text)}
            multiline
            placeholderTextColor={'#8C8C8C'}
            style={styles.input}
            placeholder={'Mô tả bài đăng của bạn'}
          />
        </View>
        <View style={styles.footer}>
          <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
            <Button
              onPress={() => {
                onGalleryPress()
                // onCameraPress()
              }}
              children={
                <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                  <FastImage
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    source={R.images.img_video}
                  />
                  <Text style={{ ...fonts.regular16 }} children={'Video'} />
                </View>
              }
            />
            <View style={styles.separator} />
            <Button
              onPress={
                () => setIsVisible(!isVisible)
                // NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_SELECT_MEDIA, {
                //   addMedia: (media: any) => addMedia(media),
                // })
              }
              children={
                <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                  <FastImage
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    source={R.images.ic_image}
                  />
                  <Text style={{ ...fonts.regular16 }} children={'Hình ảnh'} />
                </View>
              }
            />
          </View>
          <Button
            onPress={onPostPress}
            children={
              <View style={styles.btnPost}>
                <Text
                  style={{ ...fonts.regular16, color: colors.white }}
                  children={'Lưu'}
                />
              </View>
            }
          />
        </View>
      </React.Fragment>
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      // isLoading={isLoading}
      titleHeader={'Sửa bài viết'}
    >
      {renderBody()}
      <View style={{ flex: 1 }}>
        <FlatList
          data={listMedia}
          bounces={false}
          renderItem={renderMediaItem}
          keyExtractor={(_, index) => `${index}`}
          numColumns={4}
          ItemSeparatorComponent={() => <View style={{ height: 1 * RATIO }} />}
        />
      </View>
      <Modal
        isVisible={modalTopicVisible}
        style={{ margin: 0 }}
        useNativeDriver
        onBackdropPress={() => setModalTopicVisible(false)}
      >
        <SelectTopicView
          data={listTopic}
          currentValue={currentTopic.value}
          onPress={item => {
            setCurrentTopic(item)
            setModalTopicVisible(false)
          }}
        />
      </Modal>
      <MediaPickerModal
        multiply
        isVisible={isVisible}
        useVisible={setIsVisible}
        onPicker={handleOnPicker}
        maxFiles={10}
      />
      {(mediaPickerLoading || isLoading) && <LoadingProgress />}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  input: {
    height: 100,
    ...fonts.regular16,
    color: 'black',
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: colors.black,
    marginHorizontal: 15,
  },
  footer: {
    ...styleView.rowItemBetween,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(0,0,0,.1)',
    borderBottomColor: 'rgba(0,0,0,.1)',
  },
  btnPost: {
    ...styleView.centerItem,
    width: 99,
    height: 32,
    backgroundColor: '#F03E3E',
    borderRadius: 50,
  },
})

export default EditPostScreen
