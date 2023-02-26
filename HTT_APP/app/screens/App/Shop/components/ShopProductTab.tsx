import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import ProductItem from '@app/components/ProductItem'
import { dimensions } from '@app/theme'
import React, { useCallback } from 'react'
import { FlatList, StyleSheet, View, Animated } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import FilterBar from './FilterBar'

const { height } = dimensions
const FILTER_BAR_HEIGHT = 44

const ShopProductTab = (props: any) => {
  const { data, isLoading, onRefresh, onFilterSelect } = props
  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList)

  const minScroll = 100
  const scrollY = new Animated.Value(0)

  const clampedScrollY = scrollY.interpolate({
    inputRange: [minScroll, minScroll + 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
  })

  const minusScrollY = Animated.multiply(clampedScrollY, -1)
  const _filter_bar_translateY = Animated.diffClamp(
    minusScrollY,
    -FILTER_BAR_HEIGHT,
    0
  )

  const onFilterSelectChange = useCallback(filter => {
    onFilterSelect(filter)
  }, [])

  const renderListProduct = () => {
    if (isLoading) return <Loading />

    return (
      <AnimatedFlatlist
        data={data.rows}
        contentInset={{
          top: FILTER_BAR_HEIGHT,
        }}
        contentOffset={{
          x: 0,
          y: -FILTER_BAR_HEIGHT,
        }}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        progressViewOffset={FILTER_BAR_HEIGHT}
        overScrollMode="never"
        style={{ zIndex: -1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: isIphoneX() ? 20 : 0,
        }}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item, index }) => (
          <ProductItem item={item} index={index} />
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        ListEmptyComponent={
          <Empty
            imageStyle={{ height: height / 4 }}
            backgroundColor={'transparent'}
          />
        }
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.filterBar,
          {
            transform: [{ translateY: _filter_bar_translateY }],
          },
        ]}
        children={<FilterBar onFilterSelect={onFilterSelectChange} />}
      />
      {renderListProduct()}
    </View>
  )
}

const styles = StyleSheet.create({
  filterBar: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
})

export default ShopProductTab
