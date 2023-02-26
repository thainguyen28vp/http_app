import { fonts, styleView } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import React, { useCallback } from 'react'
import { View, Text, FlatList, ListRenderItem } from 'react-native'

const OrderHistoryState = ({ data }: any) => {
  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
      <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
        <Text
          style={{ ...fonts.regular16, color: '#373E50', width: 130 }}
          numberOfLines={1}
          children={item.DFOrderStatusHistory.describe}
        />
        <View
          style={{
            backgroundColor: '#D5A227',
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 30,
          }}
        />
        <Text
          style={{ ...fonts.regular15, color: '#69747E' }}
          children={DateUtil.formatTimeDate(item.create_at)}
        />
      </View>
    )
  }

  const renderItemSeparator = useCallback(
    () => (
      <View
        style={{
          width: 1,
          height: 23,
          backgroundColor: '#D0DBEA',
          marginLeft: 134.5,
        }}
      />
    ),
    []
  )

  return (
    <FlatList
      style={{ marginTop: 18 }}
      data={data}
      ItemSeparatorComponent={renderItemSeparator}
      keyExtractor={(_, index) => `${index}`}
      renderItem={renderItem}
    />
  )
}

export default OrderHistoryState
