import { BASE_REQUEST } from '@app/config/Constants'
import { ApiClient } from '../ApiService'

//
export const requestCreateLiveStream = (payload: object) =>
  ApiClient.post(`api/v1/user/livestream`, payload)

//create Live
export const requestStartLiveStream = (id: number) =>
  ApiClient.post(`api/v1/user/livestream/${id}/start`)

export const requestStopLiveStream = (id: number) =>
  ApiClient.post(`api/v1/user/livestream/${id}/stop`)

export const requestGetListLiveStream = (payload?: object) =>
  ApiClient.get(`api/v1/user/livestream`, { params: payload })

export const requestUploadImage = (payload: { type: number; formData: any }) =>
  ApiClient.post(`api/v1/files/upload/single/${payload.type}`, payload.formData)

export const requestUploadMultipleImage = (payload: {
  type: number
  formData: any
}) =>
  ApiClient.post(
    `api/v1/files/upload/multiple/${payload.type}`,
    payload.formData
  )

export const requestJoinLive = (id: number) =>
  ApiClient.post(`api/v1/user/livestream/${id}/join`)
export const requestLeaveLive = (id: number) =>
  ApiClient.post(`livestream/${id}/leave`)

export const requestGetListHistoryLive = () =>
  ApiClient.get(`api/v1/user/livestream/history`)

export const requestUpdateProductLive = (payload: any) =>
  ApiClient.post(
    `api/v1/user/livestream/${payload.livestream_id}/product`,
    payload.body
  )

export const requestDeleteProduct = (payload: any) =>
  ApiClient.delete(`api/v1/user/livestream/${payload.livestream_id}/product`, {
    data: payload.body,
  })

export const requestPostProductSell = (payload: any) =>
  ApiClient.post(
    `api/v1/user/livestream/${payload.livestream_id}/highlight/${payload.product_id}`
  )

export const requestCreateCommentLive = (payload: any) =>
  ApiClient.post(
    `api/v1/user/livestream/${payload.livestream_id}/comment`,
    payload.body
  )

export const requestGetLiveStreaming = () =>
  ApiClient.get(`api/v1/user/livestream/streaming`)

export const requestPing = (livestream_id: number) =>
  ApiClient.post(`api/v1/user/livestream/${livestream_id}/ping`)

export const requestGetListComment = (payload: any) =>
  ApiClient.get(`comment`, { params: payload })

// reaction live
export const requestReaction = (payload: any) =>
  ApiClient.post(
    `api/v1/user/livestream/${payload.livestream_id}/reaction`,
    payload.body
  )

export const requestStartRecordLive = (livestream_id: number) =>
  ApiClient.post(`livestream/${livestream_id}/start-record`)

export const requestStopRecordLive = (livestream_id: number) =>
  ApiClient.post(`livestream/${livestream_id}/stop-record`)

//Detail livestream
export const requestGetDetailLiveStream = (livestream_id: number) =>
  ApiClient.get(`api/v1/user/livestream/${livestream_id}`)

export const requestDeleteLive = (livestream_id: number) =>
  ApiClient.delete(`api/v1/user/livestream/${livestream_id}`)

export const getListCommentHistory = (livestream_id: number) =>
  ApiClient.get(`api/v1/user/livestream/${livestream_id}/comment`)

export const requestSendeNoti = (payload: any) =>
  ApiClient.post(
    `api/v1/user/livestream/${payload.livestream_id}/notification`,
    payload.body
  )

export const requestGetProvinceKiotVietInviteCode = () =>
  ApiClient.get(`/api/v1/user/kiotviet/list`)
