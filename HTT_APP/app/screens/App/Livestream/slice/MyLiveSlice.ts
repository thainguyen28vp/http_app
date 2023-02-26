import {
  requestGetListHistoryLive,
  requestGetListLiveStream,
} from '@app/service/Network/livestream/LiveStreamApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let initialState = {
  isLoading: false,
  error: false,
  data: [],
}

export const getListMyLiveThunk = createAsyncThunk(
  'getListMyLive',
  async (payload: any) => {
    return await requestGetListLiveStream(payload)
  }
)

export const ListMyLiveSlice = createSlice({
  name: 'getListMyLive',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListMyLiveThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getListMyLiveThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload.data
    })
    builder.addCase(getListMyLiveThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export default ListMyLiveSlice.reducer
