import { colors } from './colors'
import { ViewStyle } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

type styleViewKey =
  | 'centerItem'
  | 'rowItem'
  | 'rowItemBetween'
  | 'rowItemAround'
  | 'rowItemEvenly'
  | 'sharedStyle'
  | 'shadowStyle'
  | 'paddingBottomMain'
  | 'paddingBottomScreen'

export const globalStyle = {
  block: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
}

export const styleView: Record<styleViewKey, ViewStyle> = {
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  rowItem: {
    flexDirection: 'row',
  },
  rowItemBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItemAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowItemEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  sharedStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  paddingBottomMain: {
    paddingBottom: '20%',
  },
  paddingBottomScreen: {
    paddingBottom: isIphoneX() ? 20 : 0,
  },
}
