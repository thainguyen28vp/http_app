import RadioButton from '@app/components/RadioButton'
import RNHeader from '@app/components/RNHeader'
import { FILTER_TYPE } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions } from '@app/theme'
import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import reactotron from 'ReactotronConfig'
import { updateFilter } from './slice/FilterSlice'
import styles from './styles/stylesFilterSearch'

const scale = dimensions.width / 375

const FilterSearch = (props: any) => {
  const appDispatch = useAppDispatch()
  const FilterReducer = useAppSelector(state => state.FilterReducer)
  const { childIdCate, childNameCate } = props.route.params
  const { data }: any = FilterReducer
  const [sell, setSell] = useState(data?.sell || undefined)
  const [time, setTime] = useState(data?.time || undefined)
  const [price, setPrice] = useState(data?.price || undefined)
  const [listStar, setListStar] = useState<any>([])
  const [selectStar, setSelectStar] = useState<any>(data.star || undefined)

  const getStar = () => {
    let arrStar = Array(5)
      .fill(0)
      .map((itm, idx) => {
        return (itm = {
          id: idx + 1,
          name: `${idx + 1} sao`,
        })
      })
    setListStar(arrStar)
  }
  useEffect(() => {
    getStar()
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <RNHeader
        titleHeader="Lọc nâng cao"
        back
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setSell(undefined)
              setTime(undefined)
              setPrice(undefined)
              setSelectStar(undefined)
              appDispatch(
                updateFilter({
                  childIdCate,
                  sell: 0,
                  time: 0,
                  price: 0,
                  star: undefined,
                })
              )
            }}
          >
            <Text children={'Đặt lại'} />
          </TouchableOpacity>
        }
        borderBottomHeader="#CED4DA"
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: '10%',
        }}
      >
        <View style={styles.v_major}>
          <View style={styles.v_major_content}>
            <Text style={styles.txt_major}>Danh mục</Text>
            <View style={styles.v_arrow}>
              <Text
                style={[
                  styles.txt_arrow,
                  {
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                {childNameCate || 'Tất cả'}
              </Text>
              {/* <Image style={styles.img24} source={R.images.ic_arrow_right} /> */}
            </View>
          </View>
        </View>

        <View style={styles.v_sort}>
          <Text style={[styles.txt_major, { paddingLeft: 15 * scale }]}>
            Sắp xếp theo
          </Text>
        </View>

        <View style={styles.v_type}>
          <RadioButton
            style={{ marginTop: 12 }}
            isCheck={sell == FILTER_TYPE.SELL_MANY}
            title={'Bán nhiều nhất'}
            onPress={() => {
              if (sell == FILTER_TYPE.SELL_MANY) {
                setSell(undefined)
                return
              }
              setSell(FILTER_TYPE.SELL_MANY)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={sell == FILTER_TYPE.SELL_LITTLE}
            title={'Bán ít nhất'}
            onPress={() => {
              if (sell == FILTER_TYPE.SELL_LITTLE) {
                setSell(undefined)
                return
              }
              setSell(FILTER_TYPE.SELL_LITTLE)
            }}
          />
          <View style={styles.viewLine}></View>
        </View>

        <View style={[styles.v_type, { marginTop: 16 }]}>
          <RadioButton
            style={{}}
            isCheck={time == FILTER_TYPE.TIME_NEW_OLD}
            title={'Mới nhất'}
            onPress={() => {
              if (time == FILTER_TYPE.TIME_NEW_OLD) {
                setTime(undefined)
                return
              }
              setTime(FILTER_TYPE.TIME_NEW_OLD)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={time == FILTER_TYPE.TIME_OLD_NEW}
            title={'Cũ nhất'}
            onPress={() => {
              if (time == FILTER_TYPE.TIME_OLD_NEW) {
                setTime(undefined)
                return
              }
              setTime(FILTER_TYPE.TIME_OLD_NEW)
            }}
          />
          <View style={styles.viewLine}></View>
        </View>

        <View style={[styles.v_type, { marginTop: 16 }]}>
          <RadioButton
            style={{}}
            isCheck={price == FILTER_TYPE.PRICE_MIN_MAX}
            title={'Giá: Từ thấp tới cao'}
            onPress={() => {
              if (price == FILTER_TYPE.PRICE_MIN_MAX) {
                setPrice(undefined)
                return
              }
              setPrice(FILTER_TYPE.PRICE_MIN_MAX)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={price == FILTER_TYPE.PRICE_MAX_MIN}
            title={'Giá: Từ cao tới thấp'}
            onPress={() => {
              if (price == FILTER_TYPE.PRICE_MAX_MIN) {
                setPrice(undefined)
                return
              }
              setPrice(FILTER_TYPE.PRICE_MAX_MIN)
            }}
          />
        </View>

        <View style={[styles.v_sort, { marginTop: 16 }]}>
          <Text style={[styles.txt_major, { paddingLeft: 15 * scale }]}>
            Sắp xếp theo
          </Text>
        </View>

        <View style={styles.v_main_star}>
          {listStar.map((itm: any, idx: number) => (
            <TouchableOpacity
              style={[
                styles.v_star,
                {
                  marginTop: 15,
                  marginRight: 10,
                  backgroundColor:
                    selectStar == itm.id ? colors.primary : '#F3F3F3',
                },
              ]}
              onPress={() => {
                if (idx + 1 === itm.id) return setSelectStar(itm.id)
                setSelectStar(itm.id)
              }}
            >
              <Text
                style={[
                  styles.txt_star,
                  { color: selectStar == itm.id ? colors.white : '#595959' },
                ]}
              >
                {itm.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          appDispatch(
            updateFilter({
              sell,
              time,
              price,
              childIdCate,
              star: selectStar,
            })
          )
          NavigationUtil.goBack()
        }}
        style={styles.btn_bottom}
      >
        <Text style={styles.txt_btn}>Áp dụng</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FilterSearch
