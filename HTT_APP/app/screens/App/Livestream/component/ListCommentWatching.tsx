import R from '@app/assets/R'
import { LIVESTREAM_EVENT } from '@app/config/Constants'
import { requestGetListComment } from '@app/service/Network/livestream/LiveStreamApi'
import { colors, fonts } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import { useImmer } from 'use-immer'
import { ItemCommentWatching } from '../props'
import { styles } from '../styles'

const { COMMENT } = LIVESTREAM_EVENT

const ListCommentWatching = useMemo(
  () =>
    ({
      socket,
      channelId,
      isAdmin,
      livestream_id,
      shopId,
    }: {
      shopId?: number | undefined
      isAdmin?: boolean | undefined
      socket?: any
      channelId?: any
      livestream_id?: number | undefined
    }) => {
      const [dataListComment, setDataListComment] = useImmer<any>([])
      const [isLastPage, setIsLastPage] = useState(false)
      const [payload, setPayload] = useState({
        livestream_id,
        page: 1,
      })

      const getListComment = () => {
        callAPIHook({
          API: requestGetListComment,
          payload,
          onSuccess: res => {
            if (res?.data?.length) {
              setDataListComment((prev: object[]) => prev.concat(res.data))
            } else {
              setIsLastPage(true)

              setDataListComment((prev: object[]) => prev.concat(res.data))

              return
            }
          },
          onError: err => {},
        })
      }
      const handleLoadMore = () => {
        if (!isLastPage)
          return setPayload({ ...payload, page: payload.page + 1 })
      }
      useEffect(() => {
        if (payload.page !== 1) {
          getListComment()
          return
        }
      }, [payload.page])
      useEffect(() => {
        SocketHelper?.socket?.on(channelId, (res: any) => {
          if (res.type_action === COMMENT) {
            setTimeout(() => {
              setDataListComment((prev: any) => [res.data, ...prev])
            }, 300)

            return
          }
        })
      }, [])
      useEffect(() => {
        getListComment()
      }, [])

      // useEffect(() => {
      //   const timeoutCacheRef = setInterval(() => {
      //     console.log('dsd')

      //     setDataListComment((pref: any) => {
      //       console.log('ds333d')
      //       const length = dataListComment?.length
      //       if (length <= 0) {
      //         return
      //       }
      //       if (length > 10) {
      //         pref.items = pref.cache.slice(-50)
      //       } else {
      //         pref.items.push(...pref.cache)
      //         const msgLength = pref.items.length
      //         if (msgLength > 50) {
      //           pref.items.splice(0, msgLength - 50)
      //         }
      //       }
      //     })
      //   }, 300)

      //   return () => {
      //     timeoutCacheRef && clearInterval(timeoutCacheRef)
      //   }
      // }, [setDataListComment])

      const renderFooter = () => {
        return (
          <View style={{ marginTop: 5 }}>
            {!isLastPage ? <ActivityIndicator color={colors.white} /> : null}
          </View>
        )
      }
      return (
        <FlatList
          style={[styles.vFlatlistComment]}
          keyExtractor={(item, index) => `${index}`}
          inverted={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
          }}
          data={dataListComment}
          renderItem={({ item, index }) => (
            <RenderItem
              item={item}
              index={index}
              isAdmin={isAdmin}
              shopId={shopId}
            />
          )}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.2}
          onEndReached={handleLoadMore}
        />
      )
    },
  []
)

export default ListCommentWatching

const RenderItem = ({
  item,
  index,
  isAdmin,
  shopId,
}: {
  item: ItemCommentWatching
  index: number
  shopId: number | undefined
  isAdmin: boolean | undefined
}) => {
  const checkNameUser = () => {
    if (item?.shop_id || item.Shop?.id) {
      if (item?.shop_id === shopId || item.Shop?.id === shopId)
        return item?.Shop?.name || 'Chưa cập nhật'
      return item?.User?.name || 'Chưa cập nhật'
    }
    return item?.User?.name || 'Chưa cập nhật'
  }
  const checkImage = () => {
    if (item?.Shop?.id || item?.Shop?.id) {
      if (item?.shop_id === shopId || item.Shop?.id === shopId)
        return item?.Shop?.profile_picture_url
          ? { uri: item?.Shop?.profile_picture_url }
          : R.images.img_user
      return item?.User?.profile_picture_url
        ? { uri: item?.User?.profile_picture_url }
        : R.images.img_user
    }
    return item?.User?.profile_picture_url
      ? { uri: item?.User?.profile_picture_url }
      : R.images.img_user
  }

  return (
    <View style={styles.vItemComment}>
      <FastImage source={checkImage()} style={styles.imgUser} />
      <View style={styles.vContentComment}>
        <Text style={styles.txtNameUser}>
          {checkNameUser()}
          <Text style={{ ...fonts.regular13 }} children={` ${item.content}`} />
        </Text>
      </View>
    </View>
  )
}
