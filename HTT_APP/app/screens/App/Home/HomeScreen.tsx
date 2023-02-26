import R from '@app/assets/R'
import BannerHome from '@app/components/BannerHome'
import Error from '@app/components/Error/Error'
import FstImage from '@app/components/FstImage/FstImage'
import Loading from '@app/components/Loading'
import LoadingProgress from '@app/components/LoadingProgress'
import Search from '@app/components/Search'
import { CATEGOTY, HOME } from '@app/config/Mockup'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import {
  checkExistConversation,
  requestSendNewTopic,
} from '@app/service/Network/chat/ChatApi'
import {
  getRechargeCoin,
  requestDeletePost,
} from '@app/service/Network/home/HomeApi'
import { requestJoinLive } from '@app/service/Network/livestream/LiveStreamApi'
import { requestGetCategory } from '@app/service/Network/product/ProductApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { checkExistUser } from '@app/utils/FuncHelper'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import OneSignalUtil from '@app/utils/OneSignalUtils'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import lodash from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Header } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
// import { ScrollView } from 'react-native-gesture-handler'
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated'
import reactotron from 'ReactotronConfig'
import { DataUserInfoProps } from '../Account/Model'
import { useInConversation } from '../Chat/ChatContext'
import { requestConfigThunk } from '../Config/ConfigSlice'
import { updateVideoState } from '../Livestream/slice/LiveSlice'
import { handleSearch, updateFilter } from '../Product/slice/FilterSlice'
import { updateListProductSelect } from '../Product/slice/ListProductSlice'
import { requestListCartThunk } from '../Shop/slice/CartSlice'
import CartButton from './component/CartButton'
import ChatButton from './component/ChatButton'
import LoadingDataCodePush from './component/LoadingDataCodePush'
import PostItem from './component/PostItem'
import IntroHome from './IntroHome'
import { deletePost, requestGetHomeThunk } from './slice/HomeSlice'
import { requestGetListProvince } from './slice/ProvinceSlice'
import styles from './styles/stylesHome'

const scale = WIDTH / 375

