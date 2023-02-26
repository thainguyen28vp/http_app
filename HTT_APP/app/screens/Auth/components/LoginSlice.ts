import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'
import AuthApi from '../AuthApi'
import { LoginPayload } from '../ApiPayload'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER } from '@app/config/screenType'

const initState = {
  isError: false,
  isLoading: false,
  data: [],
}

export const requestLogin = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, thunkApi) => {
    const res = await AuthApi.login(payload)
    return res
  }
)
const LoginSlice = createSlice({
  name: 'login',
  initialState: initState,
  reducers: {
    resetDataLogin: state => {
      state.data = []
    },
  },
  extraReducers: {
    [requestLogin.pending]: (state, action) => {
      state.isLoading = true
      state.isError = false
      return state
    },

    [requestLogin.fulfilled]: (state, action) => {
      state.isLoading = false
      state.isError = false
      state.data = action.payload.result_detail[0]
      return state
    },
    [requestLogin.rejected]: (state, action) => {
      state.isLoading = false
      state.isError = true
      return state
    },
  },
})

export const { actions } = LoginSlice
export const { resetDataLogin } = LoginSlice.actions
export default LoginSlice.reducer
