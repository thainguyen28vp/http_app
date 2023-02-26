import R from '@app/assets/R'
import { LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestLeaveLive } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts } from '@app/theme'
import { showConfirm, showMessages } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import ProductSelectTypeView from '@screen/App/Product/component/ProductSelectTypeVIew'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import reactotron from 'ReactotronConfig'
import { useImmer } from 'use-immer'
import { DataUserInfoProps } from '../../Account/Model'
import { requestGetProductCustomAttribute } from '../../Product/slice/ProductCustomAttributeSlice'
import { propsHeaderLive } from '../props'
import { updateShowModalBottom } from '../slice/LiveSlice'
import { getListLiveStreamThunk } from '../slice/LiveStreamSlice'
import { styles } from '../styles'
import { STATUS_LIST_LIVE } from '../YoutubeWatchingScreen'
const { HIGHLIGHT_PRODUCT, DELETE_PRODUCT, COUNT_SUBSCRIBER } = LIVESTREAM_EVENT
const { notification, confirm_close_live_cus, ok, err_live } = R.strings()

const HeaderLiveWatching = ({
  livestream_id,
  isShop,
  isPreview,
  userNameLive,
  imgShop,
  count_subcriber,
  highlightProduct,
  channelId,
  onPressReload,
}: propsHeaderLive) => {
  const [countSubcriber, setCountSubcriber] = useImmer(count_subcriber || 0)
  reactotron.logImportant!('highlightProduct', highlightProduct)
  const [showProductSell, setShowProductSell] = useImmer(highlightProduct)
  const appDispatch = useAppDispatch()
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const [productTarget, setProductTarget] =
    useState<{ productId: number; stockId: number }>()
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const { listProductSelect } = useAppSelector(
    state => state.ListProductReducer
  )

  reactotron.logImportant!('productTarget', productTarget)

  const onLeaveChannel = async () => {
    callAPIHook({
      API: requestLeaveLive,
      payload: livestream_id,
      onSuccess: async res => {
        appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
        NavigationUtil.goBack()
      },
      onError: err => {
        showMessages(R.strings().notification, err_live, async () => {
          appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
          NavigationUtil.goBack()
        })
      },
    })
  }

  const handleOnPressCloseLive = () => {
    showConfirm(
      notification,
      confirm_close_live_cus,
      () => {
        // SocketHelper?.socket?.emit(channelId, livestream_id)
        SocketHelperLivestream.socket.disconnect()
        appDispatch(getListLiveStreamThunk(STATUS_LIST_LIVE))
        setTimeout(() => {
          NavigationUtil.goBack()
        }, 150)
        // onLeaveChannel()
      },
      '',
      ok
    )
  }

  const handleSocket = (res: any) => {
    if (res.type_action == HIGHLIGHT_PRODUCT) {
      setShowProductSell(res.data)
    }
    if (res.type_action == DELETE_PRODUCT) {
      setShowProductSell((prev: any) => {
        if (prev?.id === res?.data?.products_livestream_id[0]) return null
        return prev
      })
    }
  }
  const handleSocketRelease = (res: any) => {
    if (res.type_action == COUNT_SUBSCRIBER) {
      setCountSubcriber(res.data.count_subscribe)
    }
  }

  useEffect(() => {
    SocketHelperLivestream?.socket?.on(channelId, handleSocket)
    SocketHelperLivestream?.socket?.on(channelId, handleSocketRelease)
    return () => {
      SocketHelperLivestream?.socket?.off(channelId, handleSocket)
      SocketHelperLivestream?.socket?.off(channelId, handleSocketRelease)
    }
  }, [])
  // useEffect(() => {
  //   if (!!showProductSell?.stockId) {
  //     appDispatch(
  //       requestGetProductCustomAttribute({
  //         id: showProductSell?.id,
  //         stock_id: showProductSell?.stock_id,
  //       })
  //     )
  //     setProductTarget({
  //       productId: showProductSell?.id,
  //       stockId: showProductSell?.stock_id,
  //     })
  //   }
  // }, [productTarget?.stockId])
  const ModalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        useNativeDriver
        style={styles.vModalSelectType}
        hideModalContentWhileAnimating
      >
        <ProductSelectTypeView
          productDetail={showProductSell}
          onClosePress={() => {
            setModalTypeVisible(false)
          }}
          product_id={showProductSell?.id!}
          isBuyNow={false}
        />
      </Modal>
    )
  }
  return (
    <View style={styles.vHeaderLive}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
            source={imgShop ? { uri: imgShop } : R.images.img_user}
            style={styles.imgShop}
          />
          <View style={{ paddingLeft: 10, width: '60%' }}>
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
              if (isShop) {
                appDispatch(
                  updateShowModalBottom({
                    showModal: true,
                    typeItem: TYPE_ITEM.LIST_PRODUCT_SELL,
                  })
                )
                return
              }
              if (showProductSell) {
                setProductTarget({
                  productId: showProductSell.id,
                  stockId: showProductSell.stock_id,
                })
                setModalTypeVisible(true)
                return
              }
            }}
            style={{ top: 20 }}
          >
            <FastImage
              source={
                showProductSell?.images?.length ||
                showProductSell?.product_media_url
                  ? {
                      uri: showProductSell?.images?.length
                        ? showProductSell?.images[0]?.src
                        : showProductSell?.product_media_url,
                    }
                  : R.images.img_show_product_live
              }
              style={styles.imgProductSell}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          style={{
            right: 10,
            backgroundColor: 'rgba(1,1,1,0.3)',
            borderRadius: 100 / 2,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPressReload}
        >
          <FastImage
            source={R.images.img_reload}
            style={{ width: 30, height: 30 }}
            tintColor={'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 5,
            paddingTop: 5,
            top: -5,
          }}
          onPress={handleOnPressCloseLive}
        >
          <FastImage
            source={R.images.img_close_lv}
            style={styles.imgCloseLive}
          />
        </TouchableOpacity>
      </View>
      <ModalSelectType />
    </View>
  )
}

export default HeaderLiveWatching
