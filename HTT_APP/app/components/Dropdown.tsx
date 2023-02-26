import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
import React, { useState, useRef, useMemo, memo, LegacyRef } from 'react'
import { useLayoutEffect } from 'react'
import { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'

type DropdownItem = {
  name: string
  id: string | number
}
interface Props {
  data: Array<DropdownItem>
  defaultValue?: string | number
  onChangeItem?: (item: DropdownItem) => void
  style?: ViewStyle
  itemLabelStyle?: TextStyle
  dropdownStyle?: ViewStyle
}

type ContainerDimension = {
  width: number
  height: number
  x: number
  y: number
}

const DEFAULT_LABEL = 'Chọn kho'
const DEFAULT_PADDING = 5

const Dropdown = (props: Props) => {
  const {
    data,
    defaultValue,
    onChangeItem,
    style,
    itemLabelStyle,
    dropdownStyle,
  } = props
  const listData = useMemo(() => data, [data])
  const [id, setId] = useState(
    listData.find(item => item.id == defaultValue)?.name || DEFAULT_LABEL
  )
  const [containerDimension, setContainerDimension] =
    useState<ContainerDimension>({
      width: 150,
      height: 150,
      x: 20,
      y: 200,
    })
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  const containerRef = useRef<View>(null)

  const renderItem = ({
    item,
    index,
  }: {
    item: DropdownItem
    index: number
  }) => {
    return (
      <Button
        onPress={() => {
          onDropItemPress(item.name)
          !!onChangeItem && onChangeItem(item)
        }}
        children={
          <View
            style={{
              ...styleView.rowItemBetween,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                itemLabelStyle,
                {
                  ...fonts.regular16,
                  marginLeft: 20,
                  color: item.name == id ? colors.primary : colors.black,
                },
              ]}
              children={item.name}
            />
            {item.name == id && (
              <FastImage
                style={{ width: 17, height: 17, marginRight: 3 }}
                source={R.images.ic_tick}
                tintColor={colors.primary}
              />
            )}
          </View>
        }
      />
    )
  }

  const handleOnLayout = () => {
    containerRef.current?.measure((fx, fy, width, height, px, py) => {
      setContainerDimension(prev => ({
        ...prev,
        width,
        height,
        x: px,
        y: py,
      }))
    })
  }

  useEffect(() => {
    const layoutPrepare = setTimeout(() => {
      handleOnLayout()
    }, 700)

    return () => clearTimeout(layoutPrepare)
  }, [])

  const onDropItemPress = (item: string) => {
    setDropdownVisible(false)
    if (id == item) {
      return
    }
    setId(item)
  }

  const onDropdownPress = () => {
    setDropdownVisible(prev => !prev)
  }

  return (
    <View ref={containerRef} style={{ zIndex: 1, position: 'relative' }}>
      <TouchableOpacity
        onPress={onDropdownPress}
        children={
          <View style={[style, styles.container]}>
            <Text
              style={{
                ...fonts.regular16,
                color: id == DEFAULT_LABEL ? '#69747E' : colors.black,
              }}
              children={id}
            />
            <FastImage
              style={{ width: 20, height: 20 }}
              source={R.images.ic_down}
              tintColor={colors.black}
            />
          </View>
        }
      />
      <Modal
        isVisible={dropdownVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropColor="transparent"
        useNativeDriver
        onBackdropPress={() => setDropdownVisible(false)}
      >
        <View
          style={[
            dropdownStyle,
            {
              ...styleView.shadowStyle,
              maxHeight: 150,
              backgroundColor: colors.white,
              position: 'absolute',
              top:
                containerDimension.y +
                (Platform.OS != 'android'
                  ? DEFAULT_PADDING
                  : 2 * DEFAULT_PADDING),
              width: containerDimension.width,
            },
          ]}
        >
          <FlatList
            data={listData}
            bounces={false}
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingHorizontal: 7 }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: '#CED4DA' }} />
            )}
            keyExtractor={(_, index) => `${index}`}
            renderItem={renderItem}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...styleView.rowItemBetween,
    paddingBottom: DEFAULT_PADDING,
    borderBottomWidth: 1,
    borderColor: '#CED4DA',
  },
})

export default Dropdown

// import R from '@app/assets/R'
// import { Button } from '@app/components/Button/Button'
// import { colors, fonts, styleView } from '@app/theme'
// import React, { useState, useRef, useMemo, memo, LegacyRef } from 'react'
// import { useLayoutEffect } from 'react'
// import { useEffect } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ViewStyle,
//   TextStyle,
//   TouchableOpacity,
//   Platform,
// } from 'react-native'
// import FastImage from 'react-native-fast-image'
// import Modal from 'react-native-modal'

