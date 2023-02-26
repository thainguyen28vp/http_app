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

export const getListHistoryLiveThunk = createAsyncThunk(
  'getListHistoryLive',
  async (payload: any) => {
    return await requestGetListLiveStream(payload)
  }
)

export const ListHistoryLiveSlice = createSlice({
  name: 'getListHistoryLive',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListHistoryLiveThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getListHistoryLiveThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload.data
    })
    builder.addCase(getListHistoryLiveThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export default ListHistoryLiveSlice.reducer
