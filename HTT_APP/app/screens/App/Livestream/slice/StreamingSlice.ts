import { requestGetLiveStreaming } from '@app/service/Network/livestream/LiveStreamApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let initialState = {
  isLoading: false,
  error: false,
  data: [],
}

export const getStreamLiveThunk = createAsyncThunk(
  'getStreamming',
  async () => {
    return await requestGetLiveStreaming()
  }
)

export const StreamSlice = createSlice({
  name: 'getStreamming',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getStreamLiveThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getStreamLiveThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload.data
    })
    builder.addCase(getStreamLiveThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export default StreamSlice.reducer
