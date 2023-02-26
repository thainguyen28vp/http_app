import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestGetListShopFollow } from '@app/service/Network/shop/ShopApi'
import { colors, styleView, WIDTH } from '@app/theme'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import ShopItem from '../Shop/components/ShopItem'
import ShopSearchBar from '../Shop/components/ShopSearchBar'

const ShopFollowScreen = () => {
  const [data, setData] = useState([])
  const [refreshing, setIsRefreshing] = useState(false)
  const [textSearch, setTextSearch] = useState<string>('')

  const getListShopFollow = async () => {
    setIsRefreshing(true)
    const payload: any = {
      search: textSearch,
    }
    try {
      const res = await requestGetListShopFollow(payload)
      if (res.status) {
        setIsRefreshing(false)
        setData(res.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getListShopFollow()
    }, 200)
    return () => clearTimeout(timer)
  }, [textSearch])

  const renderListShop = () => {
    if (refreshing) return <Loading />
    return (
      <FlatList
        style={{ zIndex: -1 }}
        contentContainerStyle={[styleView.paddingBottomMain, { paddingTop: 2 }]}
        showsVerticalScrollIndicator={false}
        data={data}
        refreshing={refreshing}
        onRefresh={getListShopFollow}
        //   onMomentumScrollBegin={onMomentumScrollBegin}
        //   onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => (
          <ShopItem
            data={item}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.SHOP_DETAIL, {
                shop_id: item.id,
                shopData: item,
                status_follow: item.status_follow,
                getListShop: () => getListShopFollow(),
              })
            }
          />
        )}
        keyExtractor={(_, index) => `${index}`}
        ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
      />
    )
  }
  const renderSearchBar = () => {
    return (
      <View style={styles.searchView}>
        <View style={styles.searchContainer}>
          <ShopSearchBar
            outline={false}
            containerStyle={{ paddingHorizontal: 0, paddingRight: 10 }}
            placeholder={'Tìm kiếm gian hàng'}
            onSearch={text => {
              setTextSearch(text)
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <ScreenWrapper titleHeader={'Danh sách gian hàng'} back>
      {/* {dialogLoading && <LoadingProgress />} */}
      {renderSearchBar()}
      {renderListShop()}
    </ScreenWrapper>
  )
}

export default ShopFollowScreen

const styles = StyleSheet.create({
  searchView: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: colors.white,
  },
  searchContainer: {
    ...styleView.rowItem,
    height: 40,
    borderWidth: 1,
    borderColor: '#D0DBEA',
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    minWidth: 60,
    marginLeft: 10,
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 0,
    borderRadius: 0,
  },
  verticalLine: {
    width: 1,
    height: 16,
    backgroundColor: '#8C8C8C',
  },
  dropdown: {
    width: WIDTH - 30,
    flex: 1,
    left: 15,
    maxHeight: 250,
  },
})
