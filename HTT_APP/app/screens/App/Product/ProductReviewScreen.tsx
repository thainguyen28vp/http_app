import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import FstImage from '@app/components/FstImage/FstImage'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { getProductReview } from '@app/service/Network/product/ProductApi'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import DateUtil from '@app/utils/DateUtil'
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, ListRenderItem } from 'react-native'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native-gesture-handler'
import reactotron from 'ReactotronConfig'
import StartSelect from './component/StartSelect'

const { width, height } = dimensions

const StarChartItem = ({ actual, index, all }: any) => {
  const [actualWidth, setActualWidth] = useState<number>(width)

  return (
    <View style={{ ...styleView.rowItem, alignItems: 'center', marginTop: 10 }}>
      <Text style={{ ...fonts.regular14 }} children={index} />
      <FastImage
        style={{ width: 15, height: 15, marginLeft: 5 }}
        source={R.images.ic_star_fill}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          height: 10,
          backgroundColor: '#ECEBED',
          borderRadius: 10,
        }}
        onLayout={({ nativeEvent }) => {
          setActualWidth(nativeEvent.layout.width)
        }}
        children={
          <View
            style={{
              height: '100%',
              backgroundColor: '#FFB700',
              borderRadius: 10,
              width: actualWidth * (all != 0 ? actual / all : 0),
            }}
          />
        }
      />
    </View>
  )
}

const ProductReviewScreen = (props: any) => {
  const product_id = props.route.params.id

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [productReviewData, setProductReviewData] = useState<any>()

  useEffect(() => {
    callAPIHook({
      API: getProductReview,
      payload: { product_id },
      useLoading: setIsLoading,
      onSuccess: res => {
        setProductReviewData(res.data)
      },
    })
  }, [])

  const renderRatingOverview = () => {
    return (
      <View
        style={{
          ...styleView.rowItem,
          height: 40,
          width: width - 60,
          alignSelf: 'center',
          backgroundColor: '#F1F3F5',
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          children={
            <StartSelect
              starSize={21}
              initalStar={productReviewData?.average}
              distance={2}
              contentStyle={{ alignItems: 'center' }}
            />
          }
        />
        <Text style={{ ...fonts.medium16, marginLeft: 7, color: '#262626' }}>
          {productReviewData?.data.average}
          <Text
            style={{ ...fonts.regular16, color: '#69747E' }}
            children={` (${productReviewData?.data.counts} đánh giá)`}
          />
        </Text>
      </View>
    )
  }

  const renderRatingChart = () => {
    const listKey = Object.keys(productReviewData?.data || {})

    return (
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        {['5', '4', '3', '2', '1'].map((item, index) => (
          <StarChartItem
            key={index}
            actual={
              listKey.includes(item) ? productReviewData.data[item].counts : 0
            }
            all={productReviewData?.data?.counts}
            index={item}
          />
        ))}
        <View
          style={{
            backgroundColor: '#CED4DA',
            height: 1,
            width: width - 40,
            alignSelf: 'center',
            marginVertical: 20,
          }}
        />
      </View>
    )
  }

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <FastImage
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{ uri: item.profile_picture_url }}
          />
          <View
            style={{
              justifyContent: 'space-between',
              height: 40,
              flex: 1,
              marginLeft: 16,
            }}
          >
            <View
              style={{
                ...styleView.rowItemBetween,
                height: 10,
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={{ ...fonts.medium14 }} children={item.user_name} />
              <Text
                style={{ ...fonts.regular12, color: '#69747E' }}
                children={DateUtil.formatTimeDateReview(item.create_at)}
              />
            </View>
            <View
              style={{ flex: 1 }}
              children={
                <StartSelect
                  starSize={11}
                  initalStar={item.star}
                  distance={2}
                  contentStyle={{ alignItems: 'center' }}
                />
              }
            />
          </View>
        </View>
        <Text
          style={{ ...fonts.regular15, marginTop: 15 }}
          children={item.content.trim()}
        />
        {!!item.ReviewMedia.length && (
          <ScrollView
            horizontal
            style={{ marginTop: 12 }}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            children={item.ReviewMedia.map(img => (
              <FstImage
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 10,
                  marginRight: 12,
                }}
                source={{ uri: img.media_url }}
              />
            ))}
          />
        )}
        <Text
          style={{ ...fonts.regular14, color: '#69747E', marginTop: 12 }}
          children={item?.note}
        />
      </View>
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 20 }} />,
    []
  )

  const renderListEmpty = useCallback(
    () => (
      <View style={{ flex: 1, marginTop: '25%', ...styleView.centerItem }}>
        <FastImage
          style={{ width: width / 2, height: height / 4 }}
          resizeMode={'contain'}
          source={R.images.ic_empty}
        />
        <Text
          style={{ ...fonts.regular15, color: '#69747E', marginTop: 10 }}
          children={'Chưa có đánh giá nào!'}
        />
      </View>
    ),
    []
  )

  return (
    <ScreenWrapper
      back
      isLoading={isLoading}
      titleHeader={'Đánh giá'}
      backgroundColor={colors.white}
    >
      <FlatList
        data={productReviewData?.rows || []}
        ListHeaderComponent={
          <>
            {renderRatingOverview()}
            {renderRatingChart()}
          </>
        }
        bounces={false}
        contentContainerStyle={{ paddingBottom: '10%' }}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderListEmpty}
      />
    </ScreenWrapper>
  )
}

export default ProductReviewScreen
