import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { callAPIHook } from '@app/utils/CallApiHelper'
import Empty from '@app/components/Empty/Empty'
import RNHeader from '@app/components/RNHeader'
import { SearchBar } from 'react-native-elements'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import {
  getListReceiver,
  requestDeleteUserAddress,
} from '@app/service/Network/shop/ShopApi'
import debounce from 'lodash.debounce'
import { Customer } from './model/Customer'
import { useNavigation } from '@react-navigation/core'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import reactotron from 'ReactotronConfig'

const { width } = dimensions

const SelectReceiverScreen = (props: any) => {
  const accountSign = props.route.params?.accountSign
  const reloadList = props.route.params?.reloadList
  const giftSign = props.route.params?.giftSign
  const selectReceiver = props.route.params?.selectReceiver
  const selectUserAddress = props.route.params?.selectUserAddress
  const setVisible = props.route.params?.setVisible

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listReceiver, setListReceiver] = useState<any>()
  const [textSearch, setTextSearch] = useState<string>('')
  const [enableEdit, setEnableEdit] = useState<boolean>(false)

  const [filteredData, setFilteredData] = useState<Array<any>>()

  const navigation = useNavigation()

  const id = props.route.params?.id

  const titleHeader = accountSign
    ? 'Danh sách địa chỉ'
    : enableEdit
    ? 'Sửa thông tin'
    : 'Chọn người nhận'

  const getData = (search?: string) => {
    callAPIHook({
      API: getListReceiver,
      payload: { search },
      useLoading: typeof search == 'string' ? undefined : setIsLoading,
      onSuccess: res => {
        setListReceiver(res.data)
        setFilteredData(res.data)
        reloadList()
      },
    })
  }

  const handleDeleteAddress = async (id: number) => {
    callAPIHook({
      API: requestDeleteUserAddress,
      payload: id,
      onSuccess: res => {
        showMessages('', 'Xoá địa chỉ thành công!', getData)
        selectReceiver(undefined)
      },
    })
  }

  const handleSearch = (value: String) => {
    let text = value.toLowerCase()
    let filteredData = listReceiver.filter(function (item: any) {
      if (item.name.toLowerCase().includes(text)) {
        return true
      }
      return false
    })
    setFilteredData(filteredData)
  }

  useEffect(() => {
    getData()
  }, [id])

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: !enableEdit })
  }, [enableEdit])

  const _inforItem = ({ item, index }: { item: Customer; index: number }) => {
    return (
      <Button
        key={index}
        disabled={enableEdit ? false : !!accountSign}
        onLongPress={() => {
          showConfirm('', 'Bạn có chắc chắn muốn xoá địa chỉ này không!', () =>
            handleDeleteAddress(item.id)
          )
        }}
        onPress={() => {
          if (enableEdit) {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
              id: item.id,
              reloadList: getData,
              itemInfoReciver: item,
            })
          } else {
            if (giftSign) {
              selectUserAddress(item)
              setVisible()
            } else selectReceiver(item)
            NavigationUtil.goBack()
          }
        }}
        children={
          <View style={styles.inforContainer}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ ...fonts.regular16, marginBottom: 6 }}
                children={`${item.name} 〡 ${item?.phone_number}`}
              />
              <Text
                style={{ ...fonts.regular14, color: '#69747E', flex: 1 }}
                children={`${item.address}, ${item?.ward.name}, ${item?.district?.name}, ${item?.province?.name}`}
              />
            </View>
            <FastImage
              style={{ width: 20, height: 20, marginLeft: 5 }}
              source={R.images.ic_map_fill}
              tintColor={item.is_default ? colors.primary : '#69747E'}
            />
          </View>
        }
      />
    )
  }

  const header = () => {
    return (
      <RNHeader
        back={!enableEdit ? true : false}
        color={colors.black}
        backgroundHeader={colors.white}
        borderBottomHeader={colors.white}
        titleHeader={titleHeader}
        rightComponent={
          <Button
            onPress={() => setEnableEdit(prev => !prev)}
            children={
              enableEdit ? (
                <FastImage
                  style={{ width: 20, height: 20 }}
                  source={R.images.ic_tick}
                  tintColor={colors.primary}
                />
              ) : (
                <Text
                  style={{ ...fonts.regular15, color: colors.primary }}
                  children={'Sửa'}
                />
              )
            }
          />
        }
      />
    )
  }

  return (
    <ScreenWrapper
      unsafe
      color={colors.black}
      backgroundHeader={colors.white}
      isLoading={isLoading}
      header={header()}
    >
      <View style={{ backgroundColor: 'white', paddingBottom: 8 }}>
        <View
          style={{
            height: 40,
            borderRadius: 50,
            marginHorizontal: 20,
            backgroundColor: '#F1F3F5',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 20, height: 20, marginHorizontal: 10 }}
            source={R.images.ic_search}
          />
          <TextInput
            placeholder="Nhập tên người nhận"
            style={{ flex: 1, paddingRight: 8 }}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {!enableEdit && (
        <Button
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
              reloadList: getData,
              // getDataInfoPayment: () => props.route.params.getData(),
            })
          }
          children={
            <View style={styles.addReceiverView}>
              <Text style={{ ...fonts.regular16, color: colors.primary }}>
                Thêm người nhận
              </Text>
              <FastImage
                style={{ width: 24, height: 24 }}
                source={R.images.ic_add}
                tintColor={colors.primary}
              />
            </View>
          }
        />
      )}
      <FlatList
        data={filteredData?.length ? filteredData : listReceiver}
        refreshing={isLoading}
        onRefresh={getData}
        renderItem={_inforItem}
        keyExtractor={(_, index) => `${index}`}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    ...styleView.centerItem,
    marginTop: 2,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  inforContainer: {
    ...styleView.rowItemBetween,
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 2,
  },
  addReceiverView: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    marginTop: 2,
  },
  search: {
    backgroundColor: '#F1F3F5',
    marginTop: 0,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
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
  input_container: {
    marginLeft: 0,
    backgroundColor: '#F1F3F5',
    borderRadius: 50,
    borderWidth: 0,
    width: width - 30,
  },
})

export default SelectReceiverScreen
