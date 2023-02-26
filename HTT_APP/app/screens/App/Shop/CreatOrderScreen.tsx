import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import React, { memo } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import FstImage from '@app/components/FstImage/FstImage'
import { colors, fonts, styleView } from '@app/theme'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Button } from '@app/components/Button/Button'
const isEqual = require('react-fast-compare')
const data = ['alo', 'alo']
const data1 = ['alo']
const data2 = ['alo', 'alo']
const CreatOrderScreenWrapper = () => {
  const renderItemProduction = ({
    item,
    index,
  }: {
    item: {
      user_infos: any
      insert_date: any
      push_category: number
      content: string
    }
    index: number
  }) => {
    return (
      <View>
        <View style={styles.v_product}>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 30,
              paddingBottom: 18,
              paddingRight: 34,
            }}
          >
            <FstImage
              source={R.images.img_product}
              resizeMode="contain"
              style={[styles.img_product]}
            />
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <Text style={styles.name_stote} children={'Ultra boost 2021'} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[styles.name_ware_house, { flex: 1 }]}
                  children={'xanh dương  |  41'}
                />
                <Text
                  style={[styles.name_ware_house, { color: '#69747E' }]}
                  children={'x2'}
                />
              </View>
              <Text
                style={[styles.name_stote, { color: '#F03E3E' }]}
                children={'720.000d'}
              />
            </View>
          </View>

          <View style={styles.line1} />
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.CHOOSE_RECEIVER)
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              paddingTop: 11,
              paddingLeft: 15,
              paddingBottom: 8,
            }}
          >
            <FstImage
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
              source={R.images.ic_location}
            />
            <View style={{ marginLeft: 16, flex: 1, marginRight: 15 }}>
              <Text
                style={styles.name_ware_house}
                children={R.strings().receiver_info}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 7,
                }}
              >
                <Text
                  style={[
                    styles.name_ware_house,
                    { flex: 1, color: '#69747E' },
                  ]}
                  children={'Five Star, Số 2 Kim Giang,Thanh Xuân, Hà Nội'}
                />

                <FstImage
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginLeft: 32 }}
                  source={R.images.ic_arrow_right}
                />
              </View>
              <Text
                style={[styles.name_ware_house, { marginTop: 7 }]}
                children={'Nguyễn Minh Quang | 0795296216'}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.v_header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FstImage
              resizeMode="contain"
              style={styles.img_store}
              source={R.images.img_store}
            />
            <Text
              style={styles.name_stote}
              children={'Xưởng giầy thể thao Thượng Đình'}
            />
          </View>
          <Text
            style={[styles.name_ware_house, { marginTop: 12 }]}
            children={'Kho Thanh Xuân'}
          />
        </View>
      </>
    )
  }

  const renderFoooter = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 12,
          }}
        >
          <Text
            style={[styles.name_ware_house, { flex: 1 }]}
            children={R.strings().sum_price}
          />
          <Text
            style={[styles.name_stote, { color: '#F03E3E' }]}
            children={'720.000d'}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 12,
            marginTop: 2,
          }}
        >
          <FstImage
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
            source={R.images.ic_code_promotion}
          />
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={[styles.name_ware_house]}
                children={R.strings().code_promotion}
              />
              <Text
                style={[
                  styles.name_ware_house,
                  { color: '#69747E', marginTop: 4 },
                ]}
                children={'Chọn hoặc nhập mã khuyến mãi'}
              />
            </View>
            <TouchableOpacity>
              <FstImage
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
                source={R.images.ic_arrow_right}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }

  const renderBody = () => {
    return (
      <FlatList
        ListHeaderComponent={renderHeader()}
        // onRefresh={getData}
        refreshing={false}
        //    ListEmptyComponent={<Empty description={R.strings().empty2} />}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemProduction}
        ListFooterComponent={renderFoooter()}
      />
    )
  }

  const renderBottom = () => {
    return (
      <View style={styles.bottomView}>
        <View>
          <Text
            style={{ ...fonts.regular14, marginBottom: 4 }}
            children={'Tổng tiền'}
          />
          <Text
            style={{ ...fonts.semi_bold16, color: colors.primary }}
            children={`3.000.000đ`}
          />
        </View>
        <Button
          disabled={data?.length == 0}
          style={[styles.btnOrder]}
          onPress={() => {
            // if (!totalPrice) showMessages('', 'Chưa chọn sản phẩm')
            NavigationUtil.navigate(SCREEN_ROUTER_APP.CREATE_ORDER)
          }}
          children={
            <Text
              style={{
                ...fonts.semi_bold16,
                color: colors.white,
              }}
            >
              {R.strings().order}
            </Text>
          }
        />
      </View>
    )
  }
  return (
    <ScreenWrapper
      back
      unsafe
      titleHeader={R.strings().order}
      children={
        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }}>
          <View style={styles.line1} />
          {renderBody()}
          {renderBottom()}
        </View>
      }
    />
  )
}
const styles = StyleSheet.create({
  v_header: {
    paddingVertical: 13,
    paddingLeft: 15,
    backgroundColor: 'white',
    marginVertical: 2,
  },
  name_stote: {
    color: colors.colorDefault.text,
    fontFamily: R.fonts.sf_semi_bold,
    fontSize: 16,
  },
  img_store: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  v_warehouse: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ic_check: {
    width: 22,
    height: 22,
  },
  name_ware_house: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 16,
    color: colors.colorDefault.text,
  },
  v_product: {
    backgroundColor: 'white',
    paddingTop: 16,
  },
  img_product: {
    width: 78,
    height: 78,
    borderRadius: 5,
    marginRight: 16,
  },
  v_contain_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  btn_decrease: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  btn_increase: {
    width: 28,
    height: 28,
    marginLeft: 12,
  },
  btn_delete: {
    width: 28,
    height: 28,
  },
  line1: {
    backgroundColor: '#E5E5E5',
    height: 2,
  },
  line2: {
    backgroundColor: '#E5E5E5',
    height: 5,
  },
  v_bottom: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowRadius: 2,
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: -1.5,
    },
    shadowColor: '#000000',
    elevation: 1,
  },
  v_button: {
    width: 159,
    height: 50,
    backgroundColor: '#F03E3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  bottomView: {
    ...styleView.rowItemBetween,
    width: '100%',
    height: 65 + getBottomSpace(),
    padding: 20,
    backgroundColor: colors.white,
    bottom: 0,
    alignItems: 'center',
  },
  btnOrder: {
    ...styleView.centerItem,
    width: 159,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
})

const CreatOrderScreen = memo(CreatOrderScreenWrapper, isEqual)
export default CreatOrderScreen
