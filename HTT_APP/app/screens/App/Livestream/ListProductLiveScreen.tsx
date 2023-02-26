import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import FstImage from '@app/components/FstImage/FstImage'
import Loading from '@app/components/Loading'
import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  requestDeleteProduct,
  requestUpdateProductLive,
} from '@app/service/Network/livestream/LiveStreamApi'
import { requestGetCategory } from '@app/service/Network/product/ProductApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts } from '@app/theme'
import { showMessages } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-elements'
import { isIphoneX } from 'react-native-iphone-x-helper'
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view'
import reactotron from 'ReactotronConfig'
import { useImmer } from 'use-immer'
import { DataUserInfoProps } from '../Account/Model'
import {
  addProductListDelete,
  requestListProductThunk,
  updateChecked,
  updateCheckedAll,
  updateCheckedAllWithLivestreamID,
} from '../Product/slice/ListProductSlice'
import ProductItem from './component/ProductItem'
import SearchList from './component/Search'
import { styles } from './styles'

const {
  notification,
  please_choose_product,
  sellect_all,
  add_product,
  choose_product,
} = R.strings()
const { img_check, img_unchecked } = R.images

const ListProductLiveScreen = (props: any) => {
  const livestream_id = props.route.params?.livestream_id

  const [isLoading, setIsLoading] = useState(true)
  const appDispatch = useAppDispatch()
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const dataHome = useAppSelector(state => state.HomeReducer.data)
  // const listCategory = dataHome?.listCategory
  const [listCategory, setListCategory] = useState<any>()
  const [itemChildCate, setItemChildCate] = useState({ id: 0, name: 'Tất cả' })
  const dataProduct = useAppSelector(state => state.ListProductReducer)
  const [checkAll, setCheckAll] = useState<any>(dataProduct?.checkAll)
  const refTimeout = useRef<any>(null)
  const refCheck = useRef<any>(null)
  const refCanBack = useRef(false)
  const [payload, setPayload] = useImmer({
    page: undefined,
    limit: 1000,
    search: undefined,
    category_id: undefined,
    sold_sort_order: undefined,
    price_sort_order: undefined,
    created_at_sort_order: undefined,
    rating: undefined,
    has_stock: undefined,
  })

  const getListCategory = () => {
    // setIsLoading(true)
    try {
      callAPIHook({
        API: requestGetCategory,
        payload: null,
        useLoading: setIsLoading,
        onSuccess: res => {
          // setIsLoading(false)
          setListCategory(res.data)
          getData(res.data)
        },
        onError: err => {},
      })
    } catch (error) {}
  }

  const handleUpdateProductLive = () => {
    // setIsLoading(true)
    let products: object[] = []
    let products_id: number[] = []
    if (dataProduct?.arrTemp?.length && dataProduct?.listProductAdd.length) {
      dataProduct?.listProductAdd.map(item => {
        products.push({
          id: +item,
          code_product_livestream: '',
        })
      })
    }
    if (dataProduct?.arrTemp?.length && dataProduct?.listProductDelete.length) {
      products_id = dataProduct?.listProductDelete
    }
    if (!dataProduct?.arrTemp?.length) {
      dataProduct?.listProductSelect.map((item: any) =>
        products.push({
          id: +item.id,
          code_product_livestream: '',
        })
      )
    }
    if (dataProduct?.checkAll) {
      dataProduct?.listProductSelect.map((item: any) =>
        products.push({
          id: +item.id,
          code_product_livestream: '',
        })
      )
    }
    const payloadAdd = {
      livestream_id,
      body: { products },
    }
    const payloadDelete = {
      livestream_id,
      body: {
        products_id,
      },
    }
    if (products?.length) handleAddProduct(payloadAdd)
    if (products_id?.length) handleDeleteProduct(payloadDelete)
    if (refCanBack) {
      setTimeout(() => {
        NavigationUtil.goBack()
      }, 200)
    }
  }

  const handleAddProduct = (payloadAdd: any) => {
    callAPIHook({
      API: requestUpdateProductLive,
      payload: payloadAdd,
      useLoading: setIsLoading,
      onSuccess: res => {
        refCanBack.current = true
      },
      onError: err => {},
    })
  }

  const handleDeleteProduct = (payloadDelete: any) => {
    callAPIHook({
      API: requestDeleteProduct,
      payload: payloadDelete,
      useLoading: setIsLoading,
      onSuccess: res => {
        refCanBack.current = true
      },
      onError: err => {},
    })
  }

  const getData = (data?: any) => {
    if (data) {
      appDispatch(
        requestListProductThunk({
          ...payload,
          category_id: data[0]?.id,
        })
      )
    }
  }

  useEffect(() => {
    if (!refCheck.current) {
      if (refTimeout.current) clearTimeout(refTimeout.current)
      refTimeout.current = setTimeout(() => {
        payload.search != null
          ? appDispatch(
              requestListProductThunk({
                ...payload,
                search: payload.search,
              })
            )
          : null
      }, 300)
    } else refCheck.current = false
  }, [payload.search])

  useEffect(() => {
    if (payload?.category_id != undefined) {
      appDispatch(
        requestListProductThunk({
          ...payload,
          category_id: payload?.category_id,
        })
      )
    }
  }, [payload?.category_id])
  useEffect(() => {
    getListCategory()
  }, [])

  const RenderFooter = () => {
    let checkMarginBottom = isIphoneX() ? '3%' : 0
    return (
      <View
        style={[
          styles.vFooterListProduct,
          {
            marginBottom: checkMarginBottom,
          },
        ]}
      >
        <Button
          onPress={() => {
            if (livestream_id) {
              appDispatch(
                updateCheckedAllWithLivestreamID({
                  checkAll: !dataProduct?.checkAll,
                })
              )
              return
            }
            appDispatch(
              updateCheckedAll({
                checkAll: !dataProduct?.checkAll,
              })
            )
            // setCheckAll(!checkAll)
          }}
          children={
            <View style={styles.vCheckAll}>
              <FstImage
                source={dataProduct?.checkAll ? img_check : img_unchecked}
                style={styles.imgCheckAll}
              />
              <Text style={styles.txtCheckAll} children={sellect_all} />
            </View>
          }
        />
        <Button
          onPress={() => {
            if (!dataProduct?.listProductSelect?.length) {
              showMessages(notification, please_choose_product)
              return
            }
            if (livestream_id) {
              appDispatch(
                requestListProductThunk({
                  page: 1,
                  limit: 1000,
                })
              )
              handleUpdateProductLive()
              return
            }
            appDispatch(
              requestListProductThunk({
                page: 1,
                limit: 1000,
              })
            )
            setTimeout(() => {
              NavigationUtil.goBack()
            }, 300)
          }}
          style={styles.btnAddProductList}
          children={
            <Text style={styles.txtAddProduct} children={add_product} />
          }
        />
      </View>
    )
  }

  const renderListProduct = () => {
    return (
      <ScrollableTabView
        locked={true}
        onChangeTab={({ i }) => {
          setPayload(draft => {
            draft.category_id = listCategory[i].id
          })
        }}
        renderTabBar={() => (
          <ScrollableTabBar
            underlineStyle={styles.vUnderLineTab}
            style={styles.vBgTab}
            activeTextColor={colors.primary}
            textStyle={styles.txtTab}
          />
        )}
      >
        {listCategory?.map((item: any) => (
          <View style={{ flex: 1 }} tabLabel={item?.name || ''}>
            <ListProduct
              onRefresh={getData}
              dataProduct={dataProduct}
              haveLiveStreamId={livestream_id}
            />
            <RenderFooter />
          </View>
        ))}
      </ScrollableTabView>
    )
  }
  const renderBody = () => {
    if (isLoading) return <Loading />
    return (
      <View style={{ flex: 1 }}>
        <SearchList
          onChangeText={search => {
            setPayload(draft => {
              draft.search = search
            })
          }}
        />
        {renderListProduct()}
      </View>
    )
  }
  return (
    <ScreenWrapper
      titleHeader={choose_product}
      back
      backgroundColor={colors.white}
      unsafe
      onBack={() => {
        appDispatch(
          requestListProductThunk({
            ...payload,
          })
        )
        setTimeout(() => {
          NavigationUtil.goBack()
        }, 150)
      }}
    >
      {renderBody()}
      {isLoading && <LoadingProgress />}
    </ScreenWrapper>
  )
}

