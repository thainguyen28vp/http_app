import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestUploadMultipleImage } from '@app/service/Network/livestream/LiveStreamApi'
// import { requestUploadMultipleImage } from '@app/service/Network/files/FilesApi'
import { requestReviewOrder } from '@app/service/Network/shop/ShopApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import MediaPickerModal from '@component/MediaPickerModal'
import { useNavigation } from '@react-navigation/core'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'reactotron-react-native'
import StartSelect from '../../Product/component/StartSelect'
import { genProductAttributeName } from '../../Product/utils/ProductUtils'
import {
  addImage,
  clearData,
  fillStar,
  removeImage,
  requestGetOrderRatingThunk,
  setReviewText,
} from '../slice/OrderRatingSlice'

const { width } = dimensions

const OrderRatingScreen = (props: any) => {
  const order_id = props.route.params?.order_id
  const index = props.route.params?.index
  const reloadList = props.route.params?.reloadList
  const listProduct = props.route.params?.listProduct
  const check_review = props.route.params?.check_review

  const navigation = useNavigation()

  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const pickerIdRef = useRef<number>(0)

  const { data, isLoading, error } = useAppSelector(
    state => state.OrderRatingReducer
  )
  const Dispatch = useAppDispatch()

  const getData = () => {
    Dispatch(requestGetOrderRatingThunk({ order_id }))
  }

  const handleOnSubmit = () => {
    showConfirm('', 'Bạn có chắc chắn muốn đánh giá đơn hàng', () => {
      const body = {
        items: data.map((item: any) => ({
          array_image: item.listImage.map((item: any) => item.url),
          // comment: item.review,
          note: item.review,
          star: item.star,
          product_id: item.product_id,
          // note: genProductAttributeName(item),
        })),
      }
      callAPIHook({
        API: requestReviewOrder,
        payload: { id_order: order_id, body },
        onSuccess: res => {
          showMessages('', 'Đánh giá đơn hàng thành công', () => {
            Dispatch(clearData())
            reloadList(index)
            NavigationUtil.goBack()
          })
        },
      })
    })
  }

  const onPicker = (res: any) => {
    let payload = new FormData()
    res.data.forEach((item: any) => {
      payload.append('file', {
        name: `images${new Date().getTime()}.png`,
        type: 'image/png',
        // filename: 'image.png',
        uri: item.path,
      })
    })

    callAPIHook({
      API: requestUploadMultipleImage,
      useLoading: setDialogLoading,
      payload: {
        type: 1,
        formData: payload,
      },
      onSuccess: res => {
        const listRes = res.data
        Dispatch(
          addImage({
            index: pickerIdRef.current,
            listImage: !!data[pickerIdRef.current].listImage.length
              ? [...data[pickerIdRef.current].listImage, ...listRes]
              : listRes,
          })
        )
      },
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false })
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const renderOrderRatingItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <View>
        <View
          style={{
            ...styleView.rowItem,
            backgroundColor: colors.white,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <FstImage style={styles.imgProduct} source={{ uri: item.image }} />
          <View style={{ height: 50, justifyContent: 'space-between' }}>
            <Text style={{ ...fonts.medium15 }} children={item.product_name} />
            <Text
              style={{ ...fonts.regular15 }}
              children={genProductAttributeName(item)}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 15,
            backgroundColor: colors.white,
            marginTop: 2,
          }}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingVertical: 25 }}
          >
            {!check_review && (
              <Button
                onPress={() => {
                  pickerIdRef.current = index
                  setIsVisible(true)
                }}
                children={
                  <View
                    style={{
                      ...styleView.centerItem,
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      borderStyle: 'dashed',
                      borderWidth: 1,
                    }}
                  >
                    <FastImage
                      style={{ width: 35, height: 35 }}
                      source={R.images.ic_default}
                    />
                    <Text
                      style={{ ...fonts.regular12, marginTop: 5 }}
                      children={'Chọn ảnh'}
                    />
                  </View>
                }
              />
            )}
            {(!check_review ? item?.listImage : item?.rating?.images)?.map(
              (item: string, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: 75,
                      height: 75,
                      marginLeft: 12,
                    }}
                  >
                    <FstImage
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                      }}
                      source={{ uri: item?.url || item?.src }}
                    />
                    {!check_review && (
                      <Button
                        onPress={() =>
                          Dispatch(removeImage({ url: item, index }))
                        }
                        style={{ position: 'absolute', top: -5, right: -5 }}
                        children={
                          <FastImage
                            style={{ width: 20, height: 20 }}
                            source={R.images.ic_remove}
                          />
                        }
                      />
                    )}
                  </View>
                )
              }
            )}
          </ScrollView>
          <StartSelect
            initalStar={check_review ? item?.rating?.star : undefined}
            disabled={check_review}
            onPress={star => {
              if (!check_review) {
                Dispatch(fillStar({ index, star }))
              }
            }}
            contentStyle={{ flex: 1, justifyContent: 'center' }}
          />
          <View
            style={styles.inputView}
            children={
              <TextInput
                editable={!check_review}
                placeholder={'Nhập đánh giá của bạn'}
                value={
                  !check_review
                    ? listProduct[index]?.review
                    : item?.rating_content
                }
                onChangeText={text => Dispatch(setReviewText({ index, text }))}
                multiline
                style={{
                  flex: 1,
                  ...fonts.regular16,
                  color: check_review ? '#DDD' : undefined,
                }}
              />
            }
          />
        </View>
      </View>
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 12 }} />,
    []
  )

  const renderBody = () => {
    return (
      <>
        <FlatList
          data={data}
          keyExtractor={(_, index) => `${index}`}
          renderItem={renderOrderRatingItem}
          ItemSeparatorComponent={renderItemSeparator}
        />
        {!check_review && (
          <Button
            onPress={handleOnSubmit}
            style={styles.btnSubmit}
            children={
              <Text
                style={{ ...fonts.medium14, color: 'white' }}
                children={'Đánh giá'}
              />
            }
          />
        )}
        <MediaPickerModal
          isVisible={isVisible}
          useVisible={setIsVisible}
          multiply
          onPicker={onPicker}
        />
      </>
    )
  }

  return (
    <ScreenWrapper
      scroll
      titleHeader={'Đánh giá'}
      back
      isLoading={isLoading}
      isError={error}
      reload={() => getData()}
    >
      {renderBody()}
      {/* {!dialogLoading && <LoadingProgress />} */}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  imgProduct: { width: 50, height: 50, borderRadius: 5, marginRight: 14 },
  inputView: {
    height: 111,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 16,
    padding: 10,
    marginTop: 22,
  },
  btnSubmit: {
    ...styleView.centerItem,
    marginTop: 35,
    width: width - 40,
    alignSelf: 'center',
    height: 50,
    backgroundColor: '#D5A227',
    borderRadius: 10,
  },
})

export default OrderRatingScreen
