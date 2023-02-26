import { requestCountCart } from '@app/service/Network/shop/ShopApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let initialState = {
  isLoading: false,
  error: false,
  countCart: null,
}

export const requestGetCountCartThunk = createAsyncThunk(
  'get_count_cart',
  async (payload?: any) => {
    return await requestCountCart(payload)
  }
)

export const CountCartSlice = createSlice({
  name: 'get_count_cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetCountCartThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(requestGetCountCartThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.countCart = action.payload.data
    })
    builder.addCase(requestGetCountCartThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export const {} = CountCartSlice.actions

export default CountCartSlice.reducer
