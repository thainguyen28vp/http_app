import { ApiClient } from '../ApiService'

export const getListCart = (payload: any) => ApiClient.get(`/api/v1/u/cart`)

export const requestEditCartItem = (payload: any) =>
  ApiClient.path(`api/v1/u/cart/${payload.id}/change_quantity`, payload.body)

export const requestAddToCart = (payload: any) =>
  ApiClient.post(`user-cart`, payload)

export const requestDeleteCartItem = (payload: any) =>
  ApiClient.delete(`/api/v1/u/cart/${payload.id}`, payload)

export const requestDeleteAllCartItem = () =>
  ApiClient.delete(`/api/v1/u/cart/clear`)

export const requestAddNewReceiver = (payload: any) =>
  ApiClient.post(`/api/v1/u/address_book`, payload)

export const getReceiverInfor = (payload: any) =>
  ApiClient.get(`client/user-address/${payload.id}`, payload)

export const requestEditReceiver = (payload: any) =>
  ApiClient.put(`/api/v1/u/address_book/${payload.id}`, payload.body)

export const getListReceiver = (payload: any) =>
  ApiClient.get(`/api/v1/u/address_book`, { params: payload })

export const requestDeleteUserAddress = (id: any) =>
  ApiClient.delete(`/api/v1/u/address_book/${id}`)

export const getDefaultCustomerInfor = (payload: any) =>
  ApiClient.get(`client/user-address/default-shop`, payload)

export const requestCreateNewOrder = (payload: any) =>
  ApiClient.post(`/api/v1/user/order`, payload)
///
export const getListOrder = (payload: any) =>
  ApiClient.get(`/api/v1/user/order`, { params: payload })
//
export const getOrderItemDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/order/${payload.order_id}`, payload)

export const requestCancelOrder = (payload: any) =>
  ApiClient.delete(`client/order/${payload.order_id}/order`, payload)

export const requestCountCart = (payload?: any) =>
  ApiClient.get(`user-cart/count-cart`, payload)

export const getListShop = (payload: any) =>
  ApiClient.get(`client/shop`, { params: payload })

export const getListCategory = (payload: any) =>
  ApiClient.get(`client/category`, payload)

export const getShopDetail = (payload: any) =>
  ApiClient.get(`client/shop/${payload.shop_id}/${payload.tab}`, {
    params: payload.body,
  })

export const requestReviewOrder = (payload: any) =>
  ApiClient.post(`api/v1/user/order/${payload.id_order}/rating`, payload.body)

export const getListVoucher = (payload: any) =>
  ApiClient.get('api/v1/user/gift', { params: payload })

export const requestRedeemVoucher = (payload: any) =>
  ApiClient.put('api/v1/user/gift/redeem', payload)

export const requestFollowShop = (payload: any) =>
  ApiClient.put(`client/shop/${payload.shopId}/change-follow`, payload.body)

export const requestGetListShopFollow = (payload: any) =>
  ApiClient.get(`client/shop/list-follow`, { params: payload })

export const requestGetListFlower = (payload: any) =>
  ApiClient.get(`api/v1/user/flower_delivery`, { params: payload })

export const requestCreateFlower = (payload: any) =>
  ApiClient.post(`api/v1/user/flower_delivery`, payload)
