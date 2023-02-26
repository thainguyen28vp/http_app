import { ApiClient } from '@app/service/Network/ApiService'
import {
  LoginPayload,
  RegisterPayload,
  ForgotPassword,
  LogoutPayload,
} from './ApiPayload'

export const requestLogin = (payload: LoginPayload) =>
  ApiClient.post(`/api/v1/user/session`, payload)
export const requestRegister = (payload: RegisterPayload) =>
  ApiClient.post(`/api/v1/user/session/register`, payload)
export const requestLogout = () => ApiClient.put(`/api/v1/user/session/logout`)
export const requestForgotPassword = (payload: ForgotPassword) =>
  ApiClient.put(`client/users/forgot-password`, payload)
export const requestResetPassword = (payload: any) =>
  ApiClient.post(`client/user/request/reset-password`, payload)
export const requestUpdateNewPassword = (payload: any) =>
  ApiClient.post(`client/user/reset-password`, payload)
export const requestGetListShop = () => ApiClient.get(`client/user/shop-follow`)
export const requestCheckPhone = (payload: LoginPayload) =>
  ApiClient.post(`/api/v1/user/session/check_duplicate_phone_number`, payload)
export const requestGetProvinceKiotViet = (phone?: any) =>
  ApiClient.get(`/api/v1/user/kiotviet?phone_number=${phone}`)
export const requestDeleteAccount = () =>
  ApiClient.path(`/api/v1/user/session/me/deactivate`)
