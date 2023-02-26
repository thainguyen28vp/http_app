import R from '@app/assets/R'
import { DebounceButton } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import { colors, fonts, OS, WIDTH } from '@app/theme'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { memo, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import reactotron from 'reactotron-react-native'
import {
  useToggleShowButtonAddProduct,
  useToggleShowModalButton,
  useToggleTypeItemModal,
  useUpdateProductSell,
} from '../context/YoutubeLIveContext'
import { styles } from '../styles'
import Modal from 'react-native-modal'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestSendeNoti } from '@app/service/Network/livestream/LiveStreamApi'
import { showMessages } from '@app/utils/AlertHelper'

const { COUNT_SUBSCRIBER } = LIVESTREAM_EVENT

interface propsHeaderLive {
  livestream_id?: number | undefined
  isPreview?: boolean
  userNameLive: string
  imgShop: Source | null
  imageProductSell?: string
  onPressCloseLive: () => void
  onPressProductSell?: () => void
}

const HeaderLive = memo(
  ({
    livestream_id,
    isPreview,
    userNameLive,
    imgShop,
    imageProductSell,
    onPressCloseLive,
    onPressProductSell,
  }: propsHeaderLive) => {
    const [countSubcriber, setCountSubcriber] = useState(0)
    const [modalNoti, setModalNoti] = useState(false)
    const [contentNoti, setContentNoti] = useState('')

    const itemProduct = useUpdateProductSell()
    const onPressShowModal = useToggleShowModalButton()
    const onPressTypeItemModal = useToggleTypeItemModal()
    const onPressShowButtonAddproduct = useToggleShowButtonAddProduct()
    const handleTypeActionSocket = (res: any) => {
      switch (res?.type_action) {
        case COUNT_SUBSCRIBER:
          setTimeout(() => {
            setCountSubcriber(res?.data?.count_subscribe)
          }, 100)
          return
        default:
          break
      }
    }
    const handleShowModal = () => {
      setContentNoti('')
      setModalNoti(prev => !prev)
    }
    const handleSendNoti = () => {
      if (!contentNoti) {
        showMessages(
          R.strings().notification,
          'Vui lòng nhập nội dung thông báo!'
        )
        return
      }
      const payload = {
        livestream_id,
        body: {
          content: contentNoti,
        },
      }
      callAPIHook({
        API: requestSendeNoti,
        payload,
        onSuccess: res => {
          handleShowModal()
          setTimeout(() => {
            showMessages(R.strings().notification, 'Gửi thông báo thành công!')
          }, 100)
        },
        onError: () => {},
      })
    }

    useEffect(() => {
      SocketHelperLivestream?.socket?.on(
        `livestream_${livestream_id}`,
        handleTypeActionSocket
      )
      return () => {
        SocketHelperLivestream.socket?.off(
          `livestream_${livestream_id}`,
          handleTypeActionSocket
        )
      }
    }, [])
    return (
      <View style={[styles.vHeaderLive, { top: '5%' }]}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              source={imgShop ? { uri: imgShop } : R.images.img_user}
              style={styles.imgShop}
            />
            <View style={{ paddingLeft: 10 }}>
              <Text
                style={{
                  ...fonts.semi_bold16,
                  color: colors.white,
                }}
                children={userNameLive}
              />
              {!isPreview && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    source={R.images.img_eye}
                    style={{ width: 24, height: 24 }}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      color: colors.red,
                      marginLeft: 6,
                      ...fonts.medium14,
                    }}
                    children={countSubcriber}
                  />
                </View>
              )}
            </View>
          </View>
          {!isPreview && (
            <TouchableOpacity
              onPress={() => {
                onPressShowModal(prev => !prev)
                onPressTypeItemModal(TYPE_ITEM.LIST_PRODUCT_SELL)
                onPressShowButtonAddproduct(prev => (prev = false))
              }}
              style={{ top: 20, width: WIDTH * 0.28 }}
            >
              <FastImage
                source={
                  itemProduct?.images?.length
                    ? { uri: itemProduct?.images[0]?.src }
                    : R.images.img_show_product_live
                }
                style={styles.imgProductSell}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flexDirection: 'row', top: -10 }}>
          {/* {!isPreview && (
            <DebounceButton
              style={{
                paddingHorizontal: 10,
                paddingTop: 15,
                height: 60,
                marginRight: 10,
              }}
              onPress={handleShowModal}
              children={
                <FstImage
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={R.images.img_megaphone1}
                />
              }
            />
          )} */}
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingTop: 15,
              height: 60,
            }}
            onPress={onPressCloseLive}
          >
            <FastImage
              source={R.images.img_close_lv}
              style={styles.imgCloseLive}
            />
          </TouchableOpacity>
        </View>
        <Modal isVisible={modalNoti} onBackdropPress={handleShowModal}>
          <KeyboardAvoidingView
            style={{ paddingBottom: OS == 'ios' ? '50%' : 0 }}
            behavior={OS == 'ios' ? 'height' : 'padding'}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 15,
              }}
            >
              <Text
                style={{ alignSelf: 'center', ...fonts.medium18 }}
                children={'Nội dung thông báo'}
              />
              <TextInput
                textAlignVertical="top"
                multiline={true}
                value={contentNoti}
                placeholder={'Nhập nội dung thông báo'}
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: '#DDD',
                  marginHorizontal: 10,
                  marginTop: 15,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  ...fonts.regular14,
                  borderRadius: 5,
                }}
                onChangeText={value => {
                  if (value.length <= 200) {
                    setContentNoti(value)
                    return
                  }
                }}
              />
              <Text
                style={{
                  ...fonts.medium12,
                  marginTop: 5,
                  marginLeft: 10,
                  color: colors.line,
                }}
                children={`Ký tự cho phép: ${contentNoti.length}/200`}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 30,
                }}
              >
                <DebounceButton
                  style={{ backgroundColor: colors.reset, borderRadius: 10 }}
                  onPress={handleShowModal}
                  children={
                    <Text
                      style={{
                        ...fonts.medium14,
                        color: colors.white,
                        paddingVertical: 10,
                        paddingHorizontal: 40,
                      }}
                      children={'Huỷ'}
                    />
                  }
                />
                <DebounceButton
                  style={{ backgroundColor: colors.primary, borderRadius: 10 }}
                  onPress={handleSendNoti}
                  children={
                    <Text
                      style={{
                        ...fonts.medium14,
                        color: colors.white,
                        paddingVertical: 10,
                        paddingHorizontal: 40,
                      }}
                      children={'Gửi'}
                    />
                  }
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    )
  },
  isEqual
)

export default HeaderLive
