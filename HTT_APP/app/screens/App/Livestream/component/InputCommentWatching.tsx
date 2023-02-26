import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { useAppSelector } from '@app/store'
import { colors } from '@app/theme'
import React, { useEffect, useState } from 'react'
import { TextInput, View, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

const InputCommentWatching = ({
  ref,
  onPressSend,
  onChangeText,
  nameProduct,
  stylesViewInput,
}: {
  ref?: any
  nameProduct?: string
  onPressSend: (input: string) => void
  onChangeText?: (input: string) => void
  stylesViewInput?: ViewStyle
}) => {
  const LiveReducer = useAppSelector(state => state.LiveReducer)
  const [comment, setComment] = useState('')
  useEffect(() => {
    LiveReducer.nameProductComment != null
      ? setComment(LiveReducer.nameProductComment)
      : null
  }, [LiveReducer.nameProductComment])
  return (
    <View style={[styles.vInputComment, stylesViewInput]}>
      <TextInput
        ref={ref}
        value={comment}
        style={styles.txtInput}
        placeholder={'Bình luận...'}
        placeholderTextColor={colors.white}
        onChangeText={input => setComment(input)}
        returnKeyType={'done'}
      />
      <Button
        disabled={!!!comment}
        onPress={() => {
          onPressSend(comment)
          setComment('')
        }}
        style={styles.btnSendComment}
        children={
          <FastImage
            source={R.images.img_send}
            style={styles.imgSendComment}
            tintColor={colors.white}
            resizeMode={'contain'}
          />
        }
      />
    </View>
  )
}

export default InputCommentWatching
