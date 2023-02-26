import {
  StackActions,
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/core'
import reactotron from 'reactotron-react-native'
export interface RouteProps {
  params: any
}
let _navigator: any // eslint-disable-line

function setTopLevelNavigator(navigatorRef: NavigationContainerRef) {
  _navigator = navigatorRef
}

function navigate(name: string, params?: any) {
  if (_navigator) _navigator.dispatch(CommonActions.navigate(name, params))
}
function replace(name: string, params?: any) {
  if (_navigator) _navigator.dispatch(StackActions.replace(name, params))
}
function push(name: string, params?: any) {
  if (_navigator) _navigator.dispatch(StackActions.push(name, params))
}
function goBack() {
  if (_navigator) _navigator.dispatch(CommonActions.goBack())
}
function pop(count: number) {
  if (_navigator) _navigator.dispatch(StackActions.pop(count || 1))
}
function dismiss() {
  if (_navigator) {
    _navigator.dispatch(StackActions.popToTop())
    goBack()
  }
}

export default {
  dismiss,
  navigate,
  setTopLevelNavigator,
  goBack,
  push,
  replace,
  pop,
}
