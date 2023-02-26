import R from '@app/assets/R'
import LoadingProgress from '@app/components/LoadingProgress'
import { LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  requestDeleteProduct,
  requestPostProductSell,
  requestUpdateProductLive,
} from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, HEIGHT, WIDTH } from '@app/theme'
import { showConfirm } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { countProduct } from '@app/utils/FuncHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { memo, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-easy-toast'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import reactotron from 'ReactotronConfig'
import {
  removeProduct,
  setListproductDeleteAndAddEmpty,
  updateChecked,
} from '../../Product/slice/ListProductSlice'
import Line from '../../Shop/components/Line'
import {
  useShowButtonAddProduct,
  useShowModalButton,
  useToggleShowModalButton,
  useToggleUpdateProductSell,
  useTypeItemModal,
  useUpdateProductSell,
} from '../context/YoutubeLIveContext'
import { propsBottomModal } from '../props'
import { styles } from '../styles'
import ItemListProduct from './ItemListProduct'
import ItemListProductCart from './ItemListProductCart'

const { notification, ok, confirm_delete_product, delete_product_success } =
  R.strings()

const { HIGHLIGHT_PRODUCT, DELETE_PRODUCT } = LIVESTREAM_EVENT

const BottomModal = ({
  loadingModal = false,
  onChangeCode,
  onPressAddCart,
  isPreview,
  isShop,
  refToast,
  livestream_id,
}: propsBottomModal) => {
  const appDispatch = useAppDispatch()
  const [loading, setLoading] = useState(loadingModal)
  const dataProduct = useAppSelector(state => state.ListProductReducer)
  const showModal = useShowModalButton()
  const typeItem = useTypeItemModal()
  const showButtonAddProduct = useShowButtonAddProduct()
  const itemProduct = useUpdateProductSell()
  const onPressShowModal = useToggleShowModalButton()
  const onPressUpdateProduct = useToggleUpdateProductSell()

  __DEV__ && console.log('BottomModal')

  const handlePostProductSell = (item: any) => {
    const payload = {
      livestream_id,
      product_id: item.id,
    }
    callAPIHook({
      API: requestPostProductSell,
      payload: payload,
      useLoading: setLoading,
      onSuccess: res => {
        onPressUpdateProduct(res.data)
        setTimeout(() => {
          onPressShowModal(prev => !prev)
        }, 150)
      },
      onError: err => {},
    })
  }

  const actionDeleteProduct = (item: any) => {
    const payload = {
      livestream_id,
      body: {
        products_id: [item.id],
      },
    }
    callAPIHook({
      API: requestDeleteProduct,
      payload: payload,
      useLoading: setLoading,
      onSuccess: res => {
        refToast.current?.show(delete_product_success)
        if (item.id === itemProduct.id) {
          onPressUpdateProduct(null)
        }
      },
      onError: err => {},
    })
  }

  const handleActionAddProduct = () => {
    onPressShowModal(prev => !prev)
    setTimeout(() => {
      appDispatch(setListproductDeleteAndAddEmpty({}))
      NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE, {
        livestream_id,
      })
    }, 200)
  }

  const actionUpdateCodeProduct = (item: any) => {
    Keyboard.dismiss()
    const payload = {
      livestream_id,
      body: {
        products: [
          {
            id: item.id,
            code_product_livestream: item.code_product_livestream,
          },
        ],
      },
    }
    callAPIHook({
      API: requestUpdateProductLive,
      payload: payload,
      useLoading: setLoading,
      onSuccess: res => {
        refToast.current?.show('Lưu mã sản phẩm thành công!')
      },
      onError: err => {},
    })
  }
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (typeItem === TYPE_ITEM.LIST_PRODUCT)
      return (
        <ItemListProduct
          item={item}
          index={index}
          onPressImgProduct={() => {
            //   NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
            //     id: item.id,
            //   })
          }}
          onPressUpdateCodeItem={() => {
            actionUpdateCodeProduct(item)
          }}
          onChangeTextCode={code => {
            if (onChangeCode) return onChangeCode(code, item)
          }}
          onPressDeleteProduct={() => {
            showConfirm(
              notification,
              confirm_delete_product,
              () => {
                actionDeleteProduct(item)
                appDispatch(updateChecked({ id: item.id }))
              },
              '',
              ok
            )
          }}
        />
      )
    return (
      <ItemListProductCart
        isShop={isShop}
        item={item}
        index={index}
        isPreview={isPreview}
        itemProduct={itemProduct}
        type={typeItem}
        onPressImgProduct={() => {
          console.log(item.id)
        }}
        onPressShowProduct={() => {
          handlePostProductSell(item)
        }}
        onPressAddCart={() => {
          if (onPressAddCart) return onPressAddCart(item)
        }}
      />
    )
  }
  const ButtonAddProduct = () => {
    return (
      <>
        {showButtonAddProduct ? (
          <TouchableOpacity
            style={styles.vBtnAddProduct}
            onPress={handleActionAddProduct}
            children={
              <FastImage
                source={R.images.img_add_product_list}
                style={{ width: WIDTH - 20, height: 50 }}
                resizeMode={'contain'}
              />
            }
          />
        ) : null}
      </>
    )
  }
  const handleTypeActionSocket = (res: any) => {
    switch (res?.type_action) {
      case HIGHLIGHT_PRODUCT:
        onPressUpdateProduct(res?.data)
        break
      case DELETE_PRODUCT:
        appDispatch(
          removeProduct({
            item: { id: res?.data?.products_livestream_id[0], modal: true },
          })
        )
        onPressUpdateProduct((prev: any) =>
          prev?.id === res?.data?.products_livestream_id[0] ? {} : prev
        )
        break
      default:
        break
    }
  }

  useEffect(() => {
    SocketHelperLivestream?.socket?.on(
      `livestream_${livestream_id}`,
      handleTypeActionSocket
    )
    return () => {
      SocketHelperLivestream?.socket?.off(
        `livestream_${livestream_id}`,
        handleTypeActionSocket
      )
    }
  }, [])
  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={() => onPressShowModal(prev => !prev)}
      useNativeDriver
      style={styles.vModal}
      hideModalContentWhileAnimating
    >
      <KeyboardAvoidingView behavior={'padding'}>
        <View style={styles.vContentModal}>
          <Text
            style={styles.txtTitleModal}
            children={`Danh sách sản phẩm (${countProduct(
              dataProduct?.listProductSelect.length
            )})`}
          />
          <Line size={2} />
          <FlatList
            keyboardShouldPersistTaps={'always'}
            ListHeaderComponent={<ButtonAddProduct />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '5%' }}
            data={dataProduct?.listProductSelect}
            renderItem={renderItem}
          />
        </View>
      </KeyboardAvoidingView>
      {(loadingModal || loading) && <LoadingProgress />}
      <Toast
        ref={refToast}
        position="bottom"
        positionValue={HEIGHT * 0.15}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
        textStyle={{ color: colors.white }}
      />
    </Modal>
  )
}

export default memo(BottomModal, isEqual)
