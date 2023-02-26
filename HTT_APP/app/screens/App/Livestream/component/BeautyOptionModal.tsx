import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Slider, SliderProps, Image } from 'react-native-elements'
import { useImmer } from 'use-immer'
import Modal from 'react-native-modal'
import R from '@app/assets/R'
import { colors, fonts } from '@app/theme'

export type BeautyConfig = {
  lighteningLevel?: number
  smoothnessLevel?: number
  rednessLevel?: number
  lighteningContrastLevel?: 0 | 1 | 2
}

type BeautyOptionModalProps = {
  value: BeautyConfig
  onValueChange: (v: BeautyConfig) => void
}

interface BeautyOptionSliderProps extends Omit<SliderProps, 'onValueChange'> {
  name: string
  title?: string
  onValueChange: (name: string, value?: number) => void
}

const BeautyOptionSlider = ({
  name,
  title,
  onValueChange,
  ...props
}: BeautyOptionSliderProps) => {
  const handleValueChange = React.useCallback(
    v => {
      onValueChange(name, v)
    },
    [name, onValueChange]
  )
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderTextTitle}>{title}</Text>
      <View style={styles.slider}>
        <Slider
          {...props}
          onSlidingComplete={handleValueChange}
          thumbStyle={styles.sliderThumb}
        />
      </View>
      <Text style={styles.sliderValue}>{props.value}</Text>
    </View>
  )
}

const BeautyOptionModal = React.forwardRef(
  ({ onValueChange, value }: BeautyOptionModalProps, ref) => {
    const [option, setOption] = useImmer<BeautyConfig>(value)
    const [isVisible, setVisible] = React.useState(false)

    React.useEffect(() => {
      onValueChange(option)
    }, [option, onValueChange])

    React.useImperativeHandle(ref, () => ({
      show() {
        setVisible(true)
      },
      hide() {
        setVisible(false)
      },
    }))

    const handleValueChange = React.useCallback(
      (name, value) => {
        setOption(prev => {
          prev[name] = roundNumber(value, 1)
        })
      },
      [setOption]
    )

    const handleClose = React.useCallback(() => {
      setVisible(false)
    }, [])

    return (
      <Modal
        hasBackdrop={true}
        backdropOpacity={0}
        isVisible={isVisible}
        onDismiss={handleClose}
        onBackdropPress={handleClose}
        style={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Hiệu ứng</Text>
            <Image
              onPress={handleClose}
              source={R.images.ic_close}
              style={styles.closeImage}
            />
          </View>
          <View style={styles.lineHorizontal} />
          <View style={styles.contentContainer}>
            <BeautyOptionSlider
              title="Smooth"
              name="smoothnessLevel"
              maximumValue={1}
              minimumValue={0}
              step={0.1}
              value={option.smoothnessLevel}
              onValueChange={handleValueChange}
            />
            <BeautyOptionSlider
              title="Brighten"
              name="lighteningLevel"
              maximumValue={1}
              minimumValue={0}
              step={0.1}
              value={option.lighteningLevel}
              onValueChange={handleValueChange}
            />
            <BeautyOptionSlider
              title="Contract"
              name="lighteningContrastLevel"
              maximumValue={2}
              minimumValue={0}
              step={1}
              value={option.lighteningContrastLevel}
              onValueChange={handleValueChange}
            />
            <BeautyOptionSlider
              title="Eye"
              name="rednessLevel"
              maximumValue={1}
              minimumValue={0}
              step={0.1}
              value={option.rednessLevel}
              onValueChange={handleValueChange}
            />
          </View>
        </View>
      </Modal>
    )
  }
)

function roundNumber(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export default memo(BeautyOptionModal)

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 260,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    ...fonts.bold18,
  },
  contentContainer: { paddingVertical: 16 },
  closeImage: { width: 30, height: 30 },
  lineHorizontal: { height: 1, width: '100%', backgroundColor: colors.primary },
  sliderContainer: { flexDirection: 'row', alignItems: 'center' },
  sliderTextTitle: { width: 70 },
  sliderValue: { width: 30, textAlign: 'right' },
  flex: { flex: 1 },
  slider: { marginRight: 10, flex: 1 },
  sliderThumb: { height: 20, width: 20, backgroundColor: colors.primary },
})
