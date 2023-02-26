import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, TextInput, StyleSheet, FlatList } from 'react-native'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import Dropdown, { Selected } from 'react-native-dropdown-enhanced'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import ShopItem from './components/ShopItem'
import { getListCategory, getListShop } from '@app/service/Network/shop/ShopApi'
import { Shop } from './model/Shop'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { debounce } from 'lodash'
import LoadingProgress from '@app/components/LoadingProgress'
import ShopSearchBar from './components/ShopSearchBar'
import Empty from '@app/components/Empty/Empty'

const { width } = dimensions

const ShopScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [listCategory, setListCategory] = useState<Array<Selected>>([])
  const [listShop, setListShop] = useState<Array<Shop>>([])
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [bodyCategory, setBodyCategory] = useState({
    page: DEFAULT_PARAMS.PAGE,
  })
  const [bodyShop, setBodyShop] = useState({
    page: DEFAULT_PARAMS.PAGE,
  })
  const [textSearch, setTextSearch] = useState<string>('')

  const firstLoad = useRef<boolean>(true)
  const paging = useRef<any>()

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      listShop.length < paging.current?.totalItemCount! &&
      !isLoadMore
    ) {
      setBodyShop({ page: bodyShop.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const getCategory = () => {
    callAPIHook({
      API: getListCategory,
      onSuccess: res => {
        const categoryData = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
        setListCategory([
          { label: 'Tất cả', value: undefined },
          ...categoryData,
        ])
      },
    })
  }

  const getData = (requireLoading?: boolean) => {
    const loadingType = requireLoading
      ? setIsLoading
      : bodyShop.page == DEFAULT_PARAMS.PAGE
      ? setDialogLoading
      : setIsLoadMore

    callAPIHook({
      API: getListShop,
      useLoading: loadingType,
      payload: {
        search: textSearch,
        category_id: categoryId,
        page: bodyShop.page,
      },
      onSuccess: res => {
        paging.current = res.paging
        let listClone: any

        if (bodyShop.page != DEFAULT_PARAMS.PAGE) {
          listClone = [...listShop, ...res.data]
        } else {
          listClone = [...res.data]
        }

        setListShop(listClone)
      },
    })
  }

  useEffect(() => {
    getData(firstLoad.current)
  }, [])

  useEffect(() => {
    !firstLoad.current && getData(firstLoad.current)
    firstLoad.current = false
  }, [bodyShop, categoryId, textSearch])

  useLayoutEffect(() => {
    getCategory()
  }, [bodyCategory])

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
          <View style={styles.verticalLine} />
          <Dropdown
            data={
              !!listCategory.length
                ? listCategory
                : [{ label: 'Tất cả', value: undefined }]
            }
            defaultLabel={'Danh mục'}
            activeTextColor={colors.primary}
            tickIconStyle={{ tintColor: colors.primary }}
            style={styles.dropdownContainer}
            dropdownStyle={styles.dropdown}
            labelStyle={{ ...fonts.regular14, color: '#69747E' }}
            itemTextStyle={{ ...fonts.regular16 }}
            showTickIcon
            onSelectedChange={({ value }) => setCategoryId(value)}
            onEndReachedThreshold={0.1}
            // onMomentumScrollBegin={onMomentumScrollBeginCategory}
            onEndReached={({ distanceFromEnd }) => {
              console.log(distanceFromEnd)
            }}
          />
        </View>
      </View>
    )
  }

  const renderListShop = () => {
    return (
      <View style={{ flex: 1 }}>
        {dialogLoading && <LoadingProgress />}
        <FlatList
          style={{ zIndex: -1 }}
          contentContainerStyle={[
            styleView.paddingBottomMain,
            { paddingTop: 2 },
          ]}
          showsVerticalScrollIndicator={false}
          data={listShop}
          refreshing={refreshing}
          onRefresh={getData}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => (
            <ShopItem
              data={item}
              onPress={() =>
                NavigationUtil.navigate(SCREEN_ROUTER_APP.SHOP_DETAIL, {
                  shop_id: item.id,
                  shopData: item,
                  status_follow: item.status_follow,
                  getListShop: () => getData(true),
                })
              }
            />
          )}
          keyExtractor={(_, index) => `${index}`}
          ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
        />
      </View>
    )
  }

  return (
    <ScreenWrapper isLoading={isLoading} titleHeader={'Điện hoa'}>
      {/* {renderSearchBar()} */}
      {renderListShop()}
    </ScreenWrapper>
  )
}

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
    width: width - 30,
    flex: 1,
    left: 15,
    maxHeight: 250,
  },
})

export default ShopScreen
