import { ApiClient } from '../ApiService'

// send message to create new channel topic
export const requestSendNewTopic = (payload?: any) =>
  ApiClient.post(`/api/v1/message/new_topic`, payload)

// send message to old channel topic
export const requestSendExistConversation = (payload: any) =>
  ApiClient.post(
    `/api/v1/message/${payload.topic_message_id}/message`,
    payload.body
  )

// get list of all message topic - param (page:24)
export const getListConversation = (payload: any) =>
  ApiClient.get(`/api/v1/message/topic`, { params: payload })

// get all message in detail topic - param (page:24)
export const getDetailConversation = (payload: any) =>
  ApiClient.get(`/api/v1/message/${payload.topic_message_id}`, {
    params: payload.body,
  })

// get shop_id and user_id  in detail topic to show Name, Avatar
export const getConversationUserInfor = (payload: any) =>
  ApiClient.get(`/api/v1/message/${payload.id}/topic`, payload)

export const checkExistConversation = (payload: any) =>
  ApiClient.get(`/api/v1/message/${payload.shop_id}/exist`, payload)

export const updateChatState = (payload: any) =>
  ApiClient.get(`/api/v1/message/message_not_read`, payload)

export const requestReadAllChat = (payload: any) =>
  ApiClient.put(`/api/v1/message/${payload.topic_message_id}/read`)
