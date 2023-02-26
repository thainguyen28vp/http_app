import Empty from '@app/components/Empty/Empty'
import ProductItem from '@app/components/ProductItem'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { getListFavoriteProduct } from '@app/service/Network/account/AccountApi'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'

type Paging = {
  page: number
  limit: number
  totalItemCount: number
}

const FavoriteProductScreen = () => {
  const [listFavoriteProduct, setListFavoriteProduct] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })

  const paging = useRef<Paging>()

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      listFavoriteProduct.length < paging.current?.totalItemCount! &&
      !isLoadMore
    ) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const getData = () => {
    callAPIHook({
      API: getListFavoriteProduct,
      payload:
        body.page == DEFAULT_PARAMS.PAGE ? { page: DEFAULT_PARAMS.PAGE } : body,
      useLoading:
        body.page == DEFAULT_PARAMS.PAGE ? setIsLoading : setIsLoadMore,
      onSuccess: res => {
        paging.current = res.paging
        setListFavoriteProduct(
          body.page == DEFAULT_PARAMS.PAGE
            ? res.data
            : listFavoriteProduct!.concat(res.data)
        )
      },
    })
  }

  useEffect(() => {
    getData()
  }, [body])

  return (
    <ScreenWrapper
      back
      unsafe
      isLoading={isLoading}
      titleHeader={'Sản phẩm quan tâm'}
    >
      <FlatList
        data={listFavoriteProduct}
        refreshing={isLoading}
        onRefresh={() => setBody({ page: DEFAULT_PARAMS.PAGE })}
        contentContainerStyle={{ paddingBottom: 15 }}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductItem item={item} index={index} showLikeIcon={false} />
        )}
        keyExtractor={(_, index) => `${index}`}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
    </ScreenWrapper>
  )
}

export default FavoriteProductScreen
