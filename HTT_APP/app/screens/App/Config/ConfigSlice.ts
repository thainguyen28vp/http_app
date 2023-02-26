import { getConfig } from '@app/service/Network/home/HomeApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let initialState = {
  isLoading: true,
  data: {},
  error: false,
}

export const requestConfigThunk = createAsyncThunk('getConfig', async () => {
  return await getConfig()
})

export const ConfigSlice = createSlice({
  name: 'getConfig',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestConfigThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(requestConfigThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false
      state.data = action.payload.data
    })
    builder.addCase(requestConfigThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export default ConfigSlice.reducer
