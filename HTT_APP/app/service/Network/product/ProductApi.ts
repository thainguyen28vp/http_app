import { ApiClient } from '../ApiService'
import { ProductCustomAttributePayload } from './ProductApiPayload'

export const getListProduct = (payload?: any) =>
  ApiClient.get(`/api/v1/user/product`, { params: payload })

export const getProductDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/product/${payload.product_id}`, payload)

export const getProductCustomAttribute = (
  payload: ProductCustomAttributePayload
) =>
  ApiClient.get(`client/product/${payload.id}/attributeCustom`, {
    params: payload,
  })

export const getProductReview = (payload: any) =>
  ApiClient.get(`user-cart/${payload.product_id}/review-product`, {
    params: payload.body,
  })

export const requestAddToCart = (payload?: any) =>
  ApiClient.post(`/api/v1/u/cart`, payload)

export const requestAddToWishList = (payload: any) =>
  ApiClient.post(`client/product/wishlist/${payload.product_id}`, payload)

export const requestCheckExistProduct = (payload: any) =>
  ApiClient.get(`client/product/${payload.id}/check-product`, payload)

export const requestGetCategory = () =>
  ApiClient.get(`/api/v1/user/product_category`)
