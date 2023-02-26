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
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { ScrollableTab, Tab, Tabs } from 'native-base'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { handleSearch, updateFilter } from './slice/FilterSlice'
import { requestListProductThunk } from './slice/ListProductSlice'
import styles from './styles/stylesProduct'
import Modal from 'react-native-modal'
import ProductSelectTypeModal from './component/ProductSelectTypeVIew'
import reactotron from 'ReactotronConfig'
import RNHeader from '@app/components/RNHeader'
import { checkExistUser, handleCompareTime } from '@app/utils/FuncHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getRechargeCoin } from '@app/service/Network/home/HomeApi'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import moment from 'moment'
import DateUtil from '@app/utils/DateUtil'
import { requestConfigThunk } from '../Config/ConfigSlice'

const ProductScreen = (props: any) => {
  const appDispatch = useAppDispatch()
  const { item, page, listCategory, idCate } = props.route.params
  const dataConfig = useAppSelector(state => state.ConfigReducer.data)
  const [idCategory, setIdCategory] = useState<any>(idCate)
  const [childNameCate, setChildNameCate] = useState<String>('')
  const [search, setSearch] = useState(undefined)
  const [token, setToken] = useState<any>()
  const [loading, setLoading] = useState(false)
  const refTab = useRef()
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const { data, isLoading, error, totalPrice } = useAppSelector(
    state => state.CartReducer
  )
  const isBuyNow = useRef<boolean>(false)
  const [itemProduct, setItemProduct] = useState<any>()
  const ListProductReducer = useAppSelector(state => state.ListProductReducer)
  const FilterReducer = useAppSelector(state => state.FilterReducer)
  const dataFilter: any = FilterReducer.data
  let timeStampNow = Math.floor(new Date().getTime() / 1000.0)
  const [timerOrder, setTimerOrder] = useState<any>(timeStampNow)
  const getListProduct: any = () => {
    const payload = {
      page: undefined,
      limit: 500,
      search: search,
      category_id: idCategory?.id,
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
      rating: dataFilter.star,
      has_stock: undefined,
    }
    appDispatch(requestListProductThunk(payload))
  }

  const getConfig = () => {
    appDispatch(requestConfigThunk())
  }

  React.useEffect(() => {
    getListProduct()
    checkToken()
    return () => {
      appDispatch(
        updateFilter({
          sell: undefined,
          time: undefined,
          price: undefined,
          star: undefined,
        })
      )
    }
  }, [idCategory?.id])
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (search != undefined) {
      const timer = setTimeout(() => {
        getListProduct()
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [search])

  const checkToken = async () => {
    const tokenCurrent = await AsyncStorageService.getToken()
    if (tokenCurrent) {
      setToken(tokenCurrent)
      return
    }
  }

  const modalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeModal
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
  const renderListProduct = (index: number) => {
    if (ListProductReducer.isLoading) return <Loading />
    if (ListProductReducer.error) return <Error reload={getListProduct} />
    if (!ListProductReducer.data?.length) return <Empty />
    return (
      <>
        <FlatList
          key={index}
          numColumns={2}
          refreshing={false}
          onRefresh={() => {
            getListProduct()
            getConfig()
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: '20%',
            paddingHorizontal: 15,
            paddingTop: 18,
          }}
          style={{ flex: 1, backgroundColor: '#F3F3F3' }}
          data={ListProductReducer?.data}
          keyExtractor={(item: any, index) => `${item.id}`}
          renderItem={({ item, index }) => (
            <ProductItem
              token={!!token}
              inTimeBuy={!!handleCompareTime(dataConfig)}
              item={item}
              index={index}
              onPressProductItem={item => {
                checkExistUser(async () => {
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
        {modalSelectType()}
      </>
    )
  }

  const renderBodyTab = () => {
    let listCate = [{ name: 'Tất cả', id: 0 }].concat(listCategory)
    return (
      <Tabs
        initialPage={page}
        onChangeTab={({ i }: { i: number }) => {
          setIdCategory(listCategory[i])
        }}
        renderTabBar={() => (
          <ScrollableTab underlineStyle={{ backgroundColor: 'transparent' }} />
        )}
      >
        {listCategory?.map((item: any, index: number) => {
          return (
            <Tab
              heading={item.name}
              activeTextStyle={{
                color: colors.primary,
              }}
              activeTabStyle={{ backgroundColor: 'white' }}
              tabStyle={{ backgroundColor: 'white' }}
            >
              {renderListProduct(index)}
            </Tab>
          )
        })}
      </Tabs>
    )
  }
  const leftComponent = () => {
    return (
      <View style={styles.vLeftComponent}>
        <TouchableOpacity
          onPress={() => NavigationUtil.goBack()}
          children={
            <FstImage source={R.images.ic_back} style={styles.vImgBack} />
          }
        />
        <Search
          value={search}
          containerStyle={styles.vSearch}
          placeholder={'Tìm kiếm sản phẩm'}
          onChangeText={(value: any) => {
            setSearch(value)
          }}
        />
      </View>
    )
  }
  const rightComponent = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            checkExistUser(async () => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
            })
          }}
          style={{ marginRight: 15 }}
        >
          <FstImage source={R.images.ic_cart} style={styles.vImgFilter} />
          {data?.length ? (
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
                children={data?.length}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.FILTER_SEARCH, {
              childNameCate: idCategory.name,
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
    <ScreenWrapper
      unsafe
      leftComponent={leftComponent()}
      rightComponent={rightComponent()}
      children={renderBodyTab()}
      backgroundColor={'#F3F3F3'}
    />
  )
}

export default ProductScreen
