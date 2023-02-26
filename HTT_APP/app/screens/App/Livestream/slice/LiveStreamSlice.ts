import { requestGetListLiveStream } from '@app/service/Network/livestream/LiveStreamApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let initialState = {
  isLoading: false,
  error: false,
  data: [],
}

export const getListLiveStreamThunk = createAsyncThunk(
  'getListLiveStream',
  async (payload: object) => {
    return await requestGetListLiveStream(payload)
  }
)

export const ListLiveStreamSlice = createSlice({
  name: 'getListLiveStream',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListLiveStreamThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getListLiveStreamThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload.data
    })
    builder.addCase(getListLiveStreamThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export default ListLiveStreamSlice.reducer
