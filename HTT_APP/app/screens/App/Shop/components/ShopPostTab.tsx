import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { dimensions } from '@app/theme'
import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PostItem from '../../Home/component/PostItem'

const { height } = dimensions

const ShopPostTab = (props: any) => {
  const { data, isLoading, onRefresh } = props

  const itemSeparatorComponent = useCallback(
    () => <View style={{ height: 8 }} />,
    []
  )

  if (isLoading) return <Loading />

  return (
    <FlatList
      data={data.rows}
      refreshing={isLoading}
      onRefresh={onRefresh}
      contentContainerStyle={{ paddingBottom: isIphoneX() ? 20 : 0 }}
      keyExtractor={(_, index) => `${index}`}
      renderItem={({ item, index }) => (
        <PostItem
          data={item}
          isShowMoreContent
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
              id: item.id,
            })
          }
          onShowMoreContentPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
              id: item.id,
            })
          }
          hasToken={true}
          // onDeletePress={() => handleDeletePost(item.id)}
          onCommentPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
              id: item.id,
            })
          }
        />
      )}
      ItemSeparatorComponent={itemSeparatorComponent}
      ListEmptyComponent={
        <Empty
          imageStyle={{ height: height / 4 }}
          backgroundColor={'transparent'}
        />
      }
    />
  )
}

export default ShopPostTab
