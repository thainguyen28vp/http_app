import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { getListCommentHistory } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch } from '@app/store'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice } from '@app/utils/FuncHelper'
import ProductSelectTypeModal from '@screen/App/Product/component/ProductSelectTypeVIew'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Modal from 'react-native-modal'
import YoutubePlayer from 'react-native-youtube-iframe'
import ytdl from 'react-native-ytdl'
import reactotron from 'ReactotronConfig'
import { styles } from './styles'

const RecordScreen = (props: any) => {
  const { products, title, livestream_record_url, broadcast_id, id } =
    props.route.params.item
  const fakeBroadcast = 'lMxEA4hQdns'
  const [videoID, setVideoID] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isErr, setIsErr] = useState(false)
  const [idVideo, setIdVideo] = useState(broadcast_id)
  const [productTarget, setProductTarget] =
    useState<{ productId: number; stockId: number }>()
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const [loadingComment, setLoadingComment] = useState(false)
  const [listComment, setListComment] = useState(false)
  const isBuyNow = React.useRef<boolean>(false)
  const [itemProduct, setItemProduct] = useState<any>()

  const appDispatch = useAppDispatch()

  const handleLinkYT = async () => {
    setIsErr(false)
    setIsLoading(prev => !prev)
    const youtubeURL = 'http://www.youtube.com/watch?v=' + broadcast_id
    try {
      const urls = await ytdl(youtubeURL, { quality: 'highestvideo' })
      if (urls?.length) {
        setIsErr(false)
        setIsLoading(prev => !prev)
        setVideoID(urls[0])
        setIsErr(false)
      }
    } catch (error) {
      setIsLoading(false)
      // setIsErr(true)
    }
  }
  const getListComment = () => {
    callAPIHook({
      API: getListCommentHistory,
      payload: id,
      useLoading: setLoadingComment,
      onSuccess: res => {
        setListComment(res.data)
      },
      onError: err => {},
    })
  }

  useEffect(() => {
    getListComment()
    handleLinkYT()
  }, [])

  const ListProduct = () => {
    return (
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{ paddingRight: 10 }}
          scrollEnabled={!!products?.length}
          keyboardShouldPersistTaps={'always'}
          style={[styles.vListProductHozi]}
          showsVerticalScrollIndicator={false}
          data={products}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item, index }) => (
            <Item
              item={item}
              index={index}
              onPressCart={() => {
                setProductTarget({
                  productId: item.product_id,
                  stockId: item.stock_id,
                })
                setItemProduct(item)
                setModalTypeVisible(true)
              }}
            />
          )}
          ListEmptyComponent={
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FastImage
                style={{
                  marginTop: HEIGHT * 0.12,
                  width: WIDTH / 2,
                  height: WIDTH / 2,
                  alignSelf: 'center',
                }}
                source={R.images.ic_empty}
              />
              <Text
                style={{
                  ...fonts.regular13,
                  color: colors.black,
                  marginTop: 8,
                }}
                children={'Danh sách trống!'}
              />
            </View>
          }
        />
      </View>
    )
  }
  const Loading = () => (
    <View
      style={{
        top: HEIGHT * 0.1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <>
        <ActivityIndicator color={colors.white} />
        <Text
          style={{ ...fonts.regular14, color: colors.white, marginTop: 8 }}
          children={'Đang tải ...'}
        />
      </>
    </View>
  )
  const Error = () => (
    <TouchableOpacity
      onPress={() => handleLinkYT()}
      style={{
        top: HEIGHT * 0.1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <>
        <FastImage
          source={R.images.img_refresh_record}
          style={{ width: 25, height: 25 }}
          tintColor={colors.white}
        />
        <Text
          style={{ ...fonts.regular13, color: colors.white, marginTop: 10 }}
          children={'Đã có lỗi xảy ra!'}
        />
      </>
    </TouchableOpacity>
  )
  const renderVideo = () => {
    if (isLoading) return <Loading />
    if (isErr) return <Error />
    return (
      <YoutubePlayer
        volume={100}
        height={HEIGHT / 3.4}
        width={WIDTH}
        play={true}
        forceAndroidAutoplay={true}
        videoId={idVideo}
        useLocalHTML={true}
        contentScale={1.0}
        onPlaybackRateChange={playbackRate => {
          console.log('playbackRate', playbackRate)
        }}
        initialPlayerParams={{
          controls: true,
          // preventFullScreen: true,
          // modestbranding: false,
          iv_load_policy: 3,
          width: WIDTH,
          height: HEIGHT,
          rel: false,
        }}
      />
    )
  }
  const modalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeModal
          productDetail={itemProduct}
          onClosePress={() => {
            isBuyNow.current = false
            setModalTypeVisible(false)
          }}
          isBuyNow={isBuyNow.current}
        />
      </Modal>
    )
  }

  const ListComment = () => {
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: '5%' }}
        style={{ flex: 1 }}
        data={listComment}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                marginHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#DDD',
                paddingBottom: 8,
              }}
            >
              <FastImage
                source={
                  item?.User.profile_picture_url
                    ? { uri: item?.User.profile_picture_url }
                    : R.images.img_user
                }
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'red',
                  borderRadius: 30 / 2,
                }}
              />
              <Text style={{ ...fonts.semi_bold14, marginLeft: 8 }}>
                {item.User.name}:{' '}
                <Text
                  style={{ ...fonts.regular13, marginLeft: 5 }}
                  children={item.content}
                />
              </Text>
            </View>
          )
        }}
      />
    )
  }

  return (
    <ScreenWrapper titleHeader={title} back unsafe>
      <View
        style={{
          width: WIDTH,
          height: HEIGHT / 3.7 - 5,
          backgroundColor: 'black',
        }}
        children={renderVideo()}
      />

      {!!products?.length && (
        <>
          <Text
            style={{
              ...fonts.semi_bold16,
              marginLeft: 10,
              marginTop: isIphoneX() ? '3%' : '5%',
              marginBottom: 5,
            }}
            children={'Danh sách sản phẩm Live'}
          />
          <ListProduct />
        </>
      )}
      {!!listComment?.length && (
        <>
          <Text
            style={{
              ...fonts.semi_bold16,
              marginLeft: 10,
              marginTop: !products?.length ? '3%' : 5,
              marginBottom: 5,
            }}
            children={'Danh sách bình luận'}
          />
          <ListComment />
        </>
      )}
      {!products?.length && !listComment?.length ? (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FastImage
            style={{
              marginTop: HEIGHT * 0.12,
              width: WIDTH / 2,
              height: WIDTH / 2,
              alignSelf: 'center',
            }}
            source={R.images.ic_empty}
          />
          <Text
            style={{
              ...fonts.regular13,
              color: colors.black,
              marginTop: 8,
            }}
            children={'Danh sách trống!'}
          />
        </View>
      ) : null}
      {modalSelectType()}
    </ScreenWrapper>
  )
}

export default RecordScreen

const Item = ({
  item,
  index,
  onPressCart,
}: {
  item: any
  index: number
  onPressCart: () => void
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.vBtnItem,
        {
          marginVertical: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
        },
      ]}
      onPress={() => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
          id: item.product_id,
        })
      }}
      children={
        <View style={[styles.vContentItem]}>
          <FastImage
            source={
              item?.product?.product_media_url
                ? { uri: item?.product?.product_media_url }
                : R.images.image_product
            }
            style={styles.imgProductItem}
          />
          <View style={styles.vContentText}>
            <Text
              style={styles.txtNameProduct}
              children={item?.code_product_livestream || item?.product?.name}
              numberOfLines={2}
            />
            <Text
              style={styles.txtPriceItem}
              children={formatPrice(item.product.price || 0) + ' đ'}
            />
          </View>
          <Button
            onPress={onPressCart}
            style={{ alignSelf: 'center', position: 'absolute', right: 8 }}
            children={
              <FastImage
                source={R.images.img_add_cart_live}
                style={styles.img_add_cart}
                resizeMode={'contain'}
              />
            }
          />
        </View>
      }
    />
  )
}
