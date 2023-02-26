import { ApiClient } from '../ApiService'
import { CommentPayload, PostPayload } from './HomeApiPayload'

export const getListTopic = () => ApiClient.get(`/api/v1/user/topic`)

export const getListPost = (payload: PostPayload) =>
  ApiClient.get(`/api/v1/user/post`, { params: payload })

export const getPostDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/post/${payload.id}`, payload)

export const getComment = (payload: CommentPayload) =>
  ApiClient.get(`/api/v1/post/comments`, { params: payload })

export const requestCreatePost = (payload: any) =>
  ApiClient.post(`/api/v1/user/post`, payload)

export const requestEditPost = (payload: any) =>
  ApiClient.put(`/api/v1/user/post/${payload.id}`, payload.body)

export const requestDeletePost = (payload: any) =>
  ApiClient.delete(`/api/v1/user/post/${payload.id}`, payload)

export const requestReactionPost = (payload: any) =>
  ApiClient.put(`api/v1/post/${payload.post_id}/reaction`)

export const requestReactionComment = (payload: any) =>
  ApiClient.post(
    `api/v1/post/${payload.post_id}/reaction/${payload.comment_id}/comment`
  )

export const requestCreateComment = (payload: any) =>
  ApiClient.post(`api/v1/post/${payload.post_id}/comment`, payload.body)

export const getPreviousComment = (payload: any) =>
  ApiClient.get(`api/v1/post/comment/${payload.comment_id}/more`, {
    params: payload.body,
  })

export const getListHistoryPoint = (payload: any) =>
  ApiClient.get(`api/v1/user/point/transactions`, { params: payload })

export const getListGift = (payload: any) =>
  ApiClient.get(`api/v1/user/gift`, { params: payload })

export const requestPurchaseGift = (payload: any) =>
  ApiClient.post(
    `/api/v1/user/gift/${payload.gift_id}/purchase-gift`,
    payload.body
  )

export const getCountCart = (payload?: any) =>
  ApiClient.get(`user-cart/count-cart`, payload)
export const getNews = (payload?: any) =>
  ApiClient.get(`/api/v1/user/news`, { params: payload })
export const getNewsDetail = (id?: any) =>
  ApiClient.get(`/api/v1/user/news/${id}`)

export const getListCoin = (payload: any) =>
  ApiClient.get(`api/v1/user/coin/transactions`, { params: payload })
export const getRechargeCoin = () => ApiClient.get(`api/v1/user/configuration`)
export const getConfig = () => ApiClient.get(`api/v1/user/configuration`)
