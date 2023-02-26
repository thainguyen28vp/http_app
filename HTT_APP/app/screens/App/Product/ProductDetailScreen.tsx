import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import MediaSwiper from '@app/components/MediaSwiper/MediaSwiper'
import ProductItem from '@app/components/ProductItem'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  checkExistConversation,
  requestSendNewTopic,
} from '@app/service/Network/chat/ChatApi'
import {
  getProductDetail,
  requestAddToWishList,
  requestCheckExistProduct,
} from '@app/service/Network/product/ProductApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { checkExistUser, formatPrice } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native-gesture-handler'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import Modal from 'react-native-modal'
import reactotron from 'reactotron-react-native'
import ButtonFooter from './component/ButtonFooter'
import ProductDetailHeader from './component/ProductDetailHeader'
import ProductSelectTypeView from './component/ProductSelectTypeVIew'
import { requestGetProductCustomAttribute } from './slice/ProductCustomAttributeSlice'
import { checkDuplicatePrice } from './utils/ProductUtils'
import RenderHtml from 'react-native-render-html'

const { width } = dimensions
const RATIO = width / 375
const NUM_OF_LINES = 4

const ProductDetailScreen = (props: any) => {
  const product_id = props.route.params?.id || props.route.params?.product_id
  const token = props.route.params?.token
  const inTimeBuy = props.route.params?.inTimeBuy
  const item = props.route.params?.item
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [productDetail, setProductDetail] = useState<any>()
  const [similarProduct, setSimilarProduct] = useState<any>([])
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const [showMoreContent, setShowMoreContent] = useState<boolean>(false)
  const [isValidLength, setIsValidLength] = useState<boolean>(false)

  const scrolling = useRef(new Animated.Value(0)).current
  const isBuyNow = useRef<boolean>(false)

  const { data } = useAppSelector(state => state.accountReducer)
  const Dispatch = useAppDispatch()

  const headerBgColorAnimated = scrolling.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  })

  const BtnBgColorAnimated = scrolling.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(217, 219, 221, 1)', 'rgba(217, 219, 221, 0)'],
    extrapolate: 'clamp',
  })

  const headerTitleAnimated = scrolling.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  const onChatPress = () => {
    callAPIHook({
      API: checkExistConversation,
      payload: { shop_id: productDetail.kiotviet_id },
      useLoading: setDialogLoading,
      onSuccess: res => {
        if (!!res.data) {
          setDialogLoading(false)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
            conversationId: res.data.id,
          })
        } else {
          const payload = new FormData()
          payload.append('shop_id', `${productDetail.kiotviet_id}`)
          payload.append('content', `Bắt đầu`)
          callAPIHook({
            API: requestSendNewTopic,
            payload,
            useLoading: setDialogLoading,
            onSuccess: res => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
                conversationId: res.data.topic_message_id,
              })
            },
          })
        }
      },
      onError(err) {
        setDialogLoading(false)
      },
    })
  }

  const handleOnLikePress = (current: boolean) => {
    callAPIHook({
      API: requestAddToWishList,
      payload: { product_id: product_id },
      onSuccess: res => {
        setProductDetail((prev: any) => ({
          ...prev,
          check_like: current ? 0 : 1,
        }))
      },
    })
  }

  const getData = (product_id: number) => {
    callAPIHook({
      API: getProductDetail,
      payload: { product_id },
      useLoading: setIsLoading,
      onSuccess: res => {
        // reactotron.logImportant!('asdadasdas', Object.keys(res?.data).length)
        // if (Object.keys(res?.data).length == 0) {
        //   showMessages('', 'Sản phẩm đã ngừng bán', () => {
        //     NavigationUtil.goBack()
        //   })
        // } else {
        // Dispatch(
        //   requestGetProductCustomAttribute({
        //     id: product_id,
        //     stock_id: res.data.productDetail.stock_id,
        //   })
        // )
        setProductDetail(res.data)
        // setSimilarProduct(res.data.rows)
        // }
      },
    })
  }

  const checkProductExist = () => {
    if (productDetail?.stock <= 0) return true
    return false
  }

  const onTextLayout = useCallback(e => {
    setIsValidLength(e.nativeEvent.lines.length >= NUM_OF_LINES)
  }, [])

  useEffect(() => {
    getData(product_id)
  }, [product_id])

  useEffect(() => {
    item?.amount == 0
      ? showMessages('Thông báo', 'Sản phẩm hiện tại đã hết hàng!', () => {})
      : null
  }, [product_id])

  const renderImageSlider = () => {
    return (
      <MediaSwiper
        data={productDetail?.images.map((item: any) => item.src)}
        activeDotColor={'#595959'}
        inactiveDotColor={'#BFBFBF'}
        itemWidth={width}
      />
    )
  }
  const renderTopInformation = () => {
    let rangePrice =
      productDetail?.min_price !== productDetail?.max_price
        ? `${formatPrice(productDetail?.min_price)}đ - ${formatPrice(
            productDetail?.max_price
          )}đ`
        : `${formatPrice(productDetail?.min_price)}đ`
    return (
      <View>
        <View
          style={{
            paddingVertical: 13,
            paddingHorizontal: 15,
            backgroundColor: colors.white,
          }}
        >
          <View
            style={{
              ...styleView.rowItemBetween,
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{ ...fonts.medium16, flex: 1 }}
              children={productDetail?.name + ' ' + (productDetail?.unit || '')}
            />
            {/* <Button
              onPress={() => {}}
              children={
                <FastImage
                  style={{ width: 24, height: 24 }}
                  source={R.images.ic_sharing}
                />
              }
            /> */}
          </View>
          {token ? (
            <>
              <Text
                style={{ ...fonts.regular13, color: colors.grey.light }}
                children={`Số lượng: ${productDetail?.stock}`}
              />
              <Text
                style={{
                  ...fonts.medium16,
                  color: colors.primary,
                  marginTop: 10,
                }}
                children={`${
                  formatPrice(productDetail?.selling_price || 0) + 'đ'
                  // productDetail?.max_price
                  //   ? checkDuplicatePrice(rangePrice)
                  //   : formatPrice(productDetail?.price) || 0 + 'đ'
                }`}
              />
            </>
          ) : (
            <Text
              style={{
                ...fonts.medium16,
                flex: 1,
                color: '#595959',
              }}
              children={'Liên hệ'}
            />
          )}
        </View>
        <Button
          onPress={() => {
            // NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_REVIEW, {
            //   id: product_id,
            // })
          }}
          children={
            <View
              style={{
                ...styleView.rowItemBetween,
                marginVertical: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: colors.white,
                alignItems: 'center',
              }}
            >
              <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                <FastImage
                  style={{ width: 18, height: 18, marginRight: 8 }}
                  source={R.images.icon_star}
                />
                <Text
                  style={{ ...fonts.regular14, color: '#595959' }}
                  children={`${productDetail?.total_star || 0} (${
                    productDetail?.quantity_review || 0
                  } đánh giá) | ${
                    productDetail?.sold <= 0 ? 0 : productDetail?.sold
                  } đã bán`}
                />
              </View>
              <FastImage
                style={{ width: 20, height: 20 }}
                source={R.images.ic_arrow_right}
              />
            </View>
          }
        />
      </View>
    )
  }

  const renderProductAttributeView = () => {
    const attributeMedia = productDetail?.attribute_media?.split(' ') || []
    const isProductTypeExist = Boolean(productDetail?.attribute_custom)

    return (
      <View>
        {isProductTypeExist && (
          <Button
            onPress={() => setModalTypeVisible(true)}
            children={
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 13,
                  backgroundColor: colors.white,
                }}
              >
                <Text
                  style={{
                    ...fonts.medium16,
                    marginBottom: 15,
                    color: '#595959',
                  }}
                >
                  Chọn loại hàng
                  <Text
                    style={{ ...fonts.regular14, color: '#69747E' }}
                    children={`(${productDetail?.attribute_custom})` || ''}
                  />
                </Text>
                <ScrollView
                  scrollEnabled={false}
                  horizontal
                  children={attributeMedia.map((item: string) => (
                    <FstImage
                      style={{
                        width: 58 * RATIO,
                        aspectRatio: 1,
                        borderRadius: 10,
                        marginRight: 11 * RATIO,
                      }}
                      source={{ uri: item }}
                    />
                  ))}
                />
              </View>
            }
          />
        )}

        {productDetail?.description ? (
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 12,
              backgroundColor: colors.white,
              marginTop: 1,
            }}
          >
            <Text
              style={{
                ...fonts.medium16,
                marginBottom: 10,
                color: '#595959',
              }}
              children={'Chi tiết sản phẩm'}
            />
            <RenderHtml
              contentWidth={WIDTH}
              source={{ html: productDetail?.description }}
            />
            {/* <Text
            selectable
            style={{ ...fonts.regular16, color: '#595959' }}
            onTextLayout={onTextLayout}
            numberOfLines={!showMoreContent ? NUM_OF_LINES : undefined}
            children={productDetail?.description || 'Đang cập nhật'}
          /> */}
            {isValidLength && (
              <Button
                onPress={() => {
                  setShowMoreContent(prev => !prev)
                }}
                children={
                  <Animatable.Text
                    style={{
                      ...fonts.medium14,
                      color: colors.primary,
                      marginTop: 5,
                    }}
                    children={!showMoreContent ? 'Xem thêm' : 'Ẩn bớt'}
                  />
                }
              />
            )}
          </View>
        ) : null}
      </View>
    )
  }

  const renderSimilarProduct = () => {
    return (
      <View>
        {!!similarProduct.length && (
          <Text
            style={{
              ...fonts.medium16,
              color: '#595959',
              marginLeft: 15,
              marginVertical: 12,
            }}
            children={'Sản phẩm tương tự'}
          />
        )}
        <FlatList
          data={similarProduct}
          contentContainerStyle={{ paddingBottom: 8 }}
          renderItem={({ item, index }) => (
            <ProductItem item={item} index={index} />
          )}
          keyExtractor={(_, index) => `${index}`}
        />
      </View>
    )
  }

  const ModalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeView
          productDetail={productDetail}
          onClosePress={() => {
            isBuyNow.current = false
            setModalTypeVisible(false)
          }}
          product_id={product_id}
          stock_id={productDetail?.stock_id}
          isBuyNow={isBuyNow.current}
          shop_id={productDetail?.shop_id}
          inTimeBuy={inTimeBuy}
        />
      </Modal>
    )
  }

  return (
    <ScreenWrapper
      unsafe
      header={
        <ProductDetailHeader
          title={productDetail?.name}
          headerBgColor={headerBgColorAnimated}
          headerTitleColor={headerTitleAnimated}
          headerBtnColor={BtnBgColorAnimated}
          isLike={!!productDetail?.check_like}
          onLikeClick={handleOnLikePress}
        />
      }
      dialogLoading={dialogLoading}
      isLoading={isLoading}
    >
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getData(product_id)}
          />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrolling,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        <ModalSelectType />
        {renderImageSlider()}
        {renderTopInformation()}
        {renderProductAttributeView()}
        {renderSimilarProduct()}
      </Animated.ScrollView>
      {token ? (
        <ButtonFooter
          bg3={item?.amount == 0 ? '#DDD' : colors.primary}
          disabled={item?.amount == 0}
          showAction2={!data.shop_id || data?.shop_id != productDetail?.shop_id}
          action1={async () => {
            checkExistUser(async () => {
              if (productDetail?.stock <= 0) {
                if (inTimeBuy) return setModalTypeVisible(true)
                return showMessages('', 'Sản phẩm hiện đã hết hàng!')
              }
              return setModalTypeVisible(true)
            })
          }}
          action2={() => {
            checkExistUser(async () => {
              onChatPress()
            })
          }}
          action3={() => {
            checkExistUser(async () => {
              if (productDetail?.stock <= 0) {
                if (inTimeBuy) {
                  isBuyNow.current = true
                  setModalTypeVisible(true)
                  return
                }
                return showMessages('', 'Sản phẩm hiện đã hết hàng!')
              }
              isBuyNow.current = true
              setModalTypeVisible(true)
            })
          }}
          url1={R.images.ic_cart_fill}
          url2={R.images.ic_chat}
          title={'Mua ngay'}
          iphoneX={isIphoneX()}
          img1Style={{ width: 28, height: 28 }}
          img2Style={{ width: 28, height: 28 }}
          img1TintColor={colors.primary}
          img2TintColor={colors.primary}
          bg1={colors.white}
          bg2={colors.white}
          line
        />
      ) : (
        <>
          <DebounceButton
            onPress={() => {
              showMessages(
                '',
                'Liên hệ hotline để được quản trị viên cung cấp tài khoản',
                () => {},
                'Đồng ý'
              )
            }}
            style={{
              backgroundColor: colors.primary,
              marginHorizontal: 15,
              borderRadius: 10,
              marginBottom: 8,
              marginTop: 5,
            }}
            children={
              <Text
                style={{
                  color: colors.white,
                  textAlign: 'center',
                  marginVertical: 16,
                  ...fonts.semi_bold16,
                }}
                children={'Liên hệ'}
              />
            }
          />
          {isIphoneX() && (
            <View
              style={{
                width: '100%',
                height: getBottomSpace() - 15,
                backgroundColor: colors.white,
              }}
            />
          )}
        </>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({})

export default ProductDetailScreen
