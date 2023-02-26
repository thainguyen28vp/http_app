import { ApiClient } from '@app/service/Network/ApiService'

export const getAccounts = (payload: any) =>
  ApiClient.get('/api/v1/user/session/me', payload)
export const getListCategory = (payload?: any) =>
  ApiClient.get(`client/category`, payload)

export const requestGetHome = (payload?: any) =>
  ApiClient.get(`/api/v1/user/home`, payload)
