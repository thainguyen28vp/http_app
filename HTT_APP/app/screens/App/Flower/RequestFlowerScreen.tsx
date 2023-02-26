import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { DebounceButton } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import { colors, fonts } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getListCategory,
  requestGetListFlower,
} from '@app/service/Network/shop/ShopApi'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '@app/components/FstImage/FstImage'
import Loading from '@app/components/Loading'
import Error from '@app/components/Error/Error'
import reactotron from 'ReactotronConfig'
import DateUtil from '@app/utils/DateUtil'

const RequestFlowerScreen = () => {
  const [listFlower, setListFlower] = useState<[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const getListFlower = () => {
    callAPIHook({
      API: requestGetListFlower,
      useLoading: setIsLoading,
      onSuccess: res => {
        setListFlower(res.data)
      },
      onError(err) {
        reactotron.logImportant!('dasd', err)
        setIsError(true)
      },
      onFinaly() {
        setIsLoading(false)
      },
    })
  }

  React.useEffect(() => {
    getListFlower()
  }, [])

  const renderBody = () => {
    if (isLoading) return <Loading />
    // if (isError) return <Error reload={getListFlower} />
    return (
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingTop: 2, paddingHorizontal: 15, paddingBottom: '15%' },
        ]}
        showsVerticalScrollIndicator={false}
        data={listFlower}
        refreshing={false}
        onRefresh={getListFlower}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
        // onMomentumScrollBegin={onMomentumScrollBegin}
        // onEndReached={handleLoadMore}
        // onEndReachedThreshold={0.1}
        renderItem={({ item, index }) => (
          <FlowerItem
            item={item}
            index={index}
            onPress={() => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.DETAIL_REQUEST_FLOWER, {
                data: item,
              })
            }}
          />
        )}
        keyExtractor={(_, index) => `${index}`}
        // ListEmptyComponent={<Empty backgroundColor={'transparent'} />}
      />
    )
  }

  const rightComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.CREATE_REQUEST_FLOWER, {
            getListFlower,
          })
        }}
        style={{}}
      >
        <FastImage
          source={R.images.img_plus}
          style={{ width: 23, height: 23 }}
          tintColor={colors.primary}
        />
      </TouchableOpacity>
    )
  }

  return (
    <ScreenWrapper
      //   isLoading={isLoading}
      titleHeader={'Điện hoa'}
      children={renderBody()}
      rightComponent={rightComponent()}
    />
  )
}

export default RequestFlowerScreen

const styles = StyleSheet.create({})

const FlowerItem = ({ item, index, onPress }: any) => {
  return (
    <DebounceButton style={{ marginTop: 16 }} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          borderRadius: 8,
          padding: 16,
        }}
      >
        <FstImage
          source={
            item?.images?.length
              ? { uri: item?.images[0]?.image_url }
              : R.images.image_logo
          }
          style={{
            width: 114,
            borderRadius: 16,
            aspectRatio: 114 / 114,
          }}
        />
        <View
          style={{ paddingLeft: 24, justifyContent: 'space-between', flex: 1 }}
        >
          <Text
            style={{ ...fonts.medium14 }}
            children={item.receiver_name}
            numberOfLines={2}
          />
          <Text style={{ ...fonts.regular12 }} children={item.address} />
          <Text
            style={{ ...fonts.regular12, color: '#7B7B7B' }}
            children={`${DateUtil.formatTimeDateReview(item.created_at)}`}
          />

          <Text
            style={{
              ...fonts.medium14,
              color:
                item.status == 1
                  ? '#F1A22A'
                  : item.status == 2
                  ? '#2A91F1'
                  : 'red',
            }}
            children={
              item.status == 1
                ? `Đã yêu cầu`
                : item.status == 2
                ? 'Phê duyệt'
                : 'Từ chối'
            }
          />
        </View>
      </View>
    </DebounceButton>
  )
}
