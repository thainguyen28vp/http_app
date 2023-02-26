import React, { useEffect, useState } from 'react'
import { View, Text, ListRenderItem, RefreshControl } from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getFavoriteTopic,
  requestMarkFavoriteTopic,
} from '@app/service/Network/account/AccountApi'
import { FlatList } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'

const FavoriteTopicScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [topicData, setTopicData] = useState<any>([])

  const markFavoriteTopic = (topic_id?: number) => {
    callAPIHook({
      API: requestMarkFavoriteTopic,
      useLoading: setDialogLoading,
      payload: { topic_id },
      onSuccess: res => {
        setTopicData(res.data.rows)
      },
    })
  }

  const getData = () => {
    callAPIHook({
      API: getFavoriteTopic,
      useLoading: setIsLoading,
      onSuccess: res => {
        setTopicData(res.data.rows)
      },
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const renderTopicItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <Button
        onPress={() => markFavoriteTopic(item.id)}
        children={
          <View
            style={{
              backgroundColor: colors.white,
              padding: 15,
              borderRadius: 16,
            }}
          >
            <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
              <FastImage
                style={{ width: 24, height: 24 }}
                source={
                  Boolean(item.check_topic)
                    ? R.images.ic_heart_circle_grey
                    : R.images.ic_heart_circle
                }
              />
              <Text
                style={{
                  ...fonts.medium16,
                  marginLeft: 12,
                  color: Boolean(item.check_topic) ? '#595959' : '#262626',
                }}
                children={item?.name?.trim()}
              />
            </View>
            <Text
              style={{ ...fonts.regular16, color: '#595959', marginTop: 12 }}
              children={item?.description?.trim()}
            />
          </View>
        }
      />
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      dialogLoading={dialogLoading}
      titleHeader={'Chủ đề'}
      isLoading={isLoading}
    >
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getData} />
        }
        data={topicData}
        onRefresh={getData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15 }}
        renderItem={renderTopicItem}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ScreenWrapper>
  )
}

export default FavoriteTopicScreen
