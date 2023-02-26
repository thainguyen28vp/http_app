import {
  AudioLocalState,
  AudioRemoteState,
  LocalVideoStreamState,
  NetworkQuality,
  VideoRemoteState,
} from 'react-native-agora'

export const getVideoRemoteState = (state: number) => {
  switch (state) {
    case VideoRemoteState.Stopped:
      // return 'Video turned off by Host'
      return 'Video trực tiếp đã kết thúc!'
    case VideoRemoteState.Starting:
      return 'The first remote video packet is received.'
    case VideoRemoteState.Decoding:
      return 'The remote video stream is decoded and plays normally, probably due to'
    case VideoRemoteState.Frozen:
      return 'Connection Issue, Please Wait'
    case VideoRemoteState.Failed:
      return 'Network Error'
  }
}
export const getLocalVideoStreamState = (state: number) => {
  switch (state) {
    case LocalVideoStreamState.Capturing:
      return 'The local video capturer starts successfully'
    case LocalVideoStreamState.Encoding:
      return 'The first local video frame encodes successfully.'
    case LocalVideoStreamState.Failed:
      return 'The local video fails to start.'
    case LocalVideoStreamState.Stopped:
      return 'The local video is in the initial state.'
  }
}
export const getLocalAudioStreamState = (state: number) => {
  switch (state) {
    case AudioLocalState.Recording:
      return 'The recording device starts successfully.'
    case AudioLocalState.Encoding:
      return 'The first audio frame encodes successfully.'
    case AudioLocalState.Failed:
      return 'The local audio fails to start.'
    case AudioLocalState.Stopped:
      return 'The local audio is in the initial state.'
  }
}
export const getRemoteAudioStreamState = (state: number) => {
  switch (state) {
    case AudioRemoteState.Stopped:
      return 'The remote audio is in the default state'
    case AudioRemoteState.Starting:
      return 'The first remote audio packet is received.'
    case AudioRemoteState.Decoding:
      return 'The remote audio stream is decoded and plays normally'
    case AudioRemoteState.Frozen:
      return 'The remote audio is frozen'
    case AudioRemoteState.Failed:
      return 'The remote audio fails to start'
  }
}
export const getNetworkQuality = (state: number) => {
  switch (state) {
    case NetworkQuality.Unknown:
      return 'Unknown'
    case NetworkQuality.Excellent:
      return 'Excellent'
    case NetworkQuality.Good:
      return 'Good'
    case NetworkQuality.Poor:
      return 'Poor'
    case NetworkQuality.Bad:
      return 'Bad'
    case NetworkQuality.VBad:
      return 'Very bad'
    case NetworkQuality.Unsupported:
      return 'Unsupported'
  }
}
