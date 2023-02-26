import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import FstImage from '@app/components/FstImage/FstImage'
import Loading from '@app/components/Loading'
import ProductItem from '@app/components/ProductItem'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import Search from '@app/components/Search'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts } from '@app/theme'
import { checkExistUser, handleCompareTime } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import Modal from 'react-native-modal'
import reactotron from 'ReactotronConfig'
import { reach } from 'yup'
import ProductSelectTypeView from './component/ProductSelectTypeVIew'
import { requestListProductThunk } from './slice/ListProductSlice'
import styles from './styles/stylesProduct'

const ListProduct = (props: any) => {
  const { categoryId, index, listCategory } = props
  const token = props.route.params.token
  const dataConfig = props.route.params?.dataConfig
  const appDispatch = useAppDispatch()
  const ListProductReducer = useAppSelector(state => state.ListProductReducer)
  const FilterReducer = useAppSelector(state => state.FilterReducer)
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const [itemProduct, setItemProduct] = React.useState<any>()
  const isBuyNow = useRef<boolean>(false)
  const dataFilter: any = FilterReducer.data
  const { isLoading, error, data } = ListProductReducer
  const refSearch = useRef<any>(null)
  const refTimeout = useRef<any>(null)
  const ListCategory = listCategory || {}
  const [search, setSearch] = useState(undefined)
  const getListProduct = () => {
    const payload = {
      page: undefined,
      limit: 500,
      search: search,
      category_id: undefined,
      sold_sort_order: dataFilter.sell
        ? dataFilter.sell == 1
          ? 'DESC'
          : 'ASC'
        : undefined,
      price_sort_order: dataFilter.price
        ? dataFilter.price == 1
          ? 'DESC'
          : 'ASC'
        : undefined,
      created_at_sort_order: dataFilter.time
        ? dataFilter.time == 1
          ? 'DESC'
          : 'ASC'
        : undefined,
      rating: dataFilter?.star ? dataFilter?.star : undefined,
      has_stock: undefined,
    }
    appDispatch(requestListProductThunk(payload))
  }
  const dataCart = useAppSelector(state => state.CartReducer.data)
  useEffect(() => {
    let timeout: any
    if (search != undefined) {
      timeout = setTimeout(() => {
        getListProduct()
      }, 300)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  useEffect(() => {
    if (
      dataFilter.sell != undefined ||
      dataFilter.price != undefined ||
      dataFilter.time != undefined ||
      dataFilter.star != undefined
    ) {
      getListProduct()
      return
    }
  }, [dataFilter])
  useEffect(() => {
    getListProduct()
  }, [])

  const modalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeView
          productDetail={itemProduct}
          onClosePress={() => {
            isBuyNow.current = false
            setModalTypeVisible(false)
          }}
          product_id={itemProduct?.id}
          isBuyNow={isBuyNow.current}
          inTimeBuy={!!handleCompareTime(dataConfig)}
        />
      </Modal>
    )
  }

  const renderBody = () => {
    if (isLoading) return <Loading />
    if (error) return <Error reload={getListProduct} />
    if (!data?.length) return <Empty />
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          key={index}
          numColumns={2}
          keyboardShouldPersistTaps={'handled'}
          refreshing={false}
          onRefresh={getListProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: '20%',
            paddingHorizontal: 15,
            paddingTop: 18,
          }}
          style={{ flex: 1 }}
          data={data}
          keyExtractor={(item: any, index) => `${item.id}`}
          renderItem={({ item, index }) => (
            <ProductItem
              item={item}
              index={index}
              token={token}
              inTimeBuy={!!handleCompareTime(dataConfig)}
              onPressProductItem={item => {
                checkExistUser(() => {
                  if (item.stock <= 0) {
                    if (!!handleCompareTime(dataConfig)) {
                      setModalTypeVisible(true)
                      setItemProduct(item)
                      return
                    }
                    showMessages('', 'Sản phẩm hiện đã hết hàng!')
                    return
                  }
                  setModalTypeVisible(true)
                  setItemProduct(item)
                })
              }}
            />
          )}
        />
      </View>
    )
  }

  const rightComponent = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            checkExistUser(() => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
            })
          }}
          style={{ marginRight: 15 }}
        >
          <FstImage source={R.images.ic_cart} style={styles.vImgFilter} />
          {dataCart?.length ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: colors.primary,
                width: 18,
                height: 18,
                borderRadius: 18 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                top: -5,
                right: -5,
              }}
            >
              <Text
                style={{ color: 'white', ...fonts.medium10 }}
                children={dataCart?.length}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.FILTER_SEARCH, {
              childNameCate: 'Tất cả',
            })
          }}
          style={{}}
        >
          <FstImage
            source={R.images.icon_filter_product}
            style={[styles.vImgFilter]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenWrapper
        unsafe
        back
        titleHeader="Danh sách sản phẩm"
        rightComponent={rightComponent()}
        backgroundColor={'#F3F3F3'}
        children={
          <>
            <View style={{ backgroundColor: 'white', paddingBottom: 8 }}>
              <Search
                value={search}
                containerStyle={[styles.vSearch, { width: '95%' }]}
                placeholder={'Tìm kiếm sản phẩm'}
                onChangeText={(value: any) => {
                  setSearch(value)
                }}
              />
            </View>
            {renderBody()}
          </>
        }
      />

      {modalSelectType()}
    </View>
  )
}

export default ListProduct
