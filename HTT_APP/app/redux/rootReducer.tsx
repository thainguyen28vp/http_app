import accountReducer from '../screens/App/Account/slice/AccountSlice'
// import StoreReducer from './store/store_list/StoreSlice'
// import AuthReducer from './auth/AuthSlice'
import ListProductReducer from '../screens/App/Product/slice/ListProductSlice'
import RootReducer from './rootSlice'
import CartReducer from '@app/screens/App/Shop/slice/CartSlice'
import ListLiveStreamReducer from '@app/screens/App/Livestream/slice/LiveStreamSlice'
import ProvinceReducer from '@screen/App/Home/slice/ProvinceSlice'
import OrderReducer from '@app/screens/App/Shop/slice/OrderSlice'
import PostReducer from '@app/screens/App/Home/slice/PostSlice'
import ProductCustomAttributeReducer from '@app/screens/App/Product/slice/ProductCustomAttributeSlice'
import HomeReducer from '@app/screens/App/Home/slice/HomeSlice'
import FilterReducer from '@app/screens/App/Product/slice/FilterSlice'
import CountCartReducer from '@app/screens/App/Shop/slice/CountCartSlice'
import HistoryLiveReducer from '@app/screens/App/Livestream/slice/HistoryLiveSlice'
import ListMyLiveReducer from '@app/screens/App/Livestream/slice/MyLiveSlice'
import ChatReducer from '@app/screens/App/Chat/slice/ChatSlice'
import NotificationReducer from '@app/screens/App/Notification/slice/NotificationSlice'
import LiveReducer from '@app/screens/App/Livestream/slice/LiveSlice'
import ShopReducer from '@app/screens/App/Shop/slice/ShopSlice'
import OrderRatingReducer from '@app/screens/App/Shop/slice/OrderRatingSlice'
import MyGiftReducer from '@app/screens/App/Account/slice/MyGiftSlice'
import StreamingReducer from '@app/screens/App/Livestream/slice/StreamingSlice'
import CodePushReducer from '@app/screens/App/CodePushSlice'
import ConfigReducer from '@app/screens/App/Config/ConfigSlice'

const rootReducer = {
  accountReducer,
  rootReducer: RootReducer,
  ListProductReducer,
  CartReducer,
  ListLiveStreamReducer,
  ProvinceReducer,
  OrderReducer,
  PostReducer,
  ProductCustomAttributeReducer,
  HomeReducer,
  FilterReducer,
  CountCartReducer,
  HistoryLiveReducer,
  ListMyLiveReducer,
  ChatReducer,
  NotificationReducer,
  LiveReducer,
  ShopReducer,
  OrderRatingReducer,
  MyGiftReducer,
  StreamingReducer,
  CodePushReducer,
  ConfigReducer,
}

export default rootReducer
