import R from '@app/assets/R'
import { DebounceButton } from '@app/components/Button/Button'
import { fonts, WIDTH } from '@app/theme'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import { requestGetListShop } from '../AuthApi'
let arrID: any = []

interface Props {
  onPressShopFollow: (listShopID?: []) => void
}
const ListShopFollow = ({ onPressShopFollow }: Props) => {
  const [listShop, setStateListShop] = useState([])
  const [isLoading, setStateIsLoading] = useState(false)

  const getListShop = async () => {
    let tempData: any = []
    // setStateIsLoading(true)
    try {
      const res = await requestGetListShop()
      if (res.status != 0) {
        // setStateIsLoading(false)
        res.data.map((item: any) => {
          arrID?.push(item.id)
          tempData.push({
            ...item,
            isCheck: true,
          })
        })
        setStateListShop(tempData)
        onPressShopFollow(arrID)
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

    return onPressShopFollow(arrID)
  }

  useEffect(() => {
    getListShop()
    return () => {
      arrID.length = 0
    }
  }, [])

  //   if (isLoading) return <ActivityIndicator color={'red'} />
  return (
    <FlatList
      style={{ left: -20, marginTop: 10, width: WIDTH }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 20,
      }}
      horizontal={true}
      data={listShop}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        return (
          <DebounceButton
            style={{
              marginVertical: 5,
              marginRight: 10,
              width: WIDTH / 6 + 20,
              alignItems: 'center',
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
                      width: 60,
                      height: 60,
                      borderRadius: 60 / 2,
                      overflow: 'hidden',
                    }}
                    source={{ uri: item?.profile_picture_url }}
                  />
                  {item?.isCheck && (
                    <FastImage
                      source={R.images.ic_checked}
                      style={{
                        width: 20,
                        height: 20,
                        position: 'absolute',
                        right: -5,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    ...fonts.regular14,
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
  )
}

export default ListShopFollow

const styles = StyleSheet.create({})
