import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { fonts } from '@app/theme'
import { isIphoneX } from 'react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
  v_major: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red'
  },
  v_major_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15 * scale,
    paddingVertical: 10 * scale,
  },
  img24: {
    width: 24 * scale,
    height: 24 * scale,
  },
  txt_major: {
    color: '#69747E',
    ...fonts.regular16,
  },
  txt_arrow: {
    color: '#373E50',
    ...fonts.medium14,
  },
  v_arrow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  v_sort: {
    backgroundColor: '#F1F3F5',
    height: 44 * scale,
    justifyContent: 'center',
  },
  v_type: {
    paddingHorizontal: 15 * scale,
  },
  v_item1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img20: {
    width: 20 * scale,
    height: 20 * scale,
  },
  txt_item: {
    color: '#373E50',
    ...fonts.regular16,
    marginLeft: 10 * scale,
  },
  viewLine: {
    width: 345 * scale,
    alignSelf: 'center',
    marginTop: 14 * scale,
    height: 1,
    // borderWidth: 1,
    backgroundColor: '#CED4DA',
  },
  v_star: {
    width: 107 * scale,
    height: 40 * scale,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10 * scale,
  },
  txt_star: {
    ...fonts.regular15,
  },
  v_main_star: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  v_main_star_2: {
    marginTop: 12 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15 * scale,
    width: 226 * scale,
  },
  btn_bottom: {
    alignSelf: 'center',
    height: 50 * scale,
    backgroundColor: '#E84343',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? '3.5%' : '2%',
    borderRadius: 50,
    paddingHorizontal: '30%',
  },
  txt_btn: {
    color: '#FFFFFF',
    ...fonts.semi_bold16,
  },
})
