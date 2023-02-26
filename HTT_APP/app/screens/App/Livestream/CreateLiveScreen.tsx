import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import LoadingProgress from '@app/components/LoadingProgress'
import MediaPickerModal from '@app/components/MediaPickerModal'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  requestCreateLiveStream,
  requestUploadImage,
} from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, HEIGHT, OS, WIDTH } from '@app/theme'
import { showConfirm, showMessages } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  formatPrice,
  handlePrice,
  handleResizeImage,
} from '@app/utils/FuncHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useState } from 'react'
import { Animated, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TextInput } from 'react-native-gesture-handler'
import ImageResizer from 'react-native-image-resizer'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import reactotron from 'reactotron-react-native'
import {
  removeProduct,
  requestListProductThunk,
  updateCodeProduct,
} from '../Product/slice/ListProductSlice'
import { updateInfoLive } from './slice/CreateLiveSlice'
import { styles } from './styles'

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView
)

const CreateLiveScreen = (props: any) => {
  const [imgProdduct, setImgProdduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const appDispatch = useAppDispatch()
  const dataProduct = useAppSelector(state => state.ListProductReducer)
  const [listProduct, setListProduct] = useState([])
  const [checkUpdate, setCheckUpdate] = useState(false)
  const [codeProduct, setCodeProduct] = useState('')
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const uploadImage = (imgProdduct: string) => {
    const formData = new FormData()
    formData.append('file', {
      name: `images${new Date().getTime()}.jpg`,
      type: 'image/jpeg',
      uri: imgProdduct,
    })
    const payload = {
      type: 1,
      formData,
    }

    callAPIHook({
      API: requestUploadImage,
      payload: payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        setImgProdduct(res.data.url)
      },
      onError: err => {
        showMessages(R.strings().notification, 'Tải ảnh lỗi! Vui lòng thử lại.')
      },
    })
  }
  const handleAction = () => {
    let products: object[] = []
    if (!imgProdduct) {
      showMessages(R.strings().notification, 'Vui lòng chọn ảnh bìa!')
      return
    }
    if (!title) {
      showMessages(
        R.strings().notification,
        'Vui lòng nhập tiêu để live stream!'
      )
      return
    }
    dataProduct?.listProductSelect.map((item: any) =>
      products.push({
        id: +item.id,
        code_product_livestream: item.code_product_livestream,
      })
    )
    // appDispatch(
    //   requestListProductThunk({
    //     page: 1,
    //     limit: 1000,
    //   })
    // )
    appDispatch(updateInfoLive({ title, url: imgProdduct }))
    const payload = {
      title: title,
      cover_image_url: imgProdduct,
      products,
    }
    callAPIHook({
      API: requestCreateLiveStream,
      payload: payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        // SocketHelper.socket?.emit(`subscribe_livestream_channel`, res.data.id)
        // SocketHelperLivestream.socket?.emit(
        //   `subscribe_livestream_channel`,
        //   res.data.id
        // )
        // SocketHelperLivestream.socket?.on('connect', function () {
        //   console.log('connect')
        SocketHelperLivestream.socket?.emit(
          `subscribe_livestream_channel`,
          res.data.id
        )
        NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_LIVE, {
          data: res.data,
          streamName: res.data.createdBroadcast?.cdn?.ingestionInfo.streamName,
          ingestionAddress:
            res.data.createdBroadcast.cdn.ingestionInfo.ingestionAddress,
        })
      },
      onError: err => {},
    })
  }

  const handleOnPicker = async (res: any) => {
    let url = await handleResizeImage(res.data[0])
    uploadImage(url.uri)
  }

  const renderBody = () => {
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HEIGHT * 0.2 }}
        enableResetScrollToCoords={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            backgroundColor: colors.white,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsVisible(prev => !prev)
            }}
            style={{ alignSelf: 'center' }}
          >
            <FstImage
              source={
                imgProdduct ? { uri: imgProdduct } : R.images.img_cover_image
              }
              style={{
                width: dimensions.width / 2.5,
                height: dimensions.width / 2.5,
                borderRadius: 10,
              }}
              resizeMode={'cover'}
            >
              {imgProdduct ? (
                <TouchableOpacity
                  onPress={() => setImgProdduct(null)}
                  style={{
                    alignSelf: 'flex-end',
                    padding: 5,
                  }}
                >
                  <FastImage
                    source={R.images.img_close_lv}
                    style={{ width: 24, height: 24 }}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              ) : null}
            </FstImage>
          </TouchableOpacity>
          <TextInput
            style={styles.txtTitleLive}
            placeholder={'Tiêu đề live stream'}
            onChangeText={title => setTitle(title)}
          />
        </View>
        {renderListProduct()}
        <MediaPickerModal
          isVisible={isVisible}
          useVisible={setIsVisible}
          onPicker={handleOnPicker}
        />
      </KeyboardAwareScrollView>
    )
  }
  const renderListProduct = () => {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Text style={styles.txtListProduct} children={'Danh sách sản phẩm'} />
        <TouchableOpacity
          style={styles.vAddProduct}
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_PRODUCT_LIVE, {})
          }}
        >
          <Text
            style={{ ...fonts.regular16, color: colors.primary }}
            children={'Thêm sản phẩm'}
          />

          <FstImage
            source={R.images.img_add_product}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        {dataProduct?.listProductSelect?.map((item: any) => (
          <ItemProduct item={item} key={item.id} />
        ))}
      </View>
    )
  }
  return (
    <ScreenWrapper
      // style={{ flex: 1 }}
      titleHeader={'Phát trực tiếp'}
      back
      unsafe
    >
      {/* <RNHeader titleHeader={'Phát trực tiếp'} back /> */}
      {renderBody()}
      <Button
        style={styles.vBtnNext}
        onPress={handleAction}
        children={
          <Text style={styles.vBtnNextCreateLive} children={'Tiếp theo'} />
        }
      />
      {isLoading && <LoadingProgress />}
    </ScreenWrapper>
  )
}

