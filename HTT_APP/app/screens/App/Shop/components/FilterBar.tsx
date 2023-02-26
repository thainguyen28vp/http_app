import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import React, { memo, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { updateResetFilter } from '../slice/ShopSlice'

const { width } = dimensions

interface FilterBarProps {
  onFilterSelect: (filter: FilterSelect) => void
}

enum FILTER_OPTION {
  TIME = 0,
  TOP_SELL,
  PRICE_ORDER,
}

export type FilterSelect = {
  time?: number
  topSell?: number
  priceOrder?: number
}

const FilterBar = ({ onFilterSelect }: FilterBarProps) => {
  const { resetFilter } = useAppSelector(state => state.ShopReducer)
  const Dispatch = useAppDispatch()

  const [filterSelect, setFilterSelect] = useState<FilterSelect>({
    time: undefined,
    topSell: undefined,
    priceOrder: undefined,
  })

  const handleOnSelect = (option: number) => {
    if (option == FILTER_OPTION.TIME) {
      if (filterSelect.time == undefined) {
        onFilterSelect({ time: 1, topSell: undefined, priceOrder: undefined })
        setFilterSelect({ time: 1, topSell: undefined, priceOrder: undefined })
      } else {
        onFilterSelect({
          time: undefined,
          topSell: undefined,
          priceOrder: undefined,
        })
        setFilterSelect(prev => ({ ...prev, time: undefined }))
      }
    } else if (option == FILTER_OPTION.TOP_SELL) {
      if (filterSelect.topSell == undefined) {
        onFilterSelect({ time: undefined, topSell: 1, priceOrder: undefined })
        setFilterSelect({ topSell: 1, time: undefined, priceOrder: undefined })
      } else {
        onFilterSelect({
          time: undefined,
          topSell: undefined,
          priceOrder: undefined,
        })
        setFilterSelect(prev => ({ ...prev, topSell: undefined }))
      }
    } else {
      if (filterSelect.priceOrder == undefined) {
        onFilterSelect({ time: undefined, topSell: undefined, priceOrder: 1 })
        setFilterSelect({ priceOrder: 1, time: undefined, topSell: undefined })
      } else if (filterSelect.priceOrder == 1) {
        onFilterSelect({ time: undefined, topSell: undefined, priceOrder: 2 })
        setFilterSelect(prev => ({ ...prev, priceOrder: 2 }))
      } else {
        onFilterSelect({
          time: undefined,
          topSell: undefined,
          priceOrder: undefined,
        })
        setFilterSelect(prev => ({ ...prev, priceOrder: undefined }))
      }
    }
  }

  useEffect(() => {
    if (resetFilter) {
      setFilterSelect({
        time: undefined,
        topSell: undefined,
        priceOrder: undefined,
      })
      Dispatch(updateResetFilter(false))
    }
  }, [resetFilter])

  return (
    <View
      style={{
        position: 'relative',
        height: 44,
        backgroundColor: colors.white,
        ...styleView.rowItemBetween,
        alignItems: 'center',
      }}
    >
      <Button
        onPress={() => handleOnSelect(FILTER_OPTION.TIME)}
        style={{ flex: 1, ...styleView.centerItem }}
        children={
          <View style={{ flex: 1, ...styleView.centerItem }}>
            <Text
              style={{
                ...fonts.regular14,
                color: !!filterSelect.time ? colors.primary : '#444444',
              }}
              children={'Mới nhất'}
            />
            {!!filterSelect.time && <View style={styles.activeLine} />}
          </View>
        }
      />
      <View style={{ width: 1, height: 19, backgroundColor: '#CED4DA' }} />
      <Button
        onPress={() => handleOnSelect(FILTER_OPTION.TOP_SELL)}
        style={{ flex: 1, ...styleView.centerItem }}
        children={
          <View style={{ flex: 1, ...styleView.centerItem }}>
            <Text
              style={{
                ...fonts.regular14,
                color: !!filterSelect.topSell ? colors.primary : '#444444',
              }}
              children={'Bán chạy'}
            />
            {!!filterSelect.topSell && <View style={styles.activeLine} />}
          </View>
        }
      />
      <View style={{ width: 1, height: 19, backgroundColor: '#CED4DA' }} />
      <Button
        onPress={() => handleOnSelect(FILTER_OPTION.PRICE_ORDER)}
        style={{ flex: 1, ...styleView.centerItem }}
        children={
          <View
            style={{
              ...styleView.rowItem,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                ...fonts.regular14,
                color: !!filterSelect.priceOrder ? colors.primary : '#444444',
              }}
              children={'Giá bán'}
            />
            <FastImage
              style={{ width: 16, height: 16, marginLeft: 4 }}
              tintColor={!!filterSelect.priceOrder ? colors.primary : '#444444'}
              source={
                !filterSelect.priceOrder
                  ? R.images.ic_up_down
                  : filterSelect.priceOrder == 1
                  ? R.images.ic_arrow_down
                  : R.images.ic_arrow_up
              }
            />
            {!!filterSelect.priceOrder && <View style={styles.activeLine} />}
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  activeLine: {
    width: width / 3,
    height: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 0,
  },
})

export default memo(FilterBar, isEqual)
