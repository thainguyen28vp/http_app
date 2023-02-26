import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
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
import { colors, fonts, HEIGHT, OS } from '@app/theme'
import { showConfirm } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { countProduct, formatPrice, handlePrice } from '@app/utils/FuncHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import ProductSelectTypeView from '@screen/App/Product/component/ProductSelectTypeVIew'
import React, { memo, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-easy-toast'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import reactotron from 'ReactotronConfig'
import { DataUserInfoProps } from '../../Account/Model'
import CartButton from '../../Home/component/CartButton'
import {
  setListproductDeleteAndAddEmpty,
  updateCodeProduct,
} from '../../Product/slice/ListProductSlice'
import { requestGetProductCustomAttribute } from '../../Product/slice/ProductCustomAttributeSlice'
import Line from '../../Shop/components/Line'
import {
  propsBottomModal,
  propsItemListProduct,
  propsItemListProductCart,
} from '../props'
import { updateCountProduct, updateShowModalBottom } from '../slice/LiveSlice'
import { styles } from '../styles'

const { HIGHLIGHT_PRODUCT } = LIVESTREAM_EVENT
const { notification, confirm_close_live, ok, confirm_delete_product } =
  R.strings()

const BottomModalWatching = memo(
  ({
    loadingModal = false,
    showButtonAddProduct,
    onPressPostProduct,
    isPreview,
    isShop,
    socket,
    channelId,
    livestream_id,
    shopId,
  }: propsBottomModal) => {
    const { listProductSelect } = useAppSelector(
      state => state.ListProductReducer
    )
    const appDispatch = useAppDispatch()
    const LiveReducer = useAppSelector(state => state.LiveReducer)
    const [showModal, setShowModal] = useState(LiveReducer.showModalBottom)
    const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
    const [productTarget, setProductTarget] =
      useState<{ productId: number; stockId: number }>()
    const [loadingBottomModal, setLoadingBottomModal] = useState(false)
    const refToast = useRef(null)
    const [showSave, setShowSave] = useState(false)
    const [typeItemProduct, setTypeItemProduct] = useState<number | undefined>()
    const userInfo = useAppSelector<DataUserInfoProps>(
      state => state.accountReducer.data
    )
    const [itemProduct, setItemProduct] = useState<any>()

    reactotron.logImportant!('product_target', itemProduct)

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
        useLoading: setLoadingBottomModal,
        onSuccess: res => {
          refToast.current?.show('Xoá sản phẩm thành công!')
          setItemProduct(null)
        },
        onError: err => {},
      })
    }
    const actionUpdateCodeProduct = (item?: any) => {
      Keyboard.dismiss()
      let products: any[] = []
      listProductSelect.map((item: any) => {
        products.push({
          id: +item.id,
          code_product_livestream: item.code_product_livestream,
        })
      })
      const payload = {
        livestream_id,
        body: {
          products,
          // products: [
          //   {
          //     id: item.id,
          //     code_product_livestream: item.code_product_livestream,
          //   },
          // ],
        },
      }
      callAPIHook({
        API: requestUpdateProductLive,
        payload: payload,
        useLoading: setLoadingBottomModal,
        onSuccess: res => {
          setShowSave(false)
          refToast.current?.show('Lưu mã sản phẩm thành công!')
        },
        onError: err => {},
      })
    }

    const handlePostProductSell = (item: any) => {
      const payload = {
        livestream_id,
        product_id: item.id,
      }
      callAPIHook({
        API: requestPostProductSell,
        payload: payload,
        useLoading: setLoadingBottomModal,
        onSuccess: res => {
          appDispatch(updateShowModalBottom({ showModal: false }))
          setItemProduct(item)
          // refProductSell.current = res.data
        },
        onError: err => {},
      })
    }

    const handleSocket = (res: any) => {
      if (res.type_action == HIGHLIGHT_PRODUCT) {
        setItemProduct(res.data)
        return
      }
    }

    useEffect(() => {
      SocketHelperLivestream?.socket?.on(channelId, handleSocket)
      return () => {
        SocketHelperLivestream?.socket?.off(channelId, handleSocket)
      }
    }, [])
    useEffect(() => {
      appDispatch(updateCountProduct({ count: listProductSelect?.length }))
    }, [listProductSelect?.length])
    useEffect(() => {
      setShowModal(LiveReducer.showModalBottom)
    }, [LiveReducer.showModalBottom])
    // useEffect(() => {
    //   if (!!listProductSelect?.length) {
    //     appDispatch(
    //       requestGetProductCustomAttribute({
    //         id: listProductSelect[0]?.id,
    //         stock_id: listProductSelect[0]?.stock_id,
    //       })
    //     )
    //     setProductTarget({
    //       productId: listProductSelect[0]?.id,
    //       stockId: listProductSelect[0]?.stock_id,
    //     })
    //   }
    // }, [listProductSelect?.length])
    useEffect(() => {
      setTypeItemProduct(LiveReducer?.typeItem)
    }, [LiveReducer?.typeItem])
    const renderItem = ({ item, index }: { item: any; index: number }) => {
      // if (typeItemProduct === TYPE_ITEM.LIST_PRODUCT)
      //   return (
      //     <ItemListProduct
      //       onFocusInputCode={() => {
      //         setShowSave(true)
      //       }}
      //       item={item}
      //       index={index}
      //       onPressImgProduct={() => {}}
      //       onPressUpdateCodeItem={() => actionUpdateCodeProduct(item)}
      //       onChangeTextCode={code => {
      //         appDispatch(
      //           updateCodeProduct({
      //             id: item.id,
      //             code_product_livestream: code,
      //           })
      //         )
      //       }}
      //       onPressDeleteProduct={() => {
      //         showConfirm(
      //           notification,
      //           confirm_delete_product,
      //           () => {
      //             actionDeleteProduct(item)
      //           },
      //           '',
      //           ok
      //         )
      //       }}
      //     />
      //   )
      return (
        <ItemListProductCart
          isShop={isShop}
          item={item}
          index={index}
          isPreview={isPreview}
          itemProduct={itemProduct}
          type={typeItemProduct}
          onPressImgProduct={() => {
            console.log(item.id)
          }}
          onPressShowProduct={() => {
            handlePostProductSell(item)
          }}
          onPressAddCart={() => {
            setProductTarget({ productId: item.id, stockId: item.stock_id })
            setModalTypeVisible(true)
            setItemProduct(item)
          }}
        />
      )
    }
    const ButtonAddProduct = () => {
      return (
        <>
          {!!(userInfo?.Shop?.id === shopId) &&
          typeItemProduct == TYPE_ITEM.LIST_PRODUCT ? (
            <Button
              style={styles.vBtnAddProduct}
              onPress={() => {
                appDispatch(setListproductDeleteAndAddEmpty({}))
                appDispatch(updateShowModalBottom({ showModal: false }))
                setTimeout(() => {
                  NavigationUtil.navigate(
                    SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE,
                    {
                      livestream_id,
                    }
                  )
                }, 1000)
              }}
              children={
                <FastImage
                  source={R.images.img_add_product_list}
                  style={styles.imgAddProductBottomModal}
                  resizeMode={'contain'}
                />
              }
            />
          ) : null}
        </>
      )
    }

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
            productDetail={itemProduct}
            onClosePress={() => {
              setModalTypeVisible(false)
            }}
            product_id={productTarget?.productId!}
            stock_id={productTarget?.stockId!}
            isBuyNow={false}
          />
        </Modal>
      )
    }
    return (
      <Modal
        isVisible={showModal}
        onBackdropPress={() => {
          appDispatch(updateShowModalBottom({ showModal: false }))
        }}
        useNativeDriver
        style={styles.vModal}
        hideModalContentWhileAnimating
      >
        <KeyboardAvoidingView behavior={OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.vContentModal}>
            <View style={styles.vHeaderBottomModal}>
              <Text
                style={[styles.txtTitleModal, { flex: 1 }]}
                children={`Danh sách sản phẩm (${countProduct(
                  listProductSelect?.length || 0
                )})`}
              />
              {showSave ? (
                <Button
                  onPress={() => {
                    actionUpdateCodeProduct()
                  }}
                  style={[styles.btnTrash]}
                  children={<Text style={styles.btnSave} children={'Lưu'} />}
                />
              ) : (
                <DebounceButton
                  style={{ marginRight: '5%' }}
                  onPress={() => {
                    appDispatch(updateShowModalBottom({ showModal: false }))
                    setTimeout(() => {
                      NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
                    }, 150)
                  }}
                  children={<CartButton />}
                />
              )}
            </View>
            <Line size={2} />
            <FlatList
              keyboardShouldPersistTaps={'always'}
              // ListHeaderComponent={<ButtonAddProduct />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: '5%' }}
              data={listProductSelect}
              renderItem={renderItem}
            />
          </View>
        </KeyboardAvoidingView>
        {loadingModal && <LoadingProgress />}
        <Toast
          ref={refToast}
          position="bottom"
          positionValue={HEIGHT * 0.15}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: colors.white }}
        />
        <ModalSelectType />
        {loadingBottomModal && <LoadingProgress />}
      </Modal>
    )
  },
  isEqual
)

