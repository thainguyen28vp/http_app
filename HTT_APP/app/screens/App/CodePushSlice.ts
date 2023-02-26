import { createSlice } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'
import { number } from 'yup'

let initialState = {
  data: 0,
}

export const CodePushSlice = createSlice({
  name: 'DATA_CODE_PUSH',
  initialState,
  reducers: {
    getDataCodePush: (state, action) => {},
  },
  extraReducers: builder => {
    builder.addCase('DATA_CODE_PUSH', (state, action) => {
      state.data = action?.payload
    })
  },
})

export default CodePushSlice.reducer
