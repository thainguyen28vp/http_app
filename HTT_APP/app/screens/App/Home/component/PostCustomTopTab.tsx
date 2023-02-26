import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import R from '@app/assets/R'
import { colors, dimensions, fonts } from '@app/theme'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ListRenderItem,
} from 'react-native'
import isEqual from 'react-fast-compare'
import FastImage from 'react-native-fast-image'
import { SearchBar } from 'react-native-elements'
import { debounce } from 'lodash'

const { width } = dimensions

const PostCustomTopTab = (props: any) => {
  const { tabs, activeTab, goToPage, initialTab, onSearch } = props
  const [textSearch, setTextSearch] = useState<string>('')
  const [currentTab, setCurrentTab] = useState<number>(activeTab)

  const listRef = useRef<FlatList>(null)
  const listOffset = useRef<Array<number>>([])

  const onSearchText = useCallback(
    debounce(text => onSearch!(text), 300),
    []
  )

  const handleScrollOnChangeTab = (tab: number) => {
    const offset = listOffset.current
      .filter(item => listOffset.current.indexOf(item) < tab)
      .reduce((acc, curr) => acc + curr, 0)
    listRef.current?.scrollToOffset({
      offset: offset != 0 ? offset - 150 : offset,
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

    return (
      <TouchableOpacity
        onLayout={({ nativeEvent }) => {
          const { width } = nativeEvent.layout
          if (listOffset.current.length < tabs.length) {
            listOffset.current.push(width)
          }
        }}
        key={index}
        onPress={() => setCurrentTab(index)}
        children={
          <View style={styles.tab}>
            <View>
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
      <SearchBar
        searchIcon={
          <FastImage
            resizeMode="contain"
            style={{ width: 24, height: 24, marginLeft: 10 }}
            source={R.images.ic_search}
          />
        }
        placeholder="Tìm kiếm bài đăng"
        value={textSearch}
        containerStyle={styles.container_search}
        inputContainerStyle={styles.input_container}
        onChangeText={text => {
          setTextSearch(text)
          !!onSearch && onSearchText(text)
        }}
        onClear={() => {
          setTextSearch('')
        }}
        // autoFocus
      />
      <FlatList
        style={{ height: 45, backgroundColor: colors.white, width: '100%' }}
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
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  container_search: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 2,
  },
  input_container: {
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 1,
    borderBottomWidth: 1,
    width: width - 30,
    borderColor: '#D0DBEA',
  },
})

export default memo(PostCustomTopTab, isEqual)
