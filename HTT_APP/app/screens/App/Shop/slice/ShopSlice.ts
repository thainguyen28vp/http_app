import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericInitialState } from '@common'
import { getListOrder, getShopDetail } from '@app/service/Network/shop/ShopApi'
import reactotron from 'reactotron-react-native'
import { SHOP_TAB } from '@app/config/Constants'

let initialState: GenericInitialState<any> = {
  isLoading: false,
  dialogLoading: false,
  error: undefined,
  data: SHOP_TAB.map(item => ({
    loading: true,
    error: null,
    tabData: {},
  })),
  resetFilter: false
}

export const requestShopDetailThunk = createAsyncThunk(
  'shop',
  async (payload: any) => {
    return await getShopDetail(payload)
  }
)

export const ShopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateResetFilter: (state, action) => {
      state.resetFilter = action.payload
    } 
  },
  extraReducers: builder => {
    builder.addCase(requestShopDetailThunk.pending, (state, action) => {
      const tab = action.meta.arg.tab
      state.data[tab].loading = true
    })
    builder.addCase(requestShopDetailThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false

      const tab = action.meta.arg.tab
      state.data[tab].loading = false
      state.data[tab].tabData = action.payload.data
    })
    builder.addCase(requestShopDetailThunk.rejected, (state, action) => {
      const tab = action.meta.arg.tab
      state.data[tab].loading = false
      state.data[tab].error = true
    })
  },
})

export const {updateResetFilter} = ShopSlice.actions

export default ShopSlice.reducer