const HomeScreen = (props: any) => {
  const [isFetchingData, setIsFetchingData] = React.useState(false)
  const HomeReducer = useAppSelector(state => state.HomeReducer)
  // const { data } = useAppSelector(state => state.HomeReducer)
  let data = HOME
  let category = CATEGOTY
  const AccountData = useAppSelector(state => state.accountReducer)
  const Dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const refToken = useRef<null | string>(null)
  const transitionRef = useRef<TransitioningView>(null)
  const [token, setToken] = useState<null | string>(null)
  const infoStreaming = useAppSelector<any>(
    state => state.StreamingReducer.data
  )
  const [listCategory, setListCategory] = useState<any>([])

  const isInConversation = useInConversation()

  const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0))
  const [dataConfig, setDataConfig] = useState<any>()

  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollYValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      new Animated.Value(0)
    ),
    0,
    50
  )

  const searchBarTranslate = clampedScroll.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -250],
    extrapolate: 'clamp',
  })

  const searchBarOpacity = clampedScroll.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" />
      <Transition.Out type="fade" />
      <Transition.Change interpolation="easeInOut" />
    </Transition.Together>
  )
  const getListCategory = () => {
    try {
      callAPIHook({
        API: requestGetCategory,
        payload: null,
        useLoading: setIsLoading,
        onSuccess: res => {
          setListCategory(res.data)
        },
        onError: err => {},
      })
    } catch (error) {}
  }
  const getData = () => {
    // token && userInfo?.Shop?.id ? Dispatch(getStreamLiveThunk()) : null
    Dispatch(requestGetHomeThunk())
    if (token) {
      getListCategory()
      getConfig()
      return
    }
  }

  const onChatPress = () => {
    callAPIHook({
      API: checkExistConversation,
      payload: { shop_id: AccountData?.data?.kiotviet_id },
      useLoading: setIsLoading,
      onSuccess: res => {
        if (!!res.data) {
          // setDialogLoading(false)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
            conversationId: res.data.id,
          })
        } else {
          const payload = new FormData()
          payload.append('shop_id', `${AccountData?.data?.kiotviet_id}`)
          payload.append('content', `Bắt đầu`)
          callAPIHook({
            API: requestSendNewTopic,
            payload,
            useLoading: setIsLoading,
            onSuccess: res => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CHAT_DETAIL, {
                conversationId: res.data.topic_message_id,
              })
            },
          })
        }
      },
      onError(err) {},
    })
  }

  const getConfig = () => {
    Dispatch(requestConfigThunk())
  }

  const checkToken = async () => {
    const tokenCurrent = await AsyncStorageService.getToken()
    if (tokenCurrent) {
      setToken(tokenCurrent)
      refToken.current = tokenCurrent
      // userInfo?.Shop?.id ? Dispatch(getStreamLiveThunk()) : null
      Dispatch(requestListCartThunk({}))
      getData()
      getConfig()
    }
  }

  const handleDeletePost = (id: number) => {
    showConfirm('', 'Bạn có chắc chắn muốn xoá bài viết', () => {
      callAPIHook({
        API: requestDeletePost,
        payload: { id },
        onSuccess: res => {
          transitionRef.current?.animateNextTransition()
          Dispatch(deletePost(id))
        },
      })
    })
  }

  const handleOnPostAction = (postId: number) => {
    checkExistUser(() => {
      NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
        id: postId,
        reloadList: () => getData(),
      })
    })
  }
  useEffect(() => {
    OneSignalUtil.onPushNotification()
    checkToken()
    Dispatch(requestGetListProvince())
    Dispatch(requestGetHomeThunk())
  }, [])

  useEffect(() => {
    OneSignalUtil.updateIsInConversation(true)
  }, [isInConversation])

  const goToListProduct = (item: any, index: any, listCate: any) => {
    Dispatch(
      updateFilter({
        sell: undefined,
        time: undefined,
        price: undefined,
      })
    )
    Dispatch(handleSearch({ search: undefined }))
    NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT, {
      index,
      item,
      page: index,
      listCategory: listCate,
      idCate: item,
      dataConfig,
    })
  }
  const handleJoinLive = (item: any) => {
    callAPIHook({
      API: requestJoinLive,
      payload: item.id,
      useLoading: setIsLoading,
      onSuccess: res => {
        // SocketHelper.socket?.emit(`subscribe_livestream_channel`, res.data.id)
        SocketHelperLivestream.socket?.emit(
          `subscribe_livestream_channel`,
          res.data.id
        )
        SocketHelperLivestream.socket.connect()

        Dispatch(updateListProductSelect({ data: res.data.LivestreamProducts }))
        Dispatch(updateVideoState({ state: 2 }))
        if (
          !lodash.isEmpty(infoStreaming) &&
          item.shop_id === userInfo?.Shop.id
        ) {
          Dispatch(
            updateListProductSelect({ data: infoStreaming?.LivestreamProducts })
          )
          NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_LIVE, {
            data: infoStreaming,
            shopId: infoStreaming?.shop_id,
            livestream_id: infoStreaming?.id,
            tokenUser: userInfo.token,
            LivestreamProducts: infoStreaming?.LivestreamProducts,
            shop: infoStreaming?.Shop,
            count_subcriber: infoStreaming?.count_subcriber,
            highlightProduct: infoStreaming?.HighlightProduct,
            joinLive: true,
          })
          return
        }
        NavigationUtil.navigate(SCREEN_ROUTER_APP.YOUTUBE_WATCHING, {
          data: res.data,
          appId: res.data.app_id,
          channelId: res.data.channel,
          token: res.data.token_subcriber,
          shopId: item.shop_id,
          livestream_id: item.id,
          tokenUser: userInfo.token,
          LivestreamProducts: res.data.LivestreamProducts,
          shop: res.data.Shop,
          count_subcriber: res.data.count_subcriber,
          highlightProduct: res.data.HighlightProduct,
        })
      },
      onError: err => {},
    })
  }

  const renderCategory = () => {
    let listCate = [{ name: 'Tất cả', id: 0 }]?.concat(
      listCategory?.length ? listCategory : HomeReducer?.data?.listCategory
    )
    const categoryItem = (item: any, index: number) => {
      return (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: 'row',
            backgroundColor: '#DCA948',
            marginRight: 16,
            borderRadius: 24,
          }}
          onPress={() => goToListProduct(item, index, listCate)}
        >
          <FstImage
            key={index}
            style={{
              width: 24,
              height: 24,
              marginVertical: 10,
              marginLeft: 18,
              marginRight: 5,
            }}
            source={R.images.img_flower}
          />
          <View
            style={{
              backgroundColor: 'white',
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              margin: 3,
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: 20,
              paddingLeft: 12,
            }}
          >
            <Text
              style={{ color: '#DCA948', ...fonts.semi_bold14 }}
            >{`${item?.name}`}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <ScrollView horizontal style={{}} showsHorizontalScrollIndicator={false}>
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 20,
              marginTop: 15,
            }}
          >
            {listCate?.map((item: any, index: number) => {
              if (index < listCate?.length / 2) return categoryItem(item, index)
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 20,
              marginTop: 15,
            }}
          >
            {listCate?.map((item: any, index: number) => {
              if (index >= listCate?.length / 2)
                return categoryItem(item, index)
            })}
          </View>
        </View>
        {/* <FlatList
          style={styles.listCategory}
          keyExtractor={(item, index) => index.toString()}
          numColumns={Math.ceil(listCategory?.length / 2)}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          // data={HomeReducer.data.listCategory}
          data={listCategory}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  // marginHorizontal: 15,
                  // alignItems: 'center',
                  // width: dimensions.width / 5,
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  marginTop: 15,
                  marginRight: 16,
                }}
                onPress={() => goToListProduct(item, index)}
              >
                <FstImage
                  key={index}
                  style={styles.imgCategory}
                  source={{ uri: item?.icon_url }}
                />
                <Text
                  numberOfLines={2}
                  style={[
                    styles.txt_item_category,
                    {
                      width: '100%',
                      textAlign: 'center',
                    },
                  ]}
                >
                  {`${item?.name}`}
                </Text>
              </TouchableOpacity>
            )
          }}
        /> */}
      </ScrollView>
    )
  }

  const renderLiveStream = (props: any) => {
    const { dataLiveStream } = props
    return (
      <FlatList
        style={styles.listCategory02}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={dataLiveStream}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                checkExistUser(() => handleJoinLive(item))
              }}
            >
              <FastImage
                style={styles.img_background}
                source={{ uri: item.cover_image_url }}
              >
                <View style={styles.view_number_live}>
                  <View style={styles.view_1_2_red}>
                    <FstImage
                      style={{ width: 4, height: 4 }}
                      source={R.images.icon_dot_white}
                    />
                    <Text style={styles.txtLive}>Live</Text>
                  </View>
                  <View style={styles.view_1_2_black}>
                    <FstImage
                      style={{ width: 14, height: 14 }}
                      source={R.images.icon_eye_live_home}
                    />
                    <Text style={styles.txtLive}>
                      {item.count_subscribe || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.txt_des_live}>{item.title}</Text>
                <View style={styles.view_shop}>
                  <FstImage
                    style={styles.img24}
                    source={
                      item?.profile_picture_url
                        ? { uri: item?.profile_picture_url }
                        : R.images.img_user
                    }
                  />
                  <Text style={styles.txtLive}>{item.Shop.name}</Text>
                </View>
              </FastImage>
            </TouchableOpacity>
          )
        }}
      />
    )
  }
  const renderHeaderHome = () => {
    return (
      <Header
        containerStyle={{
          backgroundColor: colors.white,
          justifyContent: 'center',
        }}
        leftComponent={
          <TouchableOpacity style={{ top: '20%' }}>
            <FastImage
              style={styles.imgLogo}
              source={R.images.image_logo}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        }
        rightComponent={
          <View style={styles.view_icon_header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                checkExistUser(() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
                )
              }}
            >
              <CartButton />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { marginLeft: 12 }]}
              onPress={() => checkExistUser(onChatPress)}
            >
              <ChatButton />
            </TouchableOpacity>
          </View>
        }
        statusBarProps={{
          barStyle: 'dark-content',
          translucent: true,
          backgroundColor: 'transparent',
        }}
      />
    )
  }

  const renderForum = () => {
    return (
      <View>
        <View style={styles.viewForum}>
          <View style={styles.view_item_forum}>
            <FastImage style={styles.img24} source={R.images.icon_forum_home} />
            <Text style={styles.txtTitle}>Cộng đồng</Text>
          </View>
        </View>
        <Transitioning.View ref={transitionRef} transition={transition}>
          <FlatList
            data={HomeReducer.data.posts}
            renderItem={({ item, index }) => (
              <PostItem
                data={item}
                isShowMoreContent
                onPressNameShop={() => {
                  checkExistUser(() => {
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.SHOP_DETAIL, {
                      shopData: item,
                      shop_id: item.shop_id,
                    })
                  })
                }}
                onReplyPress={() => handleOnPostAction(item.id)}
                onShowMoreContentPress={() => handleOnPostAction(item.id)}
                onCommentPress={() => handleOnPostAction(item.id)}
                onPress={() => handleOnPostAction(item.id)}
                onDeletePress={() => handleDeletePost(item.id)}
                onEditPress={() => {
                  checkExistUser(() => {
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.EDIT_POST, {
                      data: item,
                      reloadList: () => getData(),
                    })
                  })
                }}
                onReaction={() => checkExistUser()}
                hasToken={!!refToken.current}
              />
            )}
            keyExtractor={(_, index) => `${index}`}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </Transitioning.View>
      </View>
    )
  }
  const renderBody = () => {
    if (isFetchingData || HomeReducer.isLoading) return <Loading />
    if (HomeReducer.error)
      return <Error reload={() => Dispatch(requestGetHomeThunk())} />
    return (
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styleView.paddingBottomMain,
          { paddingTop: '14.5%' },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={getData} />
        }
        scrollEventThrottle={0}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
          {
            useNativeDriver: true,
          }
        )}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ flex: 1 }}>
          {/* Danh mục theo design cũ */}
          {/* <View style={[styles.viewCategory]}>
            <View style={styles.view_logo_category}>
              <FastImage
                style={styles.img24}
                source={R.images.icon_category_home}
              />
              <Text style={styles.txtTitle}>Danh mục</Text>
            </View>
            <  />
          </View> */}
          {/* Danh mục theo design mới */}
          <FastImage
            source={R.images.img_bg_category}
            style={{
              height: scale * 198,
              // width: WIDTH,
              marginTop: 6 * scale,
              // paddingLeft: 18 * scale,
            }}
          >
            <View style={styles.view_logo_category}>
              <FastImage
                style={styles.img24}
                source={R.images.icon_category_home}
                tintColor={'white'}
              />
              <Text style={styles.txtTitle}>Danh mục</Text>
            </View>
            {renderCategory()}
          </FastImage>
          {renderMenu()}
          <BannerHome listBanner={HomeReducer?.data?.banners} />
          {renderForum()}
          <IntroHome
            haveToken={true}
            data={HomeReducer?.data?.news}
            isHome={true}
          />

          {/* {data?.listLiveStream?.rows?.length ? (
            <View style={styles.viewLiveStream}>
              <View style={styles.view_logo_livestream}>
                <FastImage
                  style={styles.img24}
                  source={R.images.icon_livestream_home}
                />
                <Text style={styles.txtTitle}>Live stream</Text>
              </View>

              <RenderLiveStream dataLiveStream={data.listLiveStream.rows} />
            </View>
          ) : null} */}
        </View>
      </Animated.ScrollView>
    )
  }
  const renderSearch = () => {
    return (
      <Animated.View
        style={{
          backgroundColor: colors.white,
          paddingVertical: 10,
          position: 'absolute',
          width: dimensions.width,
          top: 0,
          zIndex: 99,
          transform: [{ translateY: searchBarTranslate }],
          opacity: searchBarOpacity,
        }}
      >
        <Search
          clickable
          containerStyle={{
            marginHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#D9D9D9',
          }}
          onClick={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.LIST_PRODUCT, {
              token,
              dataConfig,
            })
          }}
        />
      </Animated.View>
    )
  }
  const renderMenu = () => {
    return (
      <View style={styles.viewCommunity}>
        <View style={styles.view_space_between}>
          <View style={styles.view_item_community}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                checkExistUser(() => {
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.POST)
                })
              }}
            >
              <FastImage
                style={styles.img56}
                source={R.images.img_community_home}
              />
              <Text style={styles.txtCommunity}>Cộng đồng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.view_item_community}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() =>
                checkExistUser(() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)
                )
              }
            >
              <FastImage
                style={styles.img56}
                source={R.images.img_plus_point_community}
              />
              <Text style={styles.txtCommunity}>Tích điểm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.view_item_community}>
            <TouchableOpacity
              onPress={() => {
                checkExistUser(() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER)
                )
              }}
            >
              <FastImage
                style={styles.img56}
                source={R.images.img_rotation_community}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.txtCommunity}>Đơn hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.view_item_community}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() =>
                checkExistUser(() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.LIST_GIFT)
                )
              }
            >
              <FastImage
                style={styles.img56}
                source={R.images.img_gift_community}
              />
              <Text style={styles.txtCommunity}>Quà tặng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.main}>
      {/* {!token ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: '30%' }}
            showsVerticalScrollIndicator={false}
          >
            <BannerHome listBanner={HomeReducer?.data?.banners} />
            <IntroHome data={HomeReducer?.data?.news} isHome={true} />
          </ScrollView>
        </SafeAreaView>
      ) : ( */}
      <>
        {renderHeaderHome()}
        <View style={[{ flex: 1 }]}>
          {renderBody()}
          {renderSearch()}
          {isLoading && <LoadingProgress />}
          <LoadingDataCodePush />
        </View>
      </>
      {/* // )} */}
    </View>
  )
}

export default HomeScreen
