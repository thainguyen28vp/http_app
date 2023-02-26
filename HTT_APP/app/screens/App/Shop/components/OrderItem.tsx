import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts, styleView } from '@app/theme'
import Line from './Line'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { formatPrice } from '@app/utils/FuncHelper'
import FstImage from '@app/components/FstImage/FstImage'
import reactotron from 'ReactotronConfig'
import DateUtil from '@app/utils/DateUtil'
import isEqual from 'react-fast-compare'
import { genProductAttributeName } from '../../Product/utils/ProductUtils'

interface OrderItemProps {
  data?: any
  showTopStatus?: boolean
  showBottomStatus?: boolean
  onPress?: () => void
  showRating?: Boolean
  onRatingPress?: () => void
  onRepurchase?: () => void
}

const OrderItem = ({
  data,
  showBottomStatus = true,
  showTopStatus = true,
  onPress,
  showRating,
  onRatingPress,
  onRepurchase,
}: OrderItemProps) => {
  const orderItemView = (
    <View style={{ backgroundColor: colors.white }}>
      {showTopStatus && (
        <>
          <View style={styles.top}>
            <Text
              style={{ ...fonts.semi_bold15 }}
              children={`${data.code}` || 'Đang cập nhật'}
            />
            <Text
              style={{ ...fonts.regular15, color: '#69747E' }}
              children={DateUtil.formatTimeDate(data?.created_at)}
            />
          </View>
          <Line />
        </>
      )}
      <View style={styles.center}>
        <FstImage
          style={styles.imgProduct}
          source={{
            uri: data?.items ? data?.items[0]?.image : data?.image,
          }}
          resizeMode={'cover'}
        />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text
            style={{ ...fonts.regular16 }}
            numberOfLines={2}
            children={`${
              data?.items
                ? data?.items[0]?.product_name
                : data?.product_name || data.name
            }`}
          />
          <View style={{ ...styleView.rowItemBetween, alignItems: 'center' }}>
            <Text
              style={{ ...fonts.regular15, color: '#69747E' }}
              children={genProductAttributeName(data)}
            />
            <Text
              style={{ ...fonts.regular15, color: '#69747E' }}
              children={`x${
                (data?.items ? data?.items[0]?.quantity : data?.quantity) || 0
              }`}
            />
          </View>
          <Text
            style={{ ...fonts.semi_bold14, color: colors.primary }}
            children={
              `${formatPrice(
                (data?.items ? data?.items[0]?.price : data?.price) || 0
              )}đ` || 'Đang cập nhật'
            }
          />
        </View>
      </View>
      {showBottomStatus && (
        <>
          <Line />
          <View style={styles.bottom}>
            <Text
              style={{ ...fonts.regular14 }}
              children={`${data?.items?.length} sản phẩm` || 'Đang cập nhật'}
            />
            <Text
              style={{
                ...fonts.regular15,
                // textAlign: 'right',
              }}
            >
              Tổng tiền:{' '}
              <Text
                style={{ ...fonts.semi_bold17, color: colors.primary }}
                children={`${formatPrice(data?.total?.toString()) || 0}đ` || ''}
              />
            </Text>
          </View>
        </>
      )}
      {showRating && (
        <>
          <Line />
          <View
            style={{
              ...styleView.rowItemBetween,
              paddingHorizontal: 15,
              height: 40,
              alignItems: 'center',
            }}
          >
            {!data.check_review ? (
              <Text
                style={{ ...fonts.regular15, color: '#8C8C8C' }}
                children={'Chưa có đánh giá'}
              />
            ) : (
              <View />
            )}
            <Button
              // disabled={!!data.check_review}
              onPress={() => {
                if (!data.check_review) {
                  !!onRatingPress && onRatingPress()
                } else {
                  !!onRepurchase && onRepurchase()
                }
              }}
              children={
                <View
                  style={[
                    styles.ratingBtn,
                    {
                      borderColor: !!data.check_review
                        ? colors.primary
                        : '#D5A227',
                    },
                  ]}
                  children={
                    <Text
                      style={{
                        ...fonts.regular15,
                        color: !!data.check_review ? colors.primary : '#D5A227',
                      }}
                      children={
                        !!data.check_review ? 'Đã đánh giá' : 'Đánh giá'
                      }
                    />
                  }
                />
              }
            />
          </View>
        </>
      )}
    </View>
  )

  return (
    <Button
      disabled={!onPress}
      onPress={() => !!onPress && onPress()}
      children={orderItemView}
    />
  )
}

const styles = StyleSheet.create({
  top: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  imgProduct: {
    width: 85,
    height: 85,
    borderRadius: 12,
    marginRight: 15,
  },
  center: {
    ...styleView.rowItem,
    padding: 15,
  },
  bottom: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // alignSelf: 'flex-end',
    // justifyContent: 'space-between',
  },
  ratingBtn: {
    ...styleView.centerItem,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#D5A227',
    borderWidth: 1,
    height: 32,
  },
})

export default memo(OrderItem, isEqual)
