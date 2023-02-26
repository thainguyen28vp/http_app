export interface GenericListInitialState<T> {
  isLoading?: boolean
  isContentLoading?: boolean
  isLoadingAgentPending?: boolean
  isLoadingPending?: boolean
  isLoadingDone?: boolean
  isLoadingHistory?: boolean
  isLoadingCancel?: boolean
  error?: Error | boolean | null
  errorPending?: Error | null | boolean
  errorDone?: Error | null | boolean
  errorHistory?: Error | null | boolean
  errorCancel?: Error | null | boolean
  errorAgentPending?: Error | null | boolean
  data?: T[]
  listPendingOrder?: T[]
  listDoneOrder?: T[]
  listHistoryOrder?: T[]
  listCancelOrder?: T[]
  listAgentPendingOrder?: T[]
  paging?: {
    page: number
    limit: number
  }
  totalPrice?: number | undefined
  dialogLoading?: boolean
  idSelectChildEterprise?: number
  isLoadMore?: boolean
  isLastPage?: boolean
  isCheckAll?: boolean
  countCart?: number
}

export interface GenericInitialState<T> {
  isLoading?: boolean
  dialogLoading?: boolean
  error?: Error | null | boolean
  data?: T
  paging?: {
    page: number
    limit: number
  }
  dataEnterprise?: T
  totalPrice?: number | undefined
  oppor_id?: number | undefined
  isLoadMore?: boolean
  isLastPage?: boolean
  countNotification?: number
  resetFilter?: boolean
  isContentLoading?: boolean
  countConversation?: number
  messageNotRead?: any[]
}
