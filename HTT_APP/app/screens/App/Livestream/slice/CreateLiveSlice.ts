import { requestGetListLiveStream } from '@app/service/Network/livestream/LiveStreamApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
let initialState = {
  isLoading: false,
  error: false,
  data: {
    infoLive: {},
  },
}
export const ListLiveStreamSlice = createSlice({
  name: 'createLive',
  initialState,
  reducers: {
    updateInfoLive: (state, action) => {
      state.data.infoLive = {
        titleLive: action.payload.title,
        url: action.payload.url,
      }
    },
  },
})
export const { updateInfoLive } = ListLiveStreamSlice.actions
export default ListLiveStreamSlice.reducer