export default BottomModalWatching

const ItemListProduct = ({
  item,
  index,
  onPressImgProduct,
  onChangeTextCode,
  onPressDeleteProduct,
  onPressUpdateCodeItem,
  onFocusInputCode,
}: propsItemListProduct) => {
  return (
    <View
      style={styles.vItemListProduct}
      children={
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={onPressImgProduct}
            children={
              <FstImage
                source={
                  item?.product_media_url || item?.product?.product_media_url
                    ? {
                        uri:
                          item?.product_media_url ||
                          item?.product?.product_media_url,
                      }
                    : R.images.image_logo
                }
                style={styles.imgProduct}
              />
            }
          />
          <View style={styles.vValueItem}>
            <Text
              style={styles.txtNameProductItem}
              children={item?.product?.name || 'Chưa cập nhật'}
            />
            <Text style={styles.txtPrice} children={item.price} />
            <View style={styles.vInputCode}>
              <FstImage
                source={R.images.img_edit_title}
                style={styles.imgEdit}
              />
              <TextInput
                onFocus={onFocusInputCode}
                value={item.code_product_livestream}
                style={styles.vTextInputCode}
                maxLength={50}
                // multiline={true}
                placeholder={'Nhập mã sản phẩm'}
                onChangeText={onChangeTextCode}
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                returnKeyType={'done'}
              />
            </View>
          </View>
          <View style={styles.vAction}>
            <Button
              onPress={onPressDeleteProduct}
              style={styles.btnTrash}
              children={
                <FastImage
                  source={R.images.img_trash}
                  style={styles.imgTrash}
                  tintColor={colors.primary}
                  resizeMode={'contain'}
                />
              }
            />
            <Button
              disabled={true}
              onPress={onPressUpdateCodeItem}
              style={styles.btnTrash}
              children={
                <Text
                  style={{
                    color: colors.primary,
                    ...fonts.medium14,
                  }}
                  // children={'Lưu'}
                  children={null}
                />
              }
            />
          </View>
        </View>
      }
    />
  )
}

