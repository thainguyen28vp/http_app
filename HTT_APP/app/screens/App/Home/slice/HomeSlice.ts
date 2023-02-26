import { GenericListInitialState, GenericInitialState } from '@common'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestGetHome } from '../HomeApi'

let initialState: GenericInitialState<any> = {
  dialogLoading: false,
  isLoading: false,
  error: null,
  data: {},
}

export const requestGetHomeThunk = createAsyncThunk(
  'getHome',
  async payload => {
    return await requestGetHome(payload)
  }
)

export const HomeSlice = createSlice({
  name: 'getHome',
  initialState,
  reducers: {
    deletePost: (state, action) => {
      let target = state.data.posts?.find(
        (item: any) => item.id == action.payload
      )
      state.data.posts?.splice(state.data.posts?.indexOf(target), 1)
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetHomeThunk.pending, (state, action) => {
      state.dialogLoading = true
      state.isLoading = true
    })
    builder.addCase(requestGetHomeThunk.fulfilled, (state, action) => {
      state.dialogLoading = false
      state.isLoading = false
      state.error = false
      state.data = action.payload.data
      state.data.listCategory.forEach(element => {
        element.children_category = [{ id: 0, name: 'Tất cả' }].concat(
          element.children_category
        )
      })
    })
    builder.addCase(requestGetHomeThunk.rejected, (state, action) => {
      state.isLoading = false
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const { deletePost } = HomeSlice.actions

export default HomeSlice.reducer
