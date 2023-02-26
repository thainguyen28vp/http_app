import { GenericInitialState } from '@app/common/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAccounts } from '../api/AccountApi'

let initialState: GenericInitialState<any> = {
  isLoading: true,
  dialogLoading: false,
  data: {},
  error: null,
}

export const requestUserThunk = createAsyncThunk('getAccount', async () => {
  return await getAccounts()
})

export const accountSlice = createSlice({
  name: 'getAccount',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestUserThunk.pending, (state, action) => {
      state.dialogLoading = true
      state.isLoading = true
    })
    builder.addCase(requestUserThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.dialogLoading = false
      state.error = false
      state.data = action.payload.data.user
    })
    builder.addCase(requestUserThunk.rejected, (state, action) => {
      state.isLoading = false
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const selectCount = (state: any) => state.account

export default accountSlice.reducer
