import { Button } from '@app/components/Button/Button'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import React from 'react'
import { View, Text, FlatList, ListRenderItem, StyleSheet } from 'react-native'

const { width } = dimensions

interface RadioButtonProps {
  isActive: boolean
}

interface TopicViewProps {
  data: Array<TopicItem>
  currentValue: number
  onPress: (value: TopicItem) => void
}

export type TopicItem = {
  label: string
  value: number
}

const RadioButton = (props: RadioButtonProps) => {
  const { isActive } = props

  return (
    <View
      style={{
        ...styleView.centerItem,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: isActive ? '#FCA931' : '#BFBFBF',
      }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: isActive ? '#FCA931' : 'transparent',
        }}
      />
    </View>
  )
}

const SelectTopicView = (props: TopicViewProps) => {
  const { data, currentValue, onPress } = props

  const renderTopicItem: ListRenderItem<TopicItem> = ({ item }) => {
    return (
      <Button
        onPress={() => onPress(item)}
        children={
          <View style={styles.topicItem}>
            <RadioButton isActive={currentValue == item.value} />
            <Text
              style={{ ...fonts.regular16, marginLeft: 16 }}
              children={item.label}
            />
          </View>
        }
      />
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        bounces={false}
        renderItem={renderTopicItem}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: '#BFBFBF' }} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 16,
    maxHeight: 224,
    backgroundColor: colors.white,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30,
    borderRadius: 14,
  },
  topicItem: {
    ...styleView.rowItem,
    height: 56,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
})

export default SelectTopicView
