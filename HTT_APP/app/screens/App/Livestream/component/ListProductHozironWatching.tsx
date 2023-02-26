import { LIVESTREAM_EVENT } from '@app/config/Constants'
import { useAppDispatch, useAppSelector } from '@app/store'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useEffect } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import {
  deleteProductWatching,
  updateListProductSelect,
} from '../../Product/slice/ListProductSlice'
import { updateCountProduct } from '../slice/LiveSlice'
import { styles } from '../styles'
import R from '@app/assets/R'

const {
  CREATE_UPDATE_PRODUCT,

  DELETE_PRODUCT,
} = LIVESTREAM_EVENT

const ListProductHozironWatching = ({
  socket,
  channelId,
  onPressItem,
}: {
  socket?: any
  channelId?: any
  onPressItem: (item: any) => void
}) => {
  const { listProductSelect } = useAppSelector(
    state => state.ListProductReducer
  )
  const appDispatch = useAppDispatch()

  const handleSocket = (res: any) => {
    if (res.type_action == CREATE_UPDATE_PRODUCT) {
      return appDispatch(updateListProductSelect({ data: res.data }))
    }
    if (res.type_action == DELETE_PRODUCT) {
      res.data.products_livestream_id.forEach((element: any) => {
        appDispatch(deleteProductWatching({ id: element }))
      })
      return
    }
  }
  useEffect(() => {
    SocketHelperLivestream?.socket?.on(channelId, handleSocket)
    return () => {
      SocketHelperLivestream.socket?.off(channelId, handleSocket)
    }
  }, [])
  useEffect(() => {
    appDispatch(updateCountProduct({ count: listProductSelect?.length }))
  }, [listProductSelect?.length])
  return (
    <FlatList
      keyboardShouldPersistTaps={'always'}
      style={styles.vListProductHozi}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={listProductSelect}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item, index }: { item: any; index: number }) => {
        return (
          <TouchableOpacity
            style={styles.vBtnItem}
            onPress={() => {
              onPressItem(item)
            }}
            children={
              <View style={styles.vContentItem}>
                <FastImage
                  source={
                    item?.images?.length || item?.product
                      ? {
                          uri: item?.images?.length
                            ? item?.images[0]?.src
                            : item?.product?.product_media_url,
                        }
                      : R.images.image_logo
                  }
                  style={styles.imgProductItem}
                />
                <View style={styles.vContentText}>
                  <Text
                    style={styles.txtNameProduct}
                    children={
                      item?.code_product_livestream ||
                      item?.name ||
                      item?.product?.name ||
                      R.strings().not_update
                    }
                    numberOfLines={3}
                  />
                  {/* {!item?.code_product_livestream ? ( */}
                  <Text
                    style={styles.txtPriceItem}
                    children={
                      formatPrice(item?.price || item?.product?.price || 0) +
                      ' đ'
                    }
                  />
                  {/* ) : null} */}
                </View>
              </View>
            }
          />
        )
      }}
    />
  )
}

export default ListProductHozironWatching
