import { handlePrice } from '@app/utils/FuncHelper'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

const ListProductHoziron = ({
  data,
  onPressItem,
}: {
  data: []
  onPressItem: (item: any) => void
}) => {
  return (
    <FlatList
      style={styles.vListProductHozi}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={styles.vBtnItem}
            onPress={() => {
              onPressItem(item)
            }}
            children={
              <View style={styles.vContentItem}>
                <FastImage
                  source={{ uri: item.media_url }}
                  style={styles.imgProductItem}
                />
                <View style={styles.vContentText}>
                  <Text
                    style={styles.txtNameProduct}
                    children={item.code_product_livestream || item.name}
                  />
                  <Text
                    style={styles.txtPriceItem}
                    children={handlePrice(item.min_max_price)}
                  />
                </View>
              </View>
            }
          />
        )
      }}
    />
  )
}

export default ListProductHoziron
