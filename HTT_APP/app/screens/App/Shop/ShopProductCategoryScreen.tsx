import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import ProductItem from '@app/components/ProductItem'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { getListProduct } from '@app/service/Network/product/ProductApi'
import { useAppSelector } from '@app/store'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useEffect, useRef, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import FilterBar, { FilterSelect } from './components/FilterBar'
import ShopHeader from './components/ShopHeader'

const ShopProductCategoryScreen = (props: any) => {
  const categoryName = props.route.params?.category_name
  const { category_id } = props.route.params

  const [listProduct, setListProduct] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [textSearch, setTextSearch] = useState<string>('')
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [filterSelect, setFilterSelect] = useState<FilterSelect>({
    time: undefined,
    topSell: undefined,
    priceOrder: undefined,
  })
  const paging = useRef<any>()

  const { data } = useAppSelector(state => state.ShopReducer)

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      listProduct.length <= paging.current?.totalItemCount! &&
      !isLoadMore
    ) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const getData = () => {
    callAPIHook({
      API: getListProduct,
      payload: {
        category_id,
        shop_id: data[1]?.tabData?.shopDetail?.id,
        search: textSearch,
        children_category_id: 0,
        page: body.page,
        time_type: filterSelect.time,
        buy_type: filterSelect.topSell,
        price_type: filterSelect.priceOrder,
      },
      useLoading:
        body.page == DEFAULT_PARAMS.PAGE ? setIsLoading : setIsLoadMore,
      onSuccess: res => {
        paging.current = res.paging
        let listClone: any
        if (body.page != DEFAULT_PARAMS.PAGE) {
          listClone = [...listProduct, ...res.data]
        } else {
          listClone = [...res.data]
        }

        if (!!res.data?.livestreamStart)
          listClone = [res.data?.livestreamStart, ...listClone]

        setListProduct(listClone)
      },
    })
  }

  useEffect(() => {
    getData()
  }, [body, filterSelect, textSearch])

  const renderListProduct = () => {
    if (isLoading) return <Loading />

    return (
      <FlatList
        data={listProduct}
        refreshing={isLoading}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onRefresh={() => setBody({ page: DEFAULT_PARAMS.PAGE })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: '3%' }}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item, index }) => (
          <ProductItem item={item} index={index} />
        )}
        ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
        ListFooterComponent={
          isLoadMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    )
  }

  return (
    <ScreenWrapper
      header={
        <ShopHeader
          placeholder={`Tìm kiếm sản phẩm ${categoryName.toLowerCase()}`}
          onSearch={text => {
            setTextSearch(text)
          }}
        />
      }
      unsafe
    >
      <View style={{ marginTop: 1 }}>
        <FilterBar onFilterSelect={filter => setFilterSelect(filter!)} />
      </View>
      {renderListProduct()}
    </ScreenWrapper>
  )
}

export default ShopProductCategoryScreen
