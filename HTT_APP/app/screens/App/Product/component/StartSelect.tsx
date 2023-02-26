import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { styleView } from '@app/theme'
import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, ListRenderItem, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'

interface Props {
  initalStar?: number
  onPress?: (star: number) => void
  contentStyle?: ViewStyle
  starSize?: number
  distance?: number
  style?: ViewStyle
  disabled?: boolean
}

const StartSelect = ({
  initalStar,
  onPress,
  contentStyle,
  starSize = 35,
  distance = 20,
  style,
  disabled,
}: Props) => {
  const [star, setStar] = useState<number>(initalStar || 5)

  const onStarPress = (star: number) => {
    setStar(star)
    !!onPress && onPress(star)
  }

  const renderStar: ListRenderItem<any> = ({ item, index }) => {
    return (
      <Button
        disabled={disabled}
        onPress={() => onStarPress(index + 1)}
        children={
          <FastImage
            style={{ width: starSize, height: starSize }}
            source={
              index + 1 <= star
                ? R.images.ic_star_fill
                : R.images.ic_star_outline
            }
          />
        }
      />
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ width: distance }} />,
    []
  )

  return (
    <FlatList
      data={Array(5)}
      horizontal
      style={style}
      scrollEnabled={false}
      contentContainerStyle={contentStyle}
      keyExtractor={(_, index) => `${index}`}
      renderItem={renderStar}
      ItemSeparatorComponent={renderItemSeparator}
    />
  )
}

export default StartSelect
