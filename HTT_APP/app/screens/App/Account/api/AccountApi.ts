import { ApiClient } from '@app/service/Network/ApiService'

export const getAccounts = (payload?: any) =>
  ApiClient.get('/api/v1/user/session/me')
