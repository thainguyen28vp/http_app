import { ApiClient } from '../ApiService'

export const requestUploadMultipleImage = (payload: any) =>
  ApiClient.post(`files/media/upload-multiple`, payload)

export const requestUploadSingleFile = (payload: any) =>
  ApiClient.path(`api/v1/user/session/avatar`, payload)
