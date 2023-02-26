import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors } from 'react-native-elements'
import callAPI, { callAPIHook } from '@app/utils/CallApiHelper'
import { getNews } from '@app/service/Network/home/HomeApi'
import { NewsItem } from './IntroHome'
import Loading from '@app/components/Loading'
import Empty from '@app/components/Empty/Empty'

const NewsScreen = () => {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getListNews = async () => {
    callAPIHook({
      API: getNews,
      payload: null,
      useLoading: setIsLoading,
      onSuccess(res) {
        setNews(res.data)
      },
    })
  }
  React.useEffect(() => {
    getListNews()
  }, [])

  const renderBody = () => {
    if (isLoading) return <Loading />
    if (!news?.length) return <Empty />
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={news}
        renderItem={({ item }) => <NewsItem item={item} />}
      />
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      titleHeader={'Danh sách tin tức'}
      backgroundHeader={colors.white}
      color={colors.black}
    >
      {renderBody()}
    </ScreenWrapper>
  )
}

export default NewsScreen

const styles = StyleSheet.create({})
