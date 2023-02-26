import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericListInitialState, GenericInitialState } from '@common'
import { GIFT_OWNER_STATUS } from '@app/config/Constants'
import { getListGift } from '@app/service/Network/account/AccountApi'

const GIFT_TYPE = [GIFT_OWNER_STATUS.NOT_USED, GIFT_OWNER_STATUS.USED]

let initialState: GenericInitialState<any> = {
  isLoading: true,
  error: undefined,
  data: GIFT_TYPE.map(item => ({
    loading: true,
    error: null,
    giftData: []
  })),
}

export const requestGetListGiftThunk = createAsyncThunk(
  'list_gift',
  async (payload: any) => { 
    return await getListGift(payload.body)
  }
)

export const MyGiftSlice = createSlice({
  name: 'order_rating',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetListGiftThunk.pending, (state, action) => {
      const index = action.meta.arg.index
      state.data[index].loading = true
    })
    builder.addCase(requestGetListGiftThunk.fulfilled, (state, action) => {
      const index = action.meta.arg.index
      state.data[index].loading = false
      state.data[index].giftData = action.payload.data
    })
    builder.addCase(requestGetListGiftThunk.rejected, (state, action) => {
      const index = action.meta.arg.index
      state.data[index].loading = false
      state.data[index].error = true
    })
  },
})

export const {} = MyGiftSlice.actions

export default MyGiftSlice.reducer
