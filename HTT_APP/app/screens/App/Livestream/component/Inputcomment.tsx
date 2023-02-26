import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors } from '@app/theme'
import React, { useState } from 'react'
import { TextInput, View, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'

const Inputcomment = ({
  ref,
  onPressSend,
  onChangeText,
  nameProduct,
  onFocus,
  stylesViewInput,
}: {
  ref?: any
  nameProduct?: string
  onPressSend: (input: string) => void
  onChangeText?: (input: string) => void
  onFocus?: (e: any) => void
  stylesViewInput?: ViewStyle
}) => {
  const [comment, setComment] = useState(nameProduct || '')
  return (
    <View style={[styles.vInputComment, stylesViewInput]}>
      <TextInput
        onFocus={onFocus}
        ref={ref}
        value={comment}
        style={styles.txtInput}
        placeholder={'Bình luận...'}
        placeholderTextColor={colors.white}
        onChangeText={input => setComment(input)}
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

export default Inputcomment
