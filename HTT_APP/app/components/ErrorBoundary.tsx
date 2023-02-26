import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, fonts } from '@app/theme'
// import * as Sentry from '@sentry/react-native';
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CodePush from 'react-native-code-push'

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: any) {
    console.log(error)
    // Sentry.captureException(error);
    return { hasError: true, error }
  }

  reloadApp = () => {
    CodePush.restartApp()
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.bigBoldText} children={R.strings().app_crash} />
            <Text style={styles.text} children={R.strings().please_report} />
            <Button
              onPress={this.reloadApp}
              style={styles.btnReload}
              children={
                <Text
                  style={styles.txtReload}
                  children={R.strings().restart_app}
                />
              }
            />
          </View>
        </View>
      )
    }

    // if (!NetworkHelper.isInternetReachable) {
    //   return (
    //     <View style={styles.container}>
    //       <View style={[styles.subContainer, { marginHorizontal: 5 }]}>
    //         <FstImage source={R.images.ic_offline} style={styles.icon} />
    //         <Text style={styles.text} children={R.strings().network_offline} />
    //         <Button
    //           onPress={this.reloadApp}
    //           style={styles.btnReload}
    //           children={<Text style={styles.txtReload} children={R.strings().restart_app} />}
    //         />
    //       </View>
    //     </View>
    //   );
    // }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    marginHorizontal: 30,
    alignItems: 'center',
  },
  bigBoldText: {
    ...fonts.bold18,
    letterSpacing: 0.8,
  },
  text: {
    ...fonts.semi_bold16,
    marginTop: 22,
    marginHorizontal: 50,
    letterSpacing: 0.4,
    textAlign: 'center',
    color: colors.grey.dark,
  },
  btnContainer: {
    marginTop: 44,
  },
  restartBtn: {
    marginTop: 34,
  },
  btnReload: {
    marginTop: '10%',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  txtReload: {
    ...fonts.bold14,
    color: 'white',
  },
})