export default ListProductLiveScreen

const ListProduct = ({
  dataProduct,
  onRefresh,
  haveLiveStreamId,
}: {
  dataProduct: any
  onRefresh: () => void
  haveLiveStreamId: boolean
}) => {
  const appDispatch = useAppDispatch()
  if (dataProduct.isLoading) return <Loading />
  if (dataProduct.error) return <Error reload={onRefresh} />
  if (!dataProduct.data?.length) return <Empty onRefresh={onRefresh} />
  return (
    <FlatList
      keyboardShouldPersistTaps={'handled'}
      refreshing={false}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      data={dataProduct.data}
      keyExtractor={(_, idx) => `${idx}`}
      renderItem={({ item, index }) => (
        <ProductItem
          item={item}
          onPressCheck={() => {
            if (haveLiveStreamId) {
              appDispatch(addProductListDelete({ item }))
            }
            appDispatch(updateChecked({ id: item.id }))
          }}
        />
      )}
    />
  )
}

const ListChildrenCategory = ({
  data,
  onPressChildCate,
  idChildCate,
}: {
  idChildCate: number
  data: []
  onPressChildCate: (item: object) => void
}) => {
  const checkFont = (item: any) => {
    return idChildCate == item.id ? R.fonts.sf_bold : R.fonts.sf_regular
  }
  const checkColor = (item: any) => {
    return idChildCate == item.id ? colors.primary : '#444444'
  }
  return (
    <View style={styles.vChillCate}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={styles.vFlatListChillCate}
        contentContainerStyle={{}}
        horizontal={true}
        data={data}
        renderItem={({ item, index }: { item: any; index: number }) => {
          return (
            <TouchableOpacity
              style={{ paddingVertical: 12, marginRight: 20 }}
              onPress={() => onPressChildCate(item)}
              children={
                <Text
                  style={{
                    fontFamily: checkFont(item),
                    fontSize: 16,
                    color: checkColor(item),
                  }}
                  children={item.name}
                />
              }
            />
          )
        }}
      />
    </View>
  )
}
