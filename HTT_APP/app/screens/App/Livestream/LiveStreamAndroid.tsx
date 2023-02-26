import React from 'react'
import {
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import CustomLiveAndroid from './component/CustomLiveandroid'
const { CustomModule } = NativeModules
const LiveStreamAndroid = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomLiveAndroid
        style={{ flex: 1, backgroundColor: 'black' }}
        streamKey={'8djs-ep9h-vfqq-9acw-cwu7'}
        streamServer={'rtmp://a.rtmp.youtube.com/live2'}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'yellow',
          position: 'absolute',
          top: 50,
          left: 20,
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
        onPress={() => CustomModule.switchCamera()}
        children={<Text children={'Đổi cam'} />}
      />

      <TouchableOpacity
        style={{
          backgroundColor: 'yellow',
          position: 'absolute',
          bottom: 100,
          left: 20,
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
        onPress={() => CustomModule.startLive()}
        children={<Text children={'Bắt đầu live'} />}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'yellow',
          position: 'absolute',
          bottom: 100,
          right: 20,
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
        onPress={() => CustomModule.stopLive()}
        children={<Text children={'Stop live'} />}
      />

      <View style={{ position: 'absolute', bottom: 20, width: '100%' }}>
        <TextInput
          style={{
            backgroundColor: 'white',
          }}
          placeholder="Oke nhe"
        />
      </View>
    </View>
  )
}

export default LiveStreamAndroid

const styles = StyleSheet.create({})
