import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { colors, dimensions, fonts } from '@app/theme'

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },

})
