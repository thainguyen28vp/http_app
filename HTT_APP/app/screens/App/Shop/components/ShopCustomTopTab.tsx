import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native'

const { width } = dimensions

const ShopCustomTopTab = (props: any) => {
  const { tabs, activeTab, goToPage, initialTab } = props

  const renderTabItem: ListRenderItem<string> = ({ item, index }) => {
    const isActiveTab = activeTab == index

    return (
      <TouchableOpacity
        key={index}
        onPress={() => goToPage(index)}
        children={
          <View style={styles.tab}>
            <Text
              style={{
                ...fonts.regular16,
                color: isActiveTab ? colors.primary : colors.black,
                fontFamily: isActiveTab
                  ? R.fonts.sf_semi_bold
                  : R.fonts.sf_regular,
              }}
              children={item}
            />
          </View>
        }
      />
    )
  }

  return (
    <View style={styles.tabs}>
      <FlatList
        style={{ flex: 1, backgroundColor: colors.white, width }}
        horizontal
        scrollEnabled={false}
        data={tabs}
        renderItem={renderTabItem}
        keyExtractor={(_, index) => `${index}`}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tab: {
    ...styleView.centerItem,
    flex: 1,
    width: width / 4,
    textAlign: 'center',
  },
  tabs: {
    height: 44,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
})

export default ShopCustomTopTab
