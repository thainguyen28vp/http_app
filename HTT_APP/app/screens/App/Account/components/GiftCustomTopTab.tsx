import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, styleView } from '@app/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const GiftCustomTopTab = (props: any) => {
  const { tabs, activeTab, goToPage, initialTab } = props

  return (
    <View style={styles.tabs}>
      {tabs.map((item: string, index: number) => (
        <Button
          style={{ flex: 1, ...styleView.centerItem }}
          onPress={() => goToPage(index)}
          children={
            <Text
              style={{
                fontSize: 16,
                color: activeTab == index ? colors.primary : '#595959',
                fontFamily: activeTab == index ? R.fonts.sf_medium : R.fonts.sf_regular
              }}
              children={item}
            />
          }
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    ...styleView.rowItemBetween,
    height: 44,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
})
export default GiftCustomTopTab