const ItemListProductCart = ({
  item,
  index,
  onPressImgProduct,
  onPressShowProduct,
  onPressAddCart,
  type,
  itemProduct,
  isPreview,
  isShop,
}: propsItemListProductCart) => {
  const { show, showing } = R.strings()
  let checkIDItemProduct = itemProduct?.id === item?.id
  return (
    <View
      style={styles.vItemProductCart}
      children={
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={onPressImgProduct}
            children={
              <FstImage
                source={
                  item?.product?.product_media_url || item?.images?.length
                    ? {
                        uri: item?.images?.length
                          ? item?.images[0]?.src
                          : item?.product?.product_media_url,
                      }
                    : R.images.image_logo
                }
                style={styles.imgProduct}
              />
            }
          />
          <View style={styles.vValueProductCart}>
            <Text
              numberOfLines={2}
              style={styles.txtNameProductItem}
              children={
                item.code_product_livestream ||
                item?.name ||
                item?.product?.name
              }
            />
            <Text
              style={styles.txtPrice}
              children={
                formatPrice(item?.price || item?.product?.price || 0) + 'đ'
              }
            />
          </View>
          {/* {type === TYPE_ITEM.LIST_PRODUCT_SELL && !isPreview && (
            <Button
              disabled={checkIDItemProduct}
              onPress={onPressShowProduct}
              style={[
                styles.vBtnShowProduct,
                {
                  borderWidth: checkIDItemProduct ? 0 : 1,
                },
              ]}
              children={
                <Text
                  style={styles.txtShowProduct}
                  children={checkIDItemProduct ? showing : show}
                />
              }
            />
          )} */}
          {/* {type === TYPE_ITEM.LIST_PRODUCT_CART && !isPreview && ( */}
          <Button
            onPress={onPressAddCart}
            style={{ alignSelf: 'center' }}
            children={
              <FastImage
                source={R.images.img_add_cart_live}
                style={styles.img_add_cart}
                resizeMode={'contain'}
              />
            }
          />
          {/* )} */}
        </View>
      }
    />
  )
}
