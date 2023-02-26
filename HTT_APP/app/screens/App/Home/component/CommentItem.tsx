import React, { useCallback, useRef, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import { Comment } from '../model/Forum'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import FstImage from '@app/components/FstImage/FstImage'
import * as Animatable from 'react-native-animatable'
import reactotron from 'ReactotronConfig'
import { ROLE_COMMENTS } from '@app/config/Constants'

interface CommentProps {
  data: Comment
  onLikePress: (id: number, parent_id: number | null) => void
  onCommentPress?: (
    ref: any,
    parent_id?: number | null,
    target_user_id?: number,
    name?: string
  ) => void
  onLoadPrevious?: (
    comment_id: number,
    last_comment_id?: number,
    amount?: number
  ) => void
  isLoadPrevious?: boolean
}

const NUM_OF_LINES = 4

const ContentItem = ({ content, children }: any) => {
  const [showMoreContent, setShowMoreContent] = useState<boolean>(false)
  const [isValidLength, setIsValidLength] = useState<boolean>(false)

  const onTextLayout = useCallback(e => {
    setIsValidLength(e.nativeEvent.lines.length >= NUM_OF_LINES)
  }, [])

  return (
    <>
      <Text
        onTextLayout={onTextLayout}
        selectable
        style={{ ...fonts.regular16, marginTop: 12 }}
        numberOfLines={!showMoreContent ? NUM_OF_LINES : undefined}
      >
        {children}
        <Text children={content} />
      </Text>
      {isValidLength && (
        <Button
          onPress={() => {
            setShowMoreContent(prev => !prev)
          }}
          children={
            <Animatable.Text
              style={{
                ...fonts.medium14,
                color: colors.primary,
                marginTop: 5,
              }}
              children={!showMoreContent ? 'Xem thêm' : 'Ẩn bớt'}
            />
          }
        />
      )}
    </>
  )
}

const CommentItem = (props: CommentProps) => {
  const { data, onCommentPress, onLoadPrevious, onLikePress, isLoadPrevious } =
    props
  const subCommentCount = data?.count_sub_comment

  const commentRef = useRef<View>(null)

  const renderItem = (item: Comment) => {
    const userInfor =
      item?.Account?.role == ROLE_COMMENTS.ADMIN
        ? { ...item?.Account?.Admin, full_name: 'Quản trị viên' }
        : item?.Account?.User
    const avatar = item.Account?.User?.avatar
    const isCommentLiked = Boolean(item.is_reaction)
    return (
      <View style={{ ...styleView.rowItem }}>
        <FstImage
          style={styles.imgAvatar}
          source={avatar ? { uri: avatar } : R.images.img_user}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{ ...fonts.semi_bold15 }}
            children={userInfor?.full_name}
          />
          <ContentItem content={item?.content}>
            {!!item.target_user &&
              item?.Account?.id != userInfor?.account_id && (
                <Text
                  style={{ fontFamily: R.fonts.sf_medium, color: '#3387F7' }}
                  children={`@${item.target_user?.name.trim()} `}
                />
              )}
          </ContentItem>
          <View
            ref={commentRef}
            style={{
              ...styleView.rowItemBetween,
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
              <Text
                style={{ ...fonts.regular14, color: '#595959' }}
                children={moment(item?.create_at).fromNow()}
              />
              <Button
                onPress={() => onLikePress(item.id, item.parent_id)}
                children={
                  <Text
                    style={{
                      ...fonts.regular14,
                      marginHorizontal: 14,
                      color: isCommentLiked ? '#D5A227' : 'black',
                      fontFamily: isCommentLiked
                        ? R.fonts.sf_medium
                        : R.fonts.sf_regular,
                    }}
                    children={'Thích'}
                  />
                }
              />
              <Button
                onPress={() => {
                  !!onCommentPress &&
                    onCommentPress(
                      commentRef.current,
                      data?.id,
                      item.User?.id,
                      item.User?.name
                    )
                }}
                children={
                  <Text style={{ ...fonts.regular14 }} children={'Trả lời'} />
                }
              />
            </View>
            {item.count_like != 0 && (
              <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                <Text
                  style={{
                    ...fonts.regular14,
                    marginRight: 4,
                    color: '#595959',
                  }}
                  children={item.count_like}
                />
                <FastImage
                  style={{ width: 18, height: 18 }}
                  source={R.images.icon_red_heart_forum}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View>
      {renderItem(data)}
      {!!data.Comments?.length && (
        <View style={styles.subCommentView}>
          {isLoadPrevious && (
            <Button
              onPress={() => {
                !!onLoadPrevious &&
                  onLoadPrevious(
                    data?.id,
                    data.Comments![0].id,
                    subCommentCount! - 2
                  )
              }}
              children={
                <Text
                  style={{ ...fonts.medium14, marginBottom: 15 }}
                  children={`Xem ${subCommentCount! - 2} phản hồi khác...`}
                />
              }
            />
          )}
          <FlatList
            data={data.Comments}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(_, index) => `${index}`}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  subCommentView: {
    marginLeft: 56,
    marginTop: 16,
  },
})

export default CommentItem
