import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEventListener, ScreenRect } from 'react-native'

const emptyCoordinates = Object.freeze({
  screenX: 0,
  screenY: 0,
  width: 0,
  height: 0,
})
const initialValue = {
  start: emptyCoordinates,
  end: emptyCoordinates,
}

export function useKeyboard() {
  const [shown, setShown] = useState(false)
  const [willShow, setWillShown] = useState(false)
  const [coordinates, setCoordinates] = useState<{
    start: ScreenRect
    end: ScreenRect
  }>(initialValue)
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0)

  const handleKeyboardWillShow: KeyboardEventListener = e => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    setWillShown(true)
  }
  const handleKeyboardDidShow: KeyboardEventListener = e => {
    setShown(true)
    setWillShown(true)
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    setKeyboardHeight(e.endCoordinates.height)
  }
  const handleKeyboardWillHide: KeyboardEventListener = e => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    setWillShown(false)
  }
  const handleKeyboardDidHide: KeyboardEventListener = e => {
    setShown(false)
    setWillShown(false)
    if (e) {
      setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    } else {
      setCoordinates(initialValue)
      setKeyboardHeight(0)
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow)
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)

    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow)
      Keyboard.removeListener('keyboardDidShow', handleKeyboardDidShow)
      Keyboard.removeListener('keyboardWillHide', handleKeyboardWillHide)
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDidHide)
    }
  }, [])

  return {
    keyboardShown: shown,
    keyboardWillShown: willShow,
    coordinates,
    keyboardHeight,
  }
}
