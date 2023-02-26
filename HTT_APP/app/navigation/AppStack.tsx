import MediaViewer from '@app/components/MediaSwiper/RNMediaViewer'
import { SCREEN_ROUTER_APP, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import ChangePasswordScreen from '@app/screens/App/Account/ChangePasswordScreen'
import FavoriteProductScreen from '@app/screens/App/Account/FavoriteProductScreen'
import FavoriteTopicScreen from '@app/screens/App/Account/FavoriteTopicScreen'
import ListGiftScreen from '@app/screens/App/Account/ListGiftScreen'
import ReferralCodeScreen from '@app/screens/App/Account/ReferralCodeScreen'
import ChatDetailScreen from '@app/screens/App/Chat/ChatDetailScreen'
import ChatScreen from '@app/screens/App/Chat/ChatScreen'
import DetailArticleScreen from '@app/screens/App/Forum/DetailArticleScreen'
import ListArticleScreen from '@app/screens/App/Forum/ListArticleScreen'
import PostArticleScreen from '@app/screens/App/Forum/PostArticleScreen'
import CreatePostScreen from '@app/screens/App/Home/CreatePostScreen'
import EditPostScreen from '@app/screens/App/Home/EditPostScreen'
import HomeScreen from '@app/screens/App/Home/HomeScreen'
import PostDetailScreen from '@app/screens/App/Home/PostDetailScreen'
import PostScreen from '@app/screens/App/Home/PostScreen'
import PostSelectMedia from '@app/screens/App/Home/PostSelectMedia'
import CreateLiveScreen from '@app/screens/App/Livestream/CreateLiveScreen'
import ListProductLiveScreen from '@app/screens/App/Livestream/ListProductLiveScreen'
import LiveStreamScreen from '@app/screens/App/Livestream/LiveStreamScreen'
import PreviewScreen from '@app/screens/App/Livestream/PreviewLiveScreen'
import RecordScreen from '@app/screens/App/Livestream/RecordScreen'
import WatchingScreen from '@app/screens/App/Livestream/WatchingScreen'
import FilterSearch from '@app/screens/App/Product/FilterSearchScreen'
import ProductDetailScreen from '@app/screens/App/Product/ProductDetailScreen'
import ProductReviewScreen from '@app/screens/App/Product/ProductReviewScreen'
import ProductScreen from '@app/screens/App/Product/ProductScreen'
import ReviewProduct from '@app/screens/App/Product/ReviewProductScreent'
import CartScreen from '@app/screens/App/Shop/CartScreen'
import CartTestScreen from '@app/screens/App/Shop/CartTestScreen'
import ChooseReceiverScreen from '@app/screens/App/Shop/ChooseReceiverScreen'
import OrderRatingScreen from '@app/screens/App/Shop/components/OrderRatingScreen'
import CreatOrderScreen from '@app/screens/App/Shop/CreatOrderScreen'
import EditReceiverInforScreen from '@app/screens/App/Shop/EditReceiverInforScreen'
import OrderDetailScreen from '@app/screens/App/Shop/OrderDetailScreen'
import OrderScreen from '@app/screens/App/Shop/OrderScreen'
import PaymentScreen from '@app/screens/App/Shop/PaymentScreen'
import ReceiverInfoScreen from '@app/screens/App/Shop/ReceiverInfoScreen'
import ShopDetailScreen from '@app/screens/App/Shop/ShopDetailScreen'
import ShopProductCategoryScreen from '@app/screens/App/Shop/ShopProductCategoryScreen'
import MyGiftScreen from '@app/screens/App/Account/MyGiftScreen'
import VoucherScreen from '@app/screens/App/Shop/VoucherScreen'
import UpdateUserInforScreen from '@app/screens/App/Shop/UpdateUserInforScreen'
import ForgotPasswordScreen from '@app/screens/Auth/ForgotPasswordScreen'
import LoginScreen from '@app/screens/Auth/LoginScreen'
import OTPScreen from '@app/screens/Auth/OTPScreen'
import RegisterScreen from '@app/screens/Auth/RegisterScreen'
import SplashScreen from '@app/screens/SplashScreen'
import WelcomeScreen from '@app/screens/WelcomeScreen'
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack'
import React from 'react'
import EarnPointScreen from '@app/screens/App/Home/EarnPointScreen'
import YoutubeLiveScreen from '@app/screens/App/Livestream/YoutubeLiveScreen'
import UpdatePasswordScreen from '@app/screens/Auth/UpdatePasswordScreen'
import YoutubeWatchingScreen from '@app/screens/App/Livestream/YoutubeWatchingScreen'
import MediaViewerTest from '@app/screens/App/Account/MediaViewerTest/MediaViewerTest'
import LiveStreamAndroid from '@app/screens/App/Livestream/LiveStreamAndroid'
import EndLiveScreen from '@app/screens/App/Livestream/EndLiveScreen'
import ShopFollowScreen from '@app/screens/App/Account/ShopFollowScreen'
import CameraTest from '@app/screens/App/Account/CameraTest'
import ListShopFollowScreen from '@app/screens/Auth/ListShopFollowScreen'
import PasswordScreen from '@app/screens/Auth/PasswordScreen'
import ProvinceLoginScreen from '@app/screens/Auth/ProvinceLoginScreen'
import NewsDetailScreen from '@app/screens/App/Home/NewsDetailScreen'
import ListProduct from '@app/screens/App/Product/ListProduct'
import DetailRequestFlower from '@app/screens/App/Flower/DetailRequestFlowerScreen'
import CreateRequestFlowerScreen from '@app/screens/App/Flower/CreateRequestFlowerScreen'
import NewsScreen from '@app/screens/App/Home/NewsScreen'
import RequestFlowerScreen from '@app/screens/App/Flower/RequestFlowerScreen'
import RechargeCoinScreen from '@app/screens/App/Home/RechargeCoinScreen'

const MainStack = createStackNavigator()
const AuthStack = createStackNavigator()

const {
  SPLASH,
  WELCOME,
  LOGIN,
  REGISTER,
  FORGOT_PASS,
  OTP,
  UPDATE_PASS,
  LIST_SHOP_FOLLOW,
  PASSWORD,
  PROVINCE_LOGIN,
} = SCREEN_ROUTER_AUTH

const {
  HOME,
  PREVIEW,
  LIVE,
  LIVE_STREAM,
  CART,
  CREATE_ORDER,
  CHOOSE_RECEIVER,
  RECEIVER_INFO,
  RECEIVER_EDIT,
  ORDER_DETAIL,
  ORDER,
  PRODUCT_DETAIL,
  REVIEW_PRODUCT,
  LIST_ARTICLE,
  DETAIL_ARTICLE,
  POST_ARTICLE,
  CREATE_LIVE,
  CHOOSE_PRODUCT_LIVE,
  CART_TEST,
  PAYMENT,
  PRODUCT,
  FILTER_SEARCH,
  POST,
  POST_DETAIL,
  MEDIA_VIEWER,
  CREATE_POST,
  FAVORITE_TOPIC,
  CHAT,
  WATCHING_LIVE,
  EDIT_POST,
  POST_SELECT_MEDIA,
  SHOP_DETAIL,
  UPDATE_USER,
  CHANGE_PASS,
  REFERRAL_CODE,
  FAVORITE_PRODUCT,
  SHOP_CATEGORY_PRODUCT,
  PRODUCT_REVIEW,
  ORDER_RATING,
  CHAT_DETAIL,
  MY_GIFT,
  VOUCHER,
  RECORD,
  LIST_GIFT,
  EARN_POINT,
  YOUTUBE_LIVE,
  YOUTUBE_WATCHING,
  MEDIA_VIEWER_TEST,
  LIVE_ANDROID,
  END_LIVE,
  SHOP_FOLLOW,
  CAMERA_TEST,
  NEWS_DETAIL,
  LIST_PRODUCT,
  DETAIL_REQUEST_FLOWER,
  CREATE_REQUEST_FLOWER,
  REQUEST_FLOWER,
  NEWS,
  RECHARGE_COIN
} = SCREEN_ROUTER_APP

const AUTH_STACK = {
  [SPLASH]: SplashScreen,
  [WELCOME]: WelcomeScreen,
  [LOGIN]: LoginScreen,
  [PASSWORD]: PasswordScreen,
  [OTP]: OTPScreen,
  [REGISTER]: RegisterScreen,
  [FORGOT_PASS]: ForgotPasswordScreen,
  [UPDATE_PASS]: UpdatePasswordScreen,
  [LIST_SHOP_FOLLOW]: ListShopFollowScreen,
  [PROVINCE_LOGIN]: ProvinceLoginScreen,
}

const APP_STACK = {
  [HOME]: HomeScreen,
  [LIVE_STREAM]: LiveStreamScreen,
  [PREVIEW]: PreviewScreen,
  [CART]: CartScreen,
  [CREATE_ORDER]: CreatOrderScreen,
  [PRODUCT_DETAIL]: ProductDetailScreen,
  [REVIEW_PRODUCT]: ReviewProduct,
  [CHOOSE_RECEIVER]: ChooseReceiverScreen,
  [RECEIVER_INFO]: ReceiverInfoScreen,
  [LIST_ARTICLE]: ListArticleScreen,
  [DETAIL_ARTICLE]: DetailArticleScreen,
  [POST_ARTICLE]: PostArticleScreen,
  [RECEIVER_EDIT]: EditReceiverInforScreen,
  [ORDER]: OrderScreen,
  [ORDER_DETAIL]: OrderDetailScreen,
  [CREATE_LIVE]: CreateLiveScreen,
  //
  [CHOOSE_PRODUCT_LIVE]: ListProductLiveScreen,
  //
  [CART_TEST]: CartTestScreen,
  [PAYMENT]: PaymentScreen,
  [PRODUCT]: ProductScreen,
  [FILTER_SEARCH]: FilterSearch,
  [POST]: PostScreen,
  [POST_DETAIL]: PostDetailScreen,
  [MEDIA_VIEWER]: MediaViewer,
  [CREATE_POST]: CreatePostScreen,
  [FAVORITE_TOPIC]: FavoriteTopicScreen,
  [CHAT]: ChatScreen,
  [WATCHING_LIVE]: WatchingScreen,
  [EDIT_POST]: EditPostScreen,
  [POST_SELECT_MEDIA]: PostSelectMedia,
  [SHOP_DETAIL]: ShopDetailScreen,
  [UPDATE_USER]: UpdateUserInforScreen,
  [CHANGE_PASS]: ChangePasswordScreen,
  [REFERRAL_CODE]: ReferralCodeScreen,
  [FAVORITE_PRODUCT]: FavoriteProductScreen,
  [SHOP_CATEGORY_PRODUCT]: ShopProductCategoryScreen,
  [PRODUCT_REVIEW]: ProductReviewScreen,
  [ORDER_RATING]: OrderRatingScreen,
  [CHAT_DETAIL]: ChatDetailScreen,
  [MY_GIFT]: MyGiftScreen,
  [VOUCHER]: VoucherScreen,
  [RECORD]: RecordScreen,
  [LIST_GIFT]: ListGiftScreen,
  [EARN_POINT]: EarnPointScreen,
  //
  [YOUTUBE_LIVE]: YoutubeLiveScreen,
  //
  [YOUTUBE_WATCHING]: YoutubeWatchingScreen,
  [MEDIA_VIEWER_TEST]: MediaViewerTest,
  [LIVE_ANDROID]: LiveStreamAndroid,
  [END_LIVE]: EndLiveScreen,
  [SHOP_FOLLOW]: ShopFollowScreen,
  [CAMERA_TEST]: CameraTest,
  [NEWS_DETAIL]: NewsDetailScreen,
  [LIST_PRODUCT]: ListProduct,
  [DETAIL_REQUEST_FLOWER]: DetailRequestFlower,
  [CREATE_REQUEST_FLOWER]: CreateRequestFlowerScreen,
  [NEWS]: NewsScreen,
  [REQUEST_FLOWER]: RequestFlowerScreen,
  [RECHARGE_COIN]: RechargeCoinScreen,
}

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

const StackAuthScreen = () => {
  return (
    <>
      {Object.keys(AUTH_STACK).map((item, index) => {
        if (item == SPLASH || item == LOGIN) {
          return (
            <AuthStack.Screen
              options={{
                cardStyleInterpolator: forFade,
              }}
              key={index}
              name={item}
              component={AUTH_STACK[item]}
            />
          )
        } else {
          return (
            <AuthStack.Screen
              key={index}
              name={item}
              component={AUTH_STACK[item]}
            />
          )
        }
      })}
    </>
  )
}

const StackAppScreen = () => {
  return (
    <>
      {Object.keys(APP_STACK).map((item, index) => (
        <MainStack.Screen key={index} name={item} component={APP_STACK[item]} />
      ))}
    </>
  )
}

export { StackAppScreen, StackAuthScreen, AuthStack, MainStack }
