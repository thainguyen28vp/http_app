import { GenericListInitialState } from '@common'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestGetHome } from '../HomeApi'

let initialState = {
  data: [],
  search: undefined,
}

export const FilterSlice = createSlice({
  name: 'getHome',
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      state.data = action.payload
    },
    handleSearch: (state, action) => {
      state.search = action.payload.search
    },
  },
})

export const { updateFilter, handleSearch } = FilterSlice.actions

export default FilterSlice.reducer
