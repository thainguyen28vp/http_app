import * as React from 'react'
import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_APP, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestDeleteAccount, requestLogout } from '@app/screens/Auth/AuthApi'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import { useEffect, useState } from 'react'
import {
  ImageRequireSource,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import FastImage from 'react-native-fast-image'
import { clearNotifyCount } from '../Notification/slice/NotificationSlice'
import { requestUserThunk } from './slice/AccountSlice'
import { formatPrice } from '@app/utils/FuncHelper'
import Avatar from '@app/components/Avatar'
import { requestUploadSingleFile } from '@app/service/Network/files/FilesApi'
import reactotron from 'ReactotronConfig'
interface VerticalItemProps {
  icTitle: ImageRequireSource
  title: string
  onPress: () => void
}

const VerticalItem = (props: VerticalItemProps) => {
  const { icTitle, title, onPress } = props

  return (
    <Button
      onPress={onPress}
      children={
        <View style={{ ...styleView.rowItemBetween, marginTop: 28 }}>
          <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
            <FastImage
              style={{ width: 24, height: 24 }}
              resizeMode={'cover'}
              source={icTitle}
              tintColor={'black'}
            />
            <Text
              style={{ ...fonts.regular16, marginLeft: 16 }}
              children={title}
            />
          </View>
          <FastImage
            style={{ width: 24, height: 24 }}
            source={R.images.ic_arrow_right}
          />
        </View>
      }
    />
  )
}

const AccountScreen = () => {
  const [loadingLogout, setIsLoadingLogout] = useState(false)
  const { data, isLoading, error } = useAppSelector(
    state => state.accountReducer
  )
  const Dispatch = useAppDispatch()
  const [avtImgLoading, setAvtImgLoading] = useState<boolean>(false)
  const [avtImg, setAvtImg] = useState<boolean>(data?.avatar)
  const dataConfig: any = useAppSelector(state => state.ConfigReducer.data)

  const onLogout = () => {
    showConfirm(
      R.strings().notification,
      R.strings().confirm_logout,
      async () => {
        callAPIHook({
          API: requestLogout,
          useLoading: setIsLoadingLogout,
          typeLoading: 'isLoading',
          onSuccess: async res => {
            await AsyncStorageService.clear()
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          },
          onError: async err => {
            await AsyncStorageService.clear()
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          },
          onFinaly: () => {
            Dispatch(clearNotifyCount())
          },
        })
      },
      'Đăng xuất'
    )
  }
  const onDeleteAccount = () => {
    showConfirm(
      R.strings().notification,
      'Việc huỷ liên kết tài khoản sẽ xoá toàn bộ thông tin của bạn khỏi hệ thống, để sử dụng ứng dụng bạn sẽ phải đăng ký tài khoản mới. Bạn có chắc chắn muốn huỷ liên kết tài khoản này không?',
      async () => {
        callAPIHook({
          API: requestDeleteAccount,
          useLoading: setIsLoadingLogout,
          typeLoading: 'isLoading',
          onSuccess: async res => {
            showMessages('', 'Huỷ liên kết tài khoản thành công!', async () => {
              await AsyncStorageService.clear()
              NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
            })
          },
          onError: async err => {
            showMessages('', 'Đã có lỗi xảy ra! Vui lòng thử lại.')
          },
          onFinaly: () => {
            Dispatch(clearNotifyCount())
          },
        })
      },
      'Đồng ý'
    )
  }

  const getData = () => {
    Dispatch(requestUserThunk())
  }

  useEffect(() => {
    !data && getData()
  }, [])

  const renderAvatar = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 16,
        }}
      >
        <Avatar
          src={avtImg ? { uri: avtImg } : R.images.img_user}
          style={{ marginVertical: 20 }}
          isLoading={avtImgLoading}
          accessorySrc={R.images.ic_camera}
          onSelect={res => {
            let body = new FormData()
            body.append('file', {
              name: `images${new Date().getTime()}.jpg`,
              type: 'image/jpeg',
              uri: res,
            })

            callAPIHook({
              API: requestUploadSingleFile,
              payload: body,
              useLoading: setAvtImgLoading,
              onSuccess: res => {
                setAvtImg(res.data.url)
              },
            })
          }}
        />
        {/* <Button
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.UPDATE_USER, {
              refreshList: () => getData(),
            })
          }
          children={
            <FastImage
              style={{ width: 80, height: 80, borderRadius: 40 }}
              source={
                data?.profile_picture_url
                  ? { uri: data?.profile_picture_456url }
                  : R.images.img_user
              }
            />
          }
        /> */}

        <Text
          style={{ ...fonts.regular18, marginTop: 10 }}
          children={`${data?.full_name} - ${data?.Kiotviet?.name}`}
        />
        {/* <Text
          style={{ ...fonts.regular13, marginTop: 10 }}
          children={`Công nợ: ${formatPrice(data?.debt) || 0}`}
        />
        <Text
          style={{ ...fonts.regular13, marginTop: 10 }}
          children={`Điểm: ${formatPrice(data?.wallet?.point) || 0}`}
        /> */}
        {/* <Text
          style={{ ...fonts.regular13, marginTop: 10 }}
          children={`Coin: ${formatPrice(data?.wallet?.coin) || 0}`}
        /> */}
        <Text
          style={{ ...fonts.regular16, marginTop: 16, color: '#69747E' }}
          children={data?.phone_number}
        />
        {/* <Button
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.UPDATE_USER, {
              refreshList: () => getData(),
            })
          }
          style={{ position: 'absolute', top: 0, right: 20 }}
          children={
            <FastImage
              style={{ width: 24, height: 24 }}
              source={R.images.ic_edit}
            />
          }
        /> */}
      </View>
    )
  }

  const renderMenu = () => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          marginTop: 4,
        }}
      >
        {/* <VerticalItem
          icTitle={R.images.ic_document}
          title={'Media Viewer'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.MEDIA_VIEWER_TEST)
          }
        /> */}
        <VerticalItem
          icTitle={R.images.ic_document}
          title={'Đơn hàng'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER)}
        />
        <VerticalItem
          icTitle={R.images.ic_conversation}
          title={'Chủ đề quan tâm'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.FAVORITE_TOPIC)
          }
        />
        <VerticalItem
          icTitle={R.images.ic_gallery}
          title={'Bài đăng của bạn'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.POST, {
              user_id: data.id,
            })
          }
        />
        {/* <VerticalItem
          icTitle={R.images.ic_network}
          title={'Mã giới thiệu'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.REFERRAL_CODE, {
              refreshList: () => getData(),
            })
          }
        /> */}
        <VerticalItem
          icTitle={R.images.ic_map_outline_black}
          title={'Địa chỉ của bạn'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_RECEIVER, {
              accountSign: true,
            })
          }
        />
        <VerticalItem
          icTitle={R.images.ic_gift}
          title={'Danh sách quà tặng'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.LIST_GIFT)}
        />
        <VerticalItem
          icTitle={R.images.img_my_gift}
          title={'Quà tặng của bạn'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.MY_GIFT)}
        />
        <VerticalItem
          icTitle={R.images.img_point_payment}
          title={'Tích điểm'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)}
        />
        <VerticalItem
          icTitle={R.images.img_coin_user}
          title={'Ví xu'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT, { type: 1 })
          }
        />
        {/* <VerticalItem
          icTitle={R.images.icon_heart_forum}
          title={'Sản phẩm quan tâm'}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.FAVORITE_PRODUCT)
          }
        /> */}
        {/* <VerticalItem
          icTitle={R.images.img_store_follow}
          title={'Danh sách gian hàng theo dõi'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.SHOP_FOLLOW)}
        /> */}
        <VerticalItem
          icTitle={R.images.ic_lock}
          title={'Đổi mật khẩu'}
          onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.CHANGE_PASS)}
        />
        {dataConfig?.flag_user_register_enabled && (
          <VerticalItem
            icTitle={R.images.img_remove_account}
            title={'Huỷ liên kết tài khoản'}
            onPress={onDeleteAccount}
          />
        )}
        <VerticalItem
          icTitle={R.images.ic_exit}
          title={'Đăng xuất'}
          onPress={onLogout}
        />
      </View>
    )
  }

  const itemWallet = (
    img: any,
    title: any,
    point: any,
    onPress?: () => void
  ) => {
    return (
      <DebounceButton
        onPress={onPress}
        children={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage source={img} style={{ width: 30, height: 30 }} />
            <View style={{ marginLeft: 10, alignItems: 'center' }}>
              <Text
                style={{ ...fonts.regular12, color: 'rgba(0,0,0,0.5)' }}
                children={title}
              />
              <Text
                style={{ marginTop: 5, ...fonts.regular12 }}
                children={formatPrice(point) || 0}
              />
            </View>
          </View>
        }
      />
    )
  }

  const renderWallet = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          marginTop: 24,
        }}
      >
        {itemWallet(R.images.img_debt_user, 'Công nợ', data?.debt)}
        {itemWallet(
          R.images.img_gift_user,
          'Tích điểm',
          data?.wallet?.point,
          () => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT)
          }
        )}
        {itemWallet(R.images.img_coin_user, 'Ví xu', data?.wallet?.coin, () => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.EARN_POINT, { type: 1 })
        })}
      </View>
    )
  }

  if (isLoading) return <Loading />
  if (error) return <Error reload={getData} />
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: '20%', paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getData} />
        }
      >
        {renderAvatar()}
        <View
          style={{ height: 1, width: '100%', backgroundColor: '#D9D9D9' }}
        />
        {renderWallet()}
        {renderMenu()}
        <Text
          style={{ color: '#DDD', textAlign: 'center', marginTop: '10%' }}
          children={`Version ${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`}
        />
        {loadingLogout && <LoadingProgress />}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
})

export default AccountScreen
