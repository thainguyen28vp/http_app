import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { colors, dimensions, fonts, WIDTH } from '@app/theme'
import { isIphoneX } from 'react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    height: 131 * scale,
    backgroundColor: '#FFFFFF',
    // width:'100%'
  },
  viewCategory: {
    marginTop: 40 * scale,
    flexDirection: 'row',
  },
  txtMenu: {
    ...fonts.regular16,
    lineHeight: 24 * scale,
  },
  viewSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //   marginTop:10*scale,
    //   backgroundColor:'yellow',
    paddingHorizontal: 20 * scale,
  },
  img24: {
    width: 24 * scale,
    height: 24 * scale,
    marginTop: -10,
  },
  input_container: {
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    width: 277 * scale,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    paddingLeft: 15,
    marginTop: -10,
  },
  viewBody: {
    paddingHorizontal: 15 * scale,
    backgroundColor: 'red',
  },
  txt_nothing: {
    ...fonts.regular16,
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
  },
  vButton: {
    width: WIDTH * 0.5 - 20,
    marginBottom: 8,
    backgroundColor: colors.white,
    marginRight: 12,
    paddingBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  vSearch: {
    marginLeft: 8,
    width: isIphoneX() ? dimensions.width * 0.67 : dimensions.width * 0.6,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0DBEA',
    ...fonts.regular16,
  },
  vLeftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vImgBack: { width: 24, height: 24, marginRight: 5 },
  vImgFilter: { width: 25, height: 25 },
  vTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
})
