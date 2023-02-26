import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import ShopSearchBar from '../App/Shop/components/ShopSearchBar'
import { requestGetListShop, requestRegister } from './AuthApi'
const scale = WIDTH / 375
let arrID: any = []

const ListShopFollowScreen = (props: any) => {
  const { device_id, data, avatarUrl } = props.route.params
  const [listShop, setStateListShop] = useState([])
  const [filteredData, setFilteredData] = useState<Array<any>>()
  const [isLoading, setStateIsLoading] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const getListShop = async () => {
    let tempData: any = []
    try {
      const res = await requestGetListShop()
      if (res.status != 0) {
        res.data.map((item: any) => {
          arrID?.push(item.id)
          tempData.push({
            ...item,
            isCheck: true,
          })
        })
        setStateListShop(tempData)
        //   onPressShopFollow(arrID)
      }
    } catch (error) {
      setStateIsLoading(false)
    }
  }

  const onPressShop = (item: any) => {
    listShop.map((elm: any) => {
      if (item.id == elm.id) {
        elm.isCheck = !elm.isCheck
        if (elm.isCheck) {
          arrID?.push(elm.id)
        } else {
          arrID.splice(arrID.indexOf(elm.id), 1)
        }
      }
    })
    setStateIsLoading(prev => !prev)
  }

  const handleRgister = () => {
    const formData: any = new FormData()
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('email', data.email)
    formData.append('code', data.referral_code)
    formData.append('password', data.password)
    formData.append('device_id', device_id)
    if (avatarUrl) {
      formData.append('profile_picture', {
        name: `images${new Date().getTime()}.png`,
        type: 'image/jpeg',
        filename: 'image.png',
        uri: avatarUrl,
      })
    }
    arrID.forEach((itm: any) => {
      formData.append('shop_id', itm)
    })
    callAPIHook({
      API: requestRegister,
      payload: formData,
      useLoading: setDialogLoading,
      onSuccess: res => {
        AsyncStorageService.putToken(res.data.token)
        showMessages('', 'Đăng ký tài khoản thành công', () => {
          NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
        })
      },
      onError: err => {
        console.log(err)
      },
    })
  }

  const handleSearch = (value: String) => {
    let text = value.toLowerCase()
    let filteredData = listShop.filter(function (item: any) {
      if (item.name.toLowerCase().includes(text)) {
        return true
      }
      return false
    })
    setFilteredData(filteredData)
  }
  const renderSearchBar = () => {
    return (
      <View style={styles.searchView}>
        <View style={styles.searchContainer}>
          <ShopSearchBar
            outline={false}
            containerStyle={{ paddingHorizontal: 0, paddingRight: 10 }}
            placeholder={'Tìm kiếm gian hàng'}
            onSearch={handleSearch}
          />
        </View>
      </View>
    )
  }

  useEffect(() => {
    getListShop()
    return () => {
      arrID.length = 0
    }
  }, [])
  return (
    <ScreenWrapper
      unsafe
      back
      titleHeader={'Gợi ý theo dõi gian hàng'}
      color="black"
      backgroundHeader={'white'}
      backgroundColor="white"
      dialogLoading={dialogLoading}
    >
      {renderSearchBar()}
      <FlatList
        numColumns={3}
        style={{
          flex: 1,
          marginTop: 10,
        }}
        contentContainerStyle={{ paddingLeft: '8%', paddingBottom: '10%' }}
        showsHorizontalScrollIndicator={false}
        data={filteredData?.length ? filteredData : listShop.concat(listShop)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }: { item: any; index: number }) => {
          return (
            <DebounceButton
              style={{
                marginVertical: 15,
                marginRight: '12%',
                width: WIDTH / 6 + 20,
                // alignItems: 'center',
                // backgroundColor: 'red',
              }}
              onPress={() => onPressShop(item)}
              children={
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.23,
                      shadowRadius: 2.62,
                      elevation: 4,
                    }}
                  >
                    <FastImage
                      style={{
                        width: WIDTH * 0.18,
                        height: WIDTH * 0.18,
                        borderRadius: (WIDTH * 0.25) / 2,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: '#DDD',
                      }}
                      source={{ uri: item?.profile_picture_url }}
                    />
                    {item?.isCheck && (
                      <FastImage
                        source={R.images.ic_checked}
                        style={{
                          width: 25,
                          height: 25,
                          position: 'absolute',
                          right: -5,
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      marginTop: 5,
                      ...fonts.medium14,
                      textAlign: 'center',
                    }}
                    numberOfLines={2}
                    children={item.name}
                  />
                </View>
              }
            />
          )
        }}
      />
      <Button
        style={[
          styles.button,
          {
            backgroundColor: colors.red_F03,
            alignSelf: 'center',
          },
        ]}
        children={
          <Text
            style={{
              fontSize: 16 * scale,
              fontFamily: R.fonts.sf_semi_bold,
              fontWeight: '500',
              color: colors.white,
            }}
          >
            {'Đăng ký tài khoản'}
          </Text>
        }
        onPress={handleRgister}
      />
    </ScreenWrapper>
  )
}

export default ListShopFollowScreen

const styles = StyleSheet.create({
  button: {
    // ...styleView.centerItem,
    width: '80%',
    height: 45,
    marginTop: 12,
    marginBottom: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchView: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: colors.white,
  },
  searchContainer: {
    ...styleView.rowItem,
    height: 40,
    borderWidth: 1,
    borderColor: '#D0DBEA',
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
})
