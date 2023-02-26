import { createSlice } from '@reduxjs/toolkit'

let initialState: any = {
  isLoading: true,
  isLoggedIn: false,
}

// export const

export const rootSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.isLoggedIn = true
    },
    logOut: (state, action) => {
      state.isLoggedIn = false
    },
  },
})
export const { logIn, logOut } = rootSlice.actions

export const selectCount = (state: any) => state.account

export default rootSlice.reducer
