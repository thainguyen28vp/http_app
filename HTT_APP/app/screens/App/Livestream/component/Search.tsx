import R from '@app/assets/R'
import { fonts } from '@app/theme'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import FastImage from 'react-native-fast-image'

const SearchList = ({
  onChangeText,
}: {
  onChangeText: (input: string) => void
}) => {
  return (
    <View style={styles.vSearch}>
      <FastImage
        source={R.images.ic_search}
        style={{ width: 20, height: 20 }}
      />
      <TextInput
        style={{
          width: '90%',
          height: 40,
          ...fonts.regular16,
          marginLeft: 10,
        }}
        placeholder={'Tìm kiếm sản phẩm'}
        onChangeText={onChangeText}
      />
    </View>
  )
}

export default SearchList

const styles = StyleSheet.create({
  vSearch: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D0DBEA',
    borderRadius: 50,
    alignItems: 'center',
    paddingLeft: 20,
    marginHorizontal: 15,
    marginTop: 5,
  },
})
