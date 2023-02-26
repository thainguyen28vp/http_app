import { ApiClient } from '../ApiService'

export const getFavoriteTopic = () =>
  ApiClient.get(`/api/v1/user/session/topic`)

export const requestMarkFavoriteTopic = (payload: any) =>
  ApiClient.put(`/api/v1/user/session/${payload.topic_id}/topic`, payload)

export const requestChangePassword = (payload: any) =>
  ApiClient.path(`/api/v1/user/session/me/password`, payload)

export const requestUpdateUserInfor = (payload: any) =>
  ApiClient.put(`users/update-info`, payload)

export const getListFavoriteProduct = (payload: any) =>
  ApiClient.get(`client/product/wishlist`, { params: payload })

export const requestUpdateReferral = (payload: any) =>
  ApiClient.put(`client/customer/referal`, payload)

export const getListGift = (payload: any) =>
  ApiClient.get(`/api/v1/user/gift/owner`, { params: payload })