// type DropdownItem = {
//   label: string
//   value: string | number
// }
// interface Props {
//   data: Array<DropdownItem>
//   defaultValue?: string | number
//   onChangeItem?: (item: DropdownItem) => void
//   style?: ViewStyle
//   itemLabelStyle?: TextStyle
//   dropdownStyle?: ViewStyle
// }

// type ContainerDimension = {
//   width: number
//   height: number
//   x: number
//   y: number
// }

// const DEFAULT_LABEL = 'Lựa chọn'
// const DEFAULT_PADDING = 5

// const Dropdown = (props: Props) => {
//   const {
//     data,
//     defaultValue,
//     onChangeItem,
//     style,
//     itemLabelStyle,
//     dropdownStyle,
//   } = props
//   const listData = useMemo(() => data, [data])
//   const [value, setValue] = useState(
//     listData.find(item => item.value == defaultValue)?.label || DEFAULT_LABEL
//   )
//   const [containerDimension, setContainerDimension] =
//     useState<ContainerDimension>({
//       width: 150,
//       height: 150,
//       x: 20,
//       y: 200,
//     })
//   const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
//   const containerRef = useRef<View>(null)

//   const renderItem = ({
//     item,
//     index,
//   }: {
//     item: DropdownItem
//     index: number
//   }) => {
//     return (
//       <Button
//         onPress={() => {
//           onDropItemPress(item.label)
//           !!onChangeItem && onChangeItem(item)
//         }}
//         children={
//           <View
//             style={{
//               ...styleView.rowItemBetween,
//               paddingVertical: 12,
//               alignItems: 'center',
//             }}
//           >
//             <Text
//               style={[
//                 itemLabelStyle,
//                 {
//                   ...fonts.regular16,
//                   marginLeft: 3,
//                   color: item.label == value ? colors.primary : colors.black,
//                 },
//               ]}
//               children={item.label}
//             />
//             {item.label == value && (
//               <FastImage
//                 style={{ width: 17, height: 17, marginRight: 3 }}
//                 source={R.images.ic_tick}
//                 tintColor={colors.primary}
//               />
//             )}
//           </View>
//         }
//       />
//     )
//   }

//   const handleOnLayout = () => {
//     containerRef.current?.measure((fx, fy, width, height, px, py) => {
//       setContainerDimension(prev => ({
//         ...prev,
//         width,
//         height,
//         x: px,
//         y: py,
//       }))
//     })
//   }

//   useEffect(() => {
//     const layoutPrepare = setTimeout(() => {
//       handleOnLayout()
//     }, 700)

//     return () => clearTimeout(layoutPrepare)
//   }, [])

//   const onDropItemPress = (item: string) => {
//     setDropdownVisible(false)
//     if (value == item) {
//       return
//     }
//     setValue(item)
//   }

//   const onDropdownPress = () => {
//     setDropdownVisible(prev => !prev)
//   }

//   return (
//     <View ref={containerRef} style={{ zIndex: 1, position: 'relative' }}>
//       <TouchableOpacity
//         onPress={onDropdownPress}
//         children={
//           <View style={[style, styles.container]}>
//             <Text
//               style={{
//                 ...fonts.regular16,
//                 color: value == DEFAULT_LABEL ? '#69747E' : colors.black,
//               }}
//               children={value}
//             />
//             <FastImage
//               style={{ width: 20, height: 20 }}
//               source={R.images.ic_down}
//               tintColor={colors.black}
//             />
//           </View>
//         }
//       />
//       <Modal
//         isVisible={dropdownVisible}
//         animationIn="fadeIn"
//         animationOut="fadeOut"
//         backdropColor="transparent"
//         useNativeDriver
//         onBackdropPress={() => setDropdownVisible(false)}
//       >
//         <View
//           style={[
//             dropdownStyle,
//             {
//               ...styleView.shadowStyle,
//               maxHeight: 150,
//               backgroundColor: colors.white,
//               position: 'absolute',
//               top:
//                 containerDimension.y +
//                 (Platform.OS != 'android'
//                   ? DEFAULT_PADDING
//                   : 2 * DEFAULT_PADDING),
//               width: containerDimension.width,
//             },
//           ]}
//         >
//           <FlatList
//             data={listData}
//             bounces={false}
//             showsVerticalScrollIndicator
//             contentContainerStyle={{ paddingHorizontal: 7 }}
//             ItemSeparatorComponent={() => (
//               <View style={{ height: 1, backgroundColor: '#CED4DA' }} />
//             )}
//             keyExtractor={(_, index) => `${index}`}
//             renderItem={renderItem}
//           />
//         </View>
//       </Modal>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     ...styleView.rowItemBetween,
//     paddingBottom: DEFAULT_PADDING,
//     borderBottomWidth: 1,
//     borderColor: '#CED4DA',
//   },
// })

// export default Dropdown