export default CreateLiveScreen

const ItemProduct = ({ item }: { item: any }) => {
  const appDispatch = useAppDispatch()
  return (
    <TouchableOpacity
      disabled={true}
      key={item.id}
      onPress={() =>
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
          id: item.id,
        })
      }
      style={styles.vItemProducCreateLive}
      children={
        <View style={{ flexDirection: 'row' }}>
          <FstImage
            source={
              item?.src || item.images?.length
                ? {
                    uri: item?.src || item.images[0]?.src,
                  }
                : R.images.image_logo
            }
            style={{ width: 70, height: 70, borderRadius: 5 }}
          />
          <View style={{ marginHorizontal: 15, flex: 1 }}>
            <Text style={{ ...fonts.regular16 }} children={item?.name} />
            <Text
              style={{
                ...fonts.regular15,
                color: colors.primary,
                marginTop: 8,
              }}
              children={formatPrice(item.price)}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                paddingBottom: 10,
              }}
            >
              <FstImage
                source={R.images.img_edit_title}
                style={{ width: 20, height: 20 }}
              />
              <TextInput
                value={item?.code_product_livestream}
                style={styles.inputItem}
                maxLength={50}
                // multiline={true}
                placeholder={'Nhập mã sản phẩm trong live'}
                onChangeText={code => {
                  appDispatch(
                    updateCodeProduct({
                      id: item.id,
                      code_product_livestream: code,
                    })
                  )
                }}
                returnKeyType={'done'}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              showConfirm(
                R.strings().notification,
                'Bạn có chắc chắn muốn xoá sản phẩm này không?',
                () => {
                  appDispatch(removeProduct({ item }))
                },
                '',
                'Đồng ý'
              )
            }}
            style={{
              padding: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <FstImage
              source={R.images.img_trash}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      }
    />
  )
}
