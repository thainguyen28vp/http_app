import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Loading from '@app/components/Loading'
import { Post, Topic } from './model/Forum'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getListTopic,
  requestDeletePost,
} from '@app/service/Network/home/HomeApi'
import { colors, dimensions, styleView } from '@app/theme'
import Empty from '@app/components/Empty/Empty'
import PostItem from './component/PostItem'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { useAppDispatch, useAppSelector } from '@app/store'
import { deletePost, reuqestGetListPost } from './slice/PostSlice'
import { Button } from '@app/components/Button/Button'
import isEqual from 'react-fast-compare'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import PostCustomTopTab from './component/PostCustomTopTab'
import { DEFAULT_PARAMS, ROLE_COMMENTS } from '@app/config/Constants'
import { checkExistUser } from '@app/utils/FuncHelper'
import { DataUserInfoProps } from '../Account/Model'
import { getStreamLiveThunk } from '../Livestream/slice/StreamingSlice'
import { requestGetHomeThunk } from './slice/HomeSlice'
import Error from '@app/components/Error/Error'
import { requestConfigThunk } from '../Config/ConfigSlice'

type TabProps = {
  tabLabel: string
  children: JSX.Element
  isLoading: boolean
  topicId?: number
}

const { width } = dimensions

const TabComponent = ({ children, isLoading }: TabProps) => {
  if (isLoading) return <View style={{ flex: 1 }} children={<Loading />} />
  return <View style={{ flex: 1 }}>{children}</View>
}

const PostScreen = (props: any) => {
  const user_id = props.route.params?.user_id
  const dataConfig = useAppSelector(state => state.ConfigReducer.data)
  const [currentTopicId, setCurrentTopicId] = useState<number | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isErr, setIsError] = useState<boolean>(false)
  const [listTopic, setListTopic] = useState<Array<Topic>>([])
  const [textSearch, setTextSearch] = useState<string>('')
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )

  const { data, isContentLoading, isLastPage, isLoadMore } = useAppSelector(
    state => state.PostReducer
  )
  const Dispatch = useAppDispatch()

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (!onEndReachedCalledDuringMomentum && !isLastPage && !isLoadMore) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const requestGetTopic = () => {
    callAPIHook({
      API: getListTopic,
      useLoading: setIsLoading,
      onSuccess: res => {
        let topicRes = [{ id: undefined, name: 'Tất cả' }, ...res.data]
        setListTopic(topicRes)
      },
      onError(err) {
        setIsError(true)
      },
    })
  }

  const getPostData = (
    topicId?: number,
    user_id?: number,
    user_role?: string,
    textSearch?: string
  ) => {
    Dispatch(
      reuqestGetListPost({
        topic_id: topicId,
        user_id,
        user_role: user_id ? ROLE_COMMENTS.USER : undefined,
        search: textSearch,
        page: body.page,
      })
    )
  }

  const handleDeletePost = (id: number) => {
    showConfirm('', 'Bạn có chắc chắn muốn xoá bài viết', () => {
      callAPIHook({
        API: requestDeletePost,
        payload: { id },
        onSuccess: res => {
          Dispatch(deletePost(id))
        },
      })
    })
  }

  const getData = () => {
    Dispatch(getStreamLiveThunk())
    Dispatch(requestGetHomeThunk())
  }
  const getConfig = () => {
    Dispatch(requestConfigThunk())
  }

  const handleOnPostAction = (postId: number) => {
    checkExistUser(() => {
      NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
        id: postId,
        reloadList: () => getData(),
      })
    })
  }

  useEffect(() => {
    requestGetTopic()
    getConfig()
  }, [])

  useEffect(() => {
    getPostData(currentTopicId, user_id, textSearch)
  }, [body, currentTopicId, textSearch])

  const renderPostItem: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <PostItem
        onPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
            id: item.id,
          })
        }
        onShowMoreContentPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
            id: item.id,
          })
        }
        onReplyPress={() => {
          handleOnPostAction(item.id)
        }}
        isShowMoreContent
        hasToken={true}
        data={item}
        onDeletePress={() => handleDeletePost(item.id)}
        onEditPress={() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.EDIT_POST, {
            data: item,
            reloadList: () => getPostData(currentTopicId, user_id),
          })
        }}
        onCommentPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_DETAIL, {
            id: item.id,
          })
        }
      />
    ),
    [data]
  )

  const listPost = (index: number) => {
    return (
      <FlatList
        key={index}
        refreshing={isContentLoading}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        scrollEventThrottle={32}
        onRefresh={() => getPostData(currentTopicId, user_id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...styleView.paddingBottomScreen }}
        style={{ backgroundColor: '#F1F3F5' }}
        data={data}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderPostItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
        ListFooterComponent={
          isLoadMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 15 }} />
          ) : null
        }
      />
    )
  }

  const renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          onChangeTab={({ ref }) => {
            setCurrentTopicId(ref?.props?.topicId)
          }}
          renderTabBar={() => (
            <PostCustomTopTab
              onSearch={(text: string) => setTextSearch(text)}
            />
          )}
        >
          {listTopic.map((item, index) => (
            <TabComponent
              tabLabel={item.name.trim()}
              key={index}
              isLoading={isContentLoading!}
              children={listPost(index)}
              topicId={item.id}
            />
          ))}
        </ScrollableTabView>
        {!dataConfig?.flag_user_register_enabled && (
          <Button
            style={{ position: 'absolute', bottom: '5%', right: 15 }}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CREATE_POST, {
                reloadList: () => getPostData(currentTopicId, user_id),
              })
            }
            children={
              <View
                style={styles.bottomBtn}
                children={
                  <FastImage
                    style={{ width: 32, height: 32 }}
                    source={R.images.ic_plus}
                    tintColor={colors.white}
                  />
                }
              />
            }
          />
        )}
      </View>
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      titleHeader={!user_id ? 'Cộng đồng' : 'Bài đăng của bạn'}
      isLoading={isLoading}
      isError={isErr}
      reload={() => requestGetTopic()}
      children={renderBody()}
    />
  )
}

const styles = StyleSheet.create({
  container_search: {
    backgroundColor: colors.white,
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 1,
  },
  input_container: {
    marginLeft: 0,
    backgroundColor: '#F1F3F5',
    borderRadius: 50,
    borderWidth: 0,
    width: width - 30,
  },
  bottomBtn: {
    ...styleView.centerItem,
    zIndex: 1,
    backgroundColor: '#D5A227',
    width: 54,
    height: 54,
    borderRadius: 27,
  },
})

export default memo(PostScreen, isEqual)
