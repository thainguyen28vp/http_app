import React, { useState, useEffect, useRef, memo } from 'react'
import R from '@app/assets/R'
import { useAppSelector } from '@app/store'
import { colors, fonts, styleView } from '@app/theme'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'

const OrderCustomTopTab = (props: any) => {
  const { tabs, activeTab, goToPage, initialTab } = props
  const { data } = useAppSelector(state => state.OrderReducer)
  const [currentTab, setCurrentTab] = useState<number>(activeTab)

  const listRef = useRef<FlatList>(null)
  const listOffset = useRef<Array<number>>([])

  const handleScrollOnChangeTab = (tab: number) => {
    const offset = listOffset.current
      .filter(item => listOffset.current.indexOf(item) < tab)
      .reduce((acc, curr) => acc + curr, 0)
    listRef.current?.scrollToOffset({
      offset: offset != 0 ? offset - 100 : offset,
      animated: true,
    })
  }

  useEffect(() => {
    setCurrentTab(activeTab)
  }, [activeTab])

  useEffect(() => {
    handleScrollOnChangeTab(currentTab)
    goToPage(currentTab)
  }, [currentTab])

  useEffect(() => {
    !!initialTab && setCurrentTab(initialTab)
  }, [initialTab])
  const renderTabItem: ListRenderItem<string> = ({ item, index }) => {
    const isActiveTab = activeTab == index
    const badgeCount = data[0].orderData.length
    const badgeIcon =
      badgeCount && index == 0 ? (
        <View style={styles.badgeView}>
          <Text
            style={{ ...fonts.regular10, color: colors.white }}
            children={badgeCount}
          />
        </View>
      ) : null

    return (
      <TouchableOpacity
        key={index}
        onLayout={({ nativeEvent }) => {
          const { width } = nativeEvent.layout
          if (listOffset.current.length < tabs.length) {
            listOffset.current.push(width)
          }
        }}
        onPress={() => setCurrentTab(index)}
        children={
          <View style={styles.tab}>
            <View>
              {badgeIcon}
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
            {isActiveTab && (
              <View
                style={{
                  width: '40%',
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: colors.primary,
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            )}
          </View>
        }
      />
    )
  }

  return (
    <View style={styles.tabs}>
      <FlatList
        style={{ height: 45, backgroundColor: colors.white, width: '100%' }}
        contentContainerStyle={{ paddingRight: 5 }}
        ref={listRef}
        horizontal
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
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  badgeView: {
    ...styleView.centerItem,
    position: 'absolute',
    top: -10,
    right: -20,
    width: 18,
    height: 18,
    backgroundColor: colors.primary,
    borderRadius: 9,
  },
})

export default memo(OrderCustomTopTab, isEqual)
