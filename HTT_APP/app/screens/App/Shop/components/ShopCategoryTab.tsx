import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import React from 'react'
import { View, Text, FlatList, ListRenderItem } from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import reactotron from 'ReactotronConfig'

const { height } = dimensions

const ShopCategoryTab = (props: any) => {
  const { data, isLoading, onRefresh } = props
  const renderCategoryItem: ListRenderItem<any> = ({ item }) => {
    return (
      <Button
        onPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER_APP.SHOP_CATEGORY_PRODUCT, {
            category_id: item.id,
            category_name: item.name,
          })
        }
        children={
          <View
            style={{
              ...styleView.rowItem,
              paddingHorizontal: 15,
              paddingVertical: 10,
              backgroundColor: colors.white,
            }}
          >
            <FastImage
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 16,
              }}
              // source={R.images.img_user_live}
              source={{ uri: item.icon_url }}
            />
            <View
              style={{
                ...styleView.rowItemBetween,
                flex: 1,
                alignItems: 'center',
              }}
            >
              <View style={{ height: 50, justifyContent: 'space-between' }}>
                <Text style={{ ...fonts.regular16 }} children={item.name} />
                <Text style={{ ...fonts.regular14, color: '#8C8C8C' }}>
                  <Text
                    style={{ color: colors.primary }}
                    children={item.quantity_items}
                  />{' '}
                  sản phẩm
                </Text>
              </View>
              <FastImage
                style={{ width: 20, height: 20 }}
                source={R.images.ic_arrow_right}
              />
            </View>
          </View>
        }
      />
    )
  }

  if (isLoading) return <Loading />

  return (
    <FlatList
      data={data.category}
      refreshing={isLoading}
      onRefresh={onRefresh}
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: isIphoneX() ? 20 : 0,
      }}
      keyExtractor={(_, index) => `${index}`}
      renderItem={renderCategoryItem}
      ListEmptyComponent={
        <Empty
          imageStyle={{ height: height / 4 }}
          backgroundColor={'transparent'}
        />
      }
    />
  )
}

export default ShopCategoryTab
