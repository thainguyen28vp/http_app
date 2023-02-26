import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import React, { memo, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import FstImage from '@app/components/FstImage/FstImage'
import { colors } from '@app/theme'
import { SearchBar, Header } from 'react-native-elements'

const { width, height } = Dimensions.get('window')
const isEqual = require('react-fast-compare')
const data = ['alo', 'alo']

const ReceiverInfoScreenWrapper = () => {
  const [searchText, setSearchText] = useState('')

  const renderItem = ({
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
    // const lastName = !!item.user_infos.last_name ? item.user_infos.last_name : 'Chu'
    return (
      <>
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 16,
            marginTop: 1,
          }}
        >
          <Text
            style={{
              fontFamily: R.fonts.sf_regular,
              fontSize: 16,
              color: colors.colorDefault.text,
            }}
            children={'Nguyễn Minh Quang  |  0795296216'}
          />
          <View style={{ flexDirection: 'row', marginTop: 7 }}>
            <Text
              style={{
                fontFamily: R.fonts.sf_regular,
                fontSize: 15,
                flex: 1,
                color: '#69747E',
              }}
              children={'Five Star, Số 2 Kim Giang, Thanh Xuân, Hà Nội'}
            />

            <FstImage
              resizeMode="contain"
              style={{ width: 20, height: 20, marginLeft: 60 }}
              source={R.images.ic_location2}
            />
          </View>
        </View>
      </>
    )
  }
  const renderBody = () => {
    return (
      <>
        <SearchBar
          searchIcon={
            <>
              <FstImage
                resizeMode="contain"
                style={{ width: 20, height: 20, marginLeft: 10 }}
                source={R.images.ic_search}
              />
            </>
          }
          //  searchIcon={R.images.ic_delete}
          placeholder="Tìm kiếm người nhận"
          value={searchText}
          containerStyle={styles.container_search}
          inputContainerStyle={styles.input_container}
          // inputStyle={styles.input}
          onChangeText={text => {
            //setPage(1)
            setSearchText(text)
          }}
          onClear={() => {
            setSearchText('')
            //setData([])
          }}
          autoFocus
        />
        <FlatList
          //  style={{ marginHorizontal: 15 }}
          // onRefresh={getData}
          refreshing={false}
          //    ListEmptyComponent={<Empty description={R.strings().empty2} />}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </>
    )
  }

  return (
    <ScreenWrapper
      back
      titleHeader={'Thông tin người nhận'}
      children={
        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }}>
          <View style={styles.line2} />
          {renderBody()}
        </View>
      }
    />
  )
}
const styles = StyleSheet.create({
  container_search: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  line1: {
    backgroundColor: '#E5E5E5',
    height: 1,
  },
  line2: {
    backgroundColor: '#E5E5E5',
    height: 1.5,
  },
  input_container: {
    marginLeft: 0,
    backgroundColor: '#F1F3F5',
    borderRadius: 50,
    borderWidth: 0,
    width: width - 30,
  },
})

const ReceiverInfoScreen = memo(ReceiverInfoScreenWrapper, isEqual)
export default ReceiverInfoScreen
