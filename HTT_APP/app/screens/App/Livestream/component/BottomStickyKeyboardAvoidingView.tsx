import React, { Fragment } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'
import {
  SafeAreaView,
  useSafeAreaInsets,
  Edge,
} from 'react-native-safe-area-context'
import { useKeyboard } from '@app/utils/useKeyboard'
import LinearGradient from 'react-native-linear-gradient'

const LINEAR_BACKGROUND_HEIGHT = 70
const LINEAR_BACKGROUND_LONG_HEIGHT = LINEAR_BACKGROUND_HEIGHT * 0.2

const KEYBOARD_SHOWN_CONFIGS = {
  accessoryLinearGradient: {
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
    colors: ['rgba(0, 0, 0, 0.8)', `rgba(0, 0, 0, 0.8)`],
  },
  accessorySafeAreaEdges: ['left', 'right'] as Edge[],
}

const KEYBOARD_HIDDEN_CONFIGS = {
  accessoryLinearGradient: {
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
    colors: ['rgba(0, 0, 0, 0.8)', `rgba(0, 0, 0, 0.4)`, `rgba(0, 0, 0, 0)`],
  },
  accessorySafeAreaEdges: ['left', 'right', 'bottom'] as Edge[],
}

type LinearBackgroundProps = {
  height: number
}

const LinearBackground = (props: LinearBackgroundProps) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      colors={[
        'rgba(0, 0, 0, 0.9)',
        `rgba(0, 0, 0, ${
          props.height > LINEAR_BACKGROUND_LONG_HEIGHT ? 0.6 : 0.3
        })`,
        'rgba(0, 0, 0, 0)',
      ]}
      style={[styles.bottomViewGradient, { height: props.height }]}
    />
  )
}

type BottomStickyKeyboardAvoidingViewProps = {
  children: React.ReactNode
  backgroundView?: React.ReactNode
  accessoryView?: React.ReactNode
}

const BottomStickyKeyboardAvoidingView = (
  props: BottomStickyKeyboardAvoidingViewProps
) => {
  const keyboardInfo = useKeyboard()

  const CONFIGS = keyboardInfo.keyboardWillShown
    ? KEYBOARD_SHOWN_CONFIGS
    : KEYBOARD_HIDDEN_CONFIGS

  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView style={styles.bottomViewContainer} behavior="padding">
      <View style={styles.container}>
        {props.backgroundView}
        {props.children}
        {props.accessoryView && (
          <LinearGradient {...CONFIGS.accessoryLinearGradient}>
            <SafeAreaView edges={CONFIGS.accessorySafeAreaEdges}>
              {props.accessoryView}
            </SafeAreaView>
          </LinearGradient>
        )}
      </View>
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.bottomViewContainer}>
      {props.backgroundView}
      {props.children}
      {props.accessoryView && (
        <LinearGradient {...CONFIGS.accessoryLinearGradient}>
          {props.accessoryView}
        </LinearGradient>
      )}
    </View>
  )
}

export default BottomStickyKeyboardAvoidingView

const styles = StyleSheet.create({
  bottomViewContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  container: { flex: 1 },
  bottomViewGradient: {
    // width: dimensions.width,
    height: 90,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
})
