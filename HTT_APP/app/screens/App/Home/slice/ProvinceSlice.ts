import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericListInitialState } from '@common'
import { getListProvince } from '@app/service/Network/default/DefaultApi'

let initialState: GenericListInitialState<any> = {
  dialogLoading: false,
  error: null,
  data: [],
}

export const requestGetListProvince = createAsyncThunk(
  'province',
  async payload => {
    return await getListProvince(payload)
  }
)

export const ProvinceSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetListProvince.pending, (state, action) => {
      state.dialogLoading = true
    })
    builder.addCase(requestGetListProvince.fulfilled, (state, action) => {
      state.dialogLoading = false
      state.error = false
      state.data = action.payload.data
    })
    builder.addCase(requestGetListProvince.rejected, (state, action) => {
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const {} = ProvinceSlice.actions

export default ProvinceSlice.reducer
