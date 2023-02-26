import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import { DebounceButton } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  SCREEN_ROUTER,
  SCREEN_ROUTER_APP,
  SCREEN_ROUTER_AUTH,
} from '@app/config/screenType'
import FastImage from 'react-native-fast-image'
import { LIST_FLOWERS } from '@app/config/Constants'
import { content } from './NewsDetailScreen'
const scale = WIDTH / 375

// let content = `Có phải bạn đang tìm:
// Địa chỉ cung cấp hoa tươi uy tín, GIÁ TỐT so với thị trường .Đa dạng nhiều loại hoa với mẫu mã đẹp, đáp ứng nhu cầu Hoa ĐƯỢC BẢO HÀNH, đảm bảo về chất lượng
// Luôn sẵn sàng phục vụ 24/24. Vậy thì nhất định bạn KHÔNG ĐƯỢC BỎ QUA bài viết này. Gia nhập ngay nhóm sỉ của kho hoa Thanh Tước. Bạn sẽ nhận được gì khi hợp tác với chúng tôi:
// ▪️ Nhập sỉ CHIẾT KHẤU CAO cùng các chương trình ƯU ĐÃI hấp dẫn
// ▪️ Bỏ VỐN ÍT, thu lợi nhuận KHỔNG LỒ
// ▪️ Hoa về liên tục theo mùa, đi đầu xu hướng, khách chọn mua nhiều, NHẬP ĐẾN ĐÂU HẾT ĐẾN ĐÓ
// ▪️ Đội ngũ nhân viên hỗ trợ nhiệt tình, hướng dẫn chốt sale hiệu quả từ A-Z
// ▪️ Chia sẻ kho hình ảnh ĐẸP MÊ, tất cả đều là ảnh thật 100%`

const IntroHome = (props: any) => {
  const { haveToken, data, isHome } = props

  const renderContentIntro = () => {
    return (
      <View style={{ paddingTop: 8 }}>
        <FastImage
          source={R.images.image_logo}
          style={{
            width: 188 * scale,
            height: 124 * scale,
            marginTop: haveToken ? 0 : 30,
            alignSelf: 'center',
          }}
        />
        <View style={{ marginTop: 10, paddingHorizontal: 16 }}>
          <View
            children={
              <>
                {/* <Text
                style={{ ...fonts.bold16 }}
                children={'Kinh doanh hoa tươi - vốn tí, lãi nhiều'}
              /> */}
                <Text
                  style={{
                    ...fonts.regular16,
                    color: '#8C8C8C',
                    marginTop: 10,
                  }}
                  numberOfLines={12}
                  children={content}
                />
                <DebounceButton
                  onPress={() => {
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
                      type: 1,
                    })
                  }}
                  children={
                    <Text
                      style={{ color: colors.primary, marginTop: 5 }}
                      children={'Xem thêm'}
                    />
                  }
                />
              </>
            }
          />
          {!haveToken && (
            <DebounceButton
              style={{
                marginTop: 23,
                backgroundColor: colors.primary,
                alignSelf: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
              onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
              }}
              children={
                <Text
                  style={{ color: colors.white, ...fonts.medium16 }}
                  children={'Đăng nhập'}
                />
              }
            />
          )}
        </View>
      </View>
    )
  }
  const renderNews = () => {
    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 8,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              ...fonts.bold18,
              marginLeft: 16,
            }}
            children={'Tìm hiểu thêm về chúng tôi'}
          />
        </View>
        {data?.map((item: any, index: any) => (
          <NewsItem item={item} index={index} isHome={isHome} />
        ))}
        <DebounceButton
          style={{ marginLeft: 16, alignSelf: 'center', marginTop: 8 }}
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS)
          }}
          children={
            <Text
              style={{ color: colors.primary, marginTop: 15 }}
              children={'Xem tất cả bài viết'}
            />
          }
        />
      </View>
    )
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      style={{ flex: 1, paddingTop: 15, backgroundColor: colors.white }}
    >
      {renderNews()}
      <View
        style={{
          height: 5,
          backgroundColor: '#EFEFEF',
          marginTop: 25,
        }}
      />
      {renderContentIntro()}
    </ScrollView>
  )
}

export default IntroHome

const styles = StyleSheet.create({})

export const NewsItem = ({ item, index, isHome }: any) => {
  return (
    <DebounceButton
      style={{ marginTop: 12 }}
      onPress={() => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
          type: 2,
          item,
          id: item.id,
        })
      }}
      children={
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.white,
            paddingHorizontal: 16,
            paddingVertical: !isHome ? 19 : undefined,
            marginTop: index ? 12 : 0,
          }}
        >
          <FstImage
            style={{
              width: 147 * scale,
              height: 98 * scale,
              borderRadius: 8,
            }}
            source={
              item?.image_url ? { uri: item?.image_url } : R.images.image_logo
            }
            resizeMode="cover"
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ ...fonts.medium14 }} children={item.title} />
            <Text
              style={{ ...fonts.regular12, color: '#69747E', marginTop: 5 }}
              numberOfLines={3}
              children={item?.description || item.shortDescription}
            />
          </View>
        </View>
      }
    />
  )
}
