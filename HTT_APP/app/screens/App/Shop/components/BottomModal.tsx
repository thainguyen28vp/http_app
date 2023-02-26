import React, { useState, useEffect, useRef, memo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ListRenderItem,
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'
import { colors, dimensions, fonts, HEIGHT, styleView } from '@theme/index'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import Empty from '@app/components/Empty/Empty'
import Search from '@app/components/Search'
import Loading from '@app/components/Loading'
import { isIphoneX } from 'react-native-iphone-x-helper'

type BottomModalItem = {
  label: string
  value: number
}
interface BottomModalProps {
  data: Array<BottomModalItem>
  onSelectChange?: (item: BottomModalItem) => void
  defaultValue?: number
  modalViewComponent?: (label: string) => React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  allowSearch?: boolean
  title?: string
  onSearch?: (text: string) => void
}

const { width } = dimensions

const BottomModalComponent = (props: any) => {
  const {
    data,
    onSelectChange,
    isVisible,
    allowSearch,
    title,
    onClose,
    onBackdropPress,
    defaultValue,
    isLoadingData,
  } = props
  const [selected, setSelected] = useState<BottomModalItem>({
    label: '',
    value: 0,
  })

  const listRef = useRef<FlatList>(null)

  const _renderItem: ListRenderItem<BottomModalItem> = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          !!onSelectChange && onSelectChange(item)
          setSelected(item)
        }}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text
            children={item.label}
            style={{
              ...fonts.regular15,
              color: item.value === selected.value ? colors.primary : 'black',
              marginLeft: 20,
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const checkDefaultValue = () => {
    setSelected({
      label: '',
      value: 0,
    })
    if (defaultValue) {
      let target = data.find(item => item.value == defaultValue)

      if (!!target) {
        setSelected(prev => ({
          ...prev,
          label: target!.label,
          value: defaultValue,
        }))
      }
    }
  }

  useEffect(() => {
    checkDefaultValue()
  }, [data])

  return (
    <>
      <Modal
        style={styles.modal}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={onBackdropPress}
        isVisible={isVisible}
        useNativeDriver
        hardwareAccelerated
        hideModalContentWhileAnimating
      >
        <View style={{ backgroundColor: 'white', width, height: 500 }}>
          <View style={styles.titleContainer}>
            {!!title && (
              <Text style={{ ...fonts.semi_bold16 }} children={title} />
            )}
          </View>
          <Button
            style={styles.closeBtn}
            onPress={onClose}
            children={
              <FastImage
                style={styles.closeBtnImg}
                source={R.images.ic_close}
              />
            }
          />
          {!!allowSearch && (
            <Search
              containerStyle={{
                marginHorizontal: 18,
                backgroundColor: '#F5F5F5',
                marginBottom: 6,
                marginTop: 16,
                paddingVertical: 8,
              }}
              leftIconTintColor="#737B84"
            />
          )}
          {isLoadingData ? (
            <Loading />
          ) : (
            <FlatList
              ref={listRef}
              data={data}
              style={{ marginTop: allowSearch ? 5 : 15 }}
              contentContainerStyle={{ paddingBottom: isIphoneX() ? 20 : 0 }}
              scrollEventThrottle={32}
              snapToAlignment={'start'}
              decelerationRate={'fast'}
              initialNumToRender={data.length}
              keyExtractor={(_, index) => `${index}`}
              ItemSeparatorComponent={() => (
                <View
                  style={{ height: 0.5, width, backgroundColor: '#E6E4EA' }}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Empty
                  marginTop={'25%'}
                  imageStyle={{ height: HEIGHT / 4 }}
                  backgroundColor={'transparent'}
                />
              )}
              renderItem={_renderItem}
            />
          )}
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  modal: {
    width,
    position: 'absolute',
    bottom: -20,
    left: -20,
  },
  viewContainer: {
    width,
    maxHeight: 568,
    backgroundColor: colors.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 18,
  },
  closeBtnImg: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    ...styleView.centerItem,
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
  },
})

const BottomModal = memo(BottomModalComponent)

export default BottomModal
