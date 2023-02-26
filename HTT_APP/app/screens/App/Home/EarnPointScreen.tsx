import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { TYPE_POINT_TRANSACTION_HISTORY } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  getListCoin,
  getListHistoryPoint,
} from '@app/service/Network/home/HomeApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import DateUtil from '@app/utils/DateUtil'
import { formatPrice } from '@app/utils/FuncHelper'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import reactotron from 'ReactotronConfig'
import { requestUserThunk } from '../Account/slice/AccountSlice'

const { height } = dimensions

const EarnPointScreen = (props: any) => {
  const type = props.route.params?.type
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pointData, setPointData] = useState<any>()
  const Dispatch = useAppDispatch()
  const { data } = useAppSelector(state => state.accountReducer)

  const getData = () => {
    callAPIHook({
      API: type ? getListCoin : getListHistoryPoint,
      useLoading: setIsLoading,
      onSuccess: res => {
        reactotron.logImportant!(res.data)
        setPointData(res.data)
      },
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const renderEarnPoinArea = () => {
    return (
      <View style={styles.earnPointView}>
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <FastImage
            style={{ width: 32, height: 32, marginRight: 12 }}
            source={R.images.ic_star_point}
          />
          <View>
            <Text style={{ ...fonts.medium15 }} children={'10 điểm'} />
            <Text
              style={{ ...fonts.regular14, color: '#69747E' }}
              children={'Nhận điểm tích lũy'}
            />
          </View>
        </View>
        <Button
          style={styles.claimBtn}
          onPress={() => {}}
          children={
            <Text
              style={{ ...fonts.medium15, color: colors.white }}
              children={'Nhận'}
            />
          }
        />
      </View>
    )
  }

  const renderHistoryPointItem: ListRenderItem<any> = useCallback(
    ({ item }) => {
      const isAddPoint = item?.type == TYPE_POINT_TRANSACTION_HISTORY.ADD

      const handleWallet = () => {
        if (item?.type == 'add')
          return `+${formatPrice(item?.value.toString())} ${
            type ? 'xu' : 'điểm'
          }`
        return `-${formatPrice(item?.value.toString())} ${type ? 'xu' : 'điểm'}`
      }

      return (
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: 12,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...fonts.medium14,
                color: '#69747E',
                marginRight: 10,
                flex: 1,
              }}
              numberOfLines={2}
              children={item?.note + item?.note}
            />
            <Text
              style={{
                ...fonts.medium16,
                color:
                  item?.type == 'add'
                    ? colors.success.primary
                    : item?.type !== 'add'
                    ? '#F03E3E'
                    : isAddPoint
                    ? colors.success.primary
                    : '#F03E3E',
              }}
              children={handleWallet()}
            />
          </View>
          <View style={{ ...styleView.rowItemBetween, marginTop: 6 }}>
            <Text
              style={{ ...fonts.medium14, color: '#69747E' }}
              children={DateUtil.formatShortDate(item?.create_at)}
            />
            <Text
              style={{ ...fonts.medium14, color: '#69747E' }}
              children={`Số dư: ${
                formatPrice(item?.current_balance.toString()) || 0
              } đ`}
            />
          </View>
        </View>
      )
    },
    []
  )

  return (
    <ScreenWrapper
      back
      unsafe
      isLoading={isLoading}
      titleHeader={type ? 'Ví xu' : 'Tích điểm'}
    >
      <FastImage style={styles.bgImg} source={R.images.img_bg_earn_point} />
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Text
          style={{ ...fonts.medium24, marginTop: 35 }}
          children={
            formatPrice(
              type
                ? pointData?.total_coin.toString()
                : pointData?.total_point.toString()
            ) || 0
          }
        />
        <Text
          style={{ ...fonts.regular16, marginTop: 11 }}
          children={type ? 'Xu hiện có' : 'Điểm tích lũy'}
        />
        {type && !pointData?.total_coin ? (
          <DebounceButton
            style={{ marginTop: 15 }}
            onPress={() => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.RECHARGE_COIN)
            }}
            children={
              <FastImage
                source={R.images.img_rechagre_coin}
                style={{ width: 110, height: 45, aspectRatio: 110 / 45 }}
              />
            }
          />
        ) : null}
        {/* <View
          style={{ paddingHorizontal: 35, width: '100%' }}
          children={renderEarnPoinArea()}
        /> */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#F5F5F5',
            width: '100%',
            marginTop: 26,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 15,
            paddingTop: 20,
          }}
        >
          <Text
            style={{ ...fonts.medium16, color: '#262626' }}
            children={'Lịch sử tích điểm'}
          />
          <FlatList
            data={pointData?.transactions}
            refreshing={isLoading}
            onRefresh={() => {
              getData()
              Dispatch(requestUserThunk())
            }}
            contentContainerStyle={{ paddingBottom: isIphoneX() ? 20 : 0 }}
            showsVerticalScrollIndicator={false}
            renderItem={renderHistoryPointItem}
            keyExtractor={(_, index) => `${index}`}
            ListEmptyComponent={
              <Empty
                backgroundColor={'transparent'}
                imageStyle={{ height: height / 6 }}
              />
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  bgImg: {
    width: '100%',
    height: 210,
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  earnPointView: {
    ...styleView.rowItemBetween,
    alignItems: 'center',
    paddingHorizontal: 12,
    width: '100%',
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 27,
  },
  claimBtn: {
    ...styleView.centerItem,
    width: 70,
    height: 32,
    backgroundColor: '#FCA931',
    borderRadius: 16,
  },
})

export default EarnPointScreen
