import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import LoadingProgress from '@app/components/LoadingProgress'
import MediaPickerModal from '@app/components/MediaPickerModal'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  getListTopic,
  requestCreatePost,
} from '@app/service/Network/home/HomeApi'
import { requestUploadImage } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppSelector } from '@app/store'
import { colors, dimensions, fonts, OS, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { fancyTimeFormat, handleResizeImage } from '@app/utils/FuncHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { createThumbnail } from 'react-native-create-thumbnail'
import FastImage from 'react-native-fast-image'
import Picker from 'react-native-image-crop-picker'
import Modal from 'react-native-modal'
import reactotron from 'reactotron-react-native'
import SelectTopicView, { TopicItem } from './component/SelectTopicView'

const { width } = dimensions
const RATIO = width / 375

const MEDIA_TYPE = {
  VIDEO: 'video',
  IMAGE: 'image',
}

const MAX_FILE_UPLOAD_IMAGE = 10
const MAX_FILE_UPLOAD_VIDEO = 11

const CreatePostScreen = (props: any) => {
  const reloadList = props.route.params?.reloadList
  const [content, setContent] = useState<string>('')
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [listImage, setListImage] = useState<any>([])
  const [mediaUpload, setMediaUpload] = useState<Array<any>>([])
  const [listTopic, setListTopic] = useState<Array<TopicItem>>([])
  const [currentTopic, setCurrentTopic] = useState<TopicItem>({
    label: '',
    value: 2,
  })
  const [modalTopicVisible, setModalTopicVisible] = useState<boolean>(false)
  const [mediaPickerLoading, setMediaPickerLoading] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [videoUpload, setVideoUpload] = useState<boolean>(false)

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

    showConfirm('', 'Bạn có chắc chắn muốn đăng bài', () => {
      const payload = new FormData()
      payload.append('topic_id', `${currentTopic.value}`)
      payload.append('content', content.trim())
      listImage.map((item: any) => {
        if (item.typeMedia == MEDIA_TYPE.VIDEO) {
          payload.append('post_video', {
            name: item.name,
            type: item.type,
            uri: item?.uri,
          })
          payload.append('duration', item.playableDuration)
          payload.append('video_thumbnail', item.urlThumbnail)
        } else
          payload.append('post_media', {
            name: `images${new Date().getTime()}.png`,
            type: 'image/png',
            filename: 'image.png',
            uri: item?.uri,
          })
      })

      callAPIHook({
        API: requestCreatePost,
        payload,
        useLoading: setDialogLoading,
        onSuccess: res => {
          showMessages('', 'Thêm bài đăng thành công!', () => {
            reloadList()
            NavigationUtil.goBack()
          })
        },
        onError(err) {
          showMessages(R.strings().notification, 'Đã có lỗi xảy ra!')
        },
      })
    })
  }

  reactotron.logImportant!({ listImage })

  const handleDeleteImage = (item: any, index: number) => {
    let arr: Array<any> = listImage
    arr.map((el: any, idx: any) => {
      if (index == idx) {
        arr.splice(idx, 1)
      }
    })
    setListImage([...arr])
  }

  const onCameraPress = () => {
    Picker.openCamera({
      width: 400,
      height: 400,
      cropping: false,
      mediaType: 'photo',
    }).then(async res => {
      try {
        const cloneListImg = [
          {
            type: 'image',
            uri: res.path,
            playableDuration: null,
          },
          ...listImage,
        ]
        setListImage(cloneListImg)
      } catch (error) {}
    })
  }

  const handleOnPicker = async (res: any) => {
    if (listImage?.length > MAX_FILE_UPLOAD_IMAGE) {
      showMessages(
        'Thông báo',
        `Số lượng ảnh tối đa là ${MAX_FILE_UPLOAD_IMAGE}.`
      )
      return
    }
    const cloneListImage = [...listImage]
    const listRes = res.data.map((item: any, index: any) => ({
      type: item.filename,
      uri: item.path,
      playableDuration: item?.duration,
      typeMedia: MEDIA_TYPE.IMAGE,
    }))
    let concatData = [...cloneListImage, ...listRes]
    if (!!listImage.length) {
      if (concatData?.length > MAX_FILE_UPLOAD_IMAGE) {
        showMessages(
          'Thông báo',
          `Số lượng ảnh tối đa là ${MAX_FILE_UPLOAD_IMAGE}.`,
          () => {
            setListImage(concatData.slice(0, MAX_FILE_UPLOAD_IMAGE))
          }
        )
        return
      }
      setListImage(concatData)
    } else {
      if (concatData?.length > MAX_FILE_UPLOAD_IMAGE) {
        showMessages(
          'Thông báo',
          `Số lượng ảnh tối đa là ${MAX_FILE_UPLOAD_IMAGE}.`,
          () => {
            setListImage(concatData.slice(0, MAX_FILE_UPLOAD_IMAGE))
          }
        )
        return
      }
      setListImage(listRes)
    }
  }

  const onGalleryPress = () => {
    Picker.openPicker({
      multiple: true,
      cropping: false,
      mediaType: 'video',
      maxFiles: 1,
      compressVideoPreset: 'MediumQuality',
    })
      .then(async media => {
        reactotron.logImportant!({ media })
        setMediaPickerLoading(true)
        if (media[0].size / (1024 * 1024) > 199) {
          showMessages(
            'Thông báo',
            'Dung lượng video tối đa cho phép là 200MB.'
          )
          return
        }
        if (
          listImage?.some((item: any) => item.typeMedia == MEDIA_TYPE.VIDEO)
        ) {
          showMessages(
            'Thông báo',
            'Video tối đa có thể chọn là 1 video! Để chọn video khác, vui lòng xoá video đã chọn trước đó.'
          )
          return
        }

        const cloneListImage = [...listImage]
        createThumbnail({
          url: media[0].path,
          timeStamp: parseInt('1000', 10),
        })
          .then(thumbnail => {
            reactotron.logImportant!({ thumbnail })
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
                reactotron.logImportant!({ res })
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
                if (!!listImage.length) {
                  if (listRes?.length > 1) {
                    showMessages(
                      'Thông báo',
                      `Số lượng video tối đa là ${1}!`,
                      () => {
                        setListImage([
                          ...listRes.slice(0, 1),
                          ...cloneListImage,
                        ])
                      }
                    )
                    return
                  }
                  setListImage(concatData)
                } else {
                  if (listRes?.length > 1) {
                    showMessages(
                      'Thông báo',
                      `Số lượng video tối đa là ${1}!`,
                      () => {
                        setListImage(concatData.slice(0, 1))
                      }
                    )
                    return
                  }
                  setListImage(listRes)
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
            if (!!listImage.length)
              setListImage([...cloneListImage, ...listRes])
            else setListImage(listRes)
          })
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
      if (mediaUpload.length >= MAX_FILE_UPLOAD_VIDEO) {
        showMessages('', 'Đạt giới hạn ảnh và video')
        return
      } else {
        arr.push(item)
      }
    }
    setMediaUpload(arr)
  }

  const getTopic = () => {
    callAPIHook({
      API: getListTopic,
      onSuccess: res => {
        setListTopic(
          res.data.map((item: any) => ({
            label: item.name.trim(),
            value: item.id,
          }))
        )
        setCurrentTopic({
          label: res.data[0].name.trim(),
          value: res.data[0].id,
        })
      },
    })
  }

  useEffect(() => {
    getTopic()
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
        <FstImage
          style={{ width: '100%', height: '100%' }}
          source={{
            uri:
              item?.typeMedia == MEDIA_TYPE.VIDEO
                ? item.urlThumbnail
                : item.uri,
          }}
          resizeMode="cover"
        >
          <DebounceButton
            style={{
              backgroundColor: 'rgba(1,1,1,0.5)',
              position: 'absolute',
              right: 5,
              top: 5,
              height: 25,
              width: 25,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25 / 2,
            }}
            onPress={() => handleDeleteImage(item, index)}
            children={
              <FastImage
                tintColor={'white'}
                source={R.images.ic_close}
                style={{ width: 20, height: 20 }}
              />
            }
          />
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
                  color: colors.white,
                  ...fonts.bold10,
                  textDecorationLine: 'underline',
                }}
                children={`${index + 1}`}
              />
            }
          />
        </FstImage>

        {item?.typeMedia == MEDIA_TYPE.VIDEO && (
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
              children={fancyTimeFormat(item.playableDuration / 1000 + 1)}
            />
          </View>
        )}
        {/* <View
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
        /> */}
      </View>
    )

    return (
      <View
        // onPress={() => {
        //   return
        //   onMediaPress(item, index)
        // }}
        children={mediaItem}
      />
    )
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
              onPress={() => {
                // onGalleryPress()
                setIsVisible(!isVisible)
              }}
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
                  children={'Đăng bài'}
                />
              </View>
            }
          />
        </View>
      </React.Fragment>
    )
  }

  const renderMediaArea = () => {
    return (
      <View style={{ flex: 1 }}>
        {mediaPickerLoading && <LoadingProgress />}
        {/* <Text
          style={{ marginVertical: 5, marginLeft: 10 }}
          children={`Số lượng:${listImage?.length}/${MAX_FILE_UPLOAD}`}
        /> */}
        <FlatList
          style={{ zIndex: -1 }}
          data={listImage || []}
          bounces={false}
          renderItem={renderMediaItem}
          keyExtractor={(_, index) => `${index}`}
          numColumns={4}
          ItemSeparatorComponent={() => <View style={{ height: 1 * RATIO }} />}
        />
      </View>
    )
  }

  return (
    <ScreenWrapper
      onBack={() => {
        if (!dialogLoading) {
          NavigationUtil.goBack()
        }
      }}
      back
      unsafe
      dialogLoading={dialogLoading}
      titleHeader={'Tạo bài viết'}
    >
      {renderBody()}
      {renderMediaArea()}
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

export default CreatePostScreen
