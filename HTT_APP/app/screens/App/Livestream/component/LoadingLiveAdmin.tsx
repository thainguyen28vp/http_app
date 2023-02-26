import R from '@app/assets/R'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { styles } from '../styles'

const LoadingLiveAdmin = () => {
  return (
    <>
      <ActivityIndicator
        size={60}
        color="#222"
        style={styles.activityIndicator}
      />
      <Text style={styles.loadingText} children={R.strings().loading} />
    </>
  )
}

export default LoadingLiveAdmin
