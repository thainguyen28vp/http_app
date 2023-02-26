import { Button } from '@app/components/Button/Button'
import { colors, fonts } from '@app/theme'
import { countProduct } from '@app/utils/FuncHelper'
import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import { styles } from '../styles'
import isEqual from 'react-fast-compare'
import { useAppSelector } from '@app/store'

const ButtonReaction = memo(
  ({
    icon,
    onPress,
    isCart,
  }: {
    icon: Source
    onPress: () => void
    isCart?: boolean
  }) => {
    const { listProductSelect } = useAppSelector(
      state => state.ListProductReducer
    )
    return (
      <Button
        style={{ marginHorizontal: 10 }}
        onPress={onPress}
        children={
          <>
            <FastImage source={icon} style={styles.vBtnReaction} />
            {isCart ? (
              <View
                style={styles.vCountProduct}
                children={
                  <Text
                    style={{
                      ...fonts.medium12,
                      color: colors.white,
                    }}
                    children={countProduct(listProductSelect?.length)}
                  />
                }
              />
            ) : null}
          </>
        }
      />
    )
  },
  isEqual
)

export default ButtonReaction
