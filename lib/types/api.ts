export type ApiReturn = {
  status: boolean
  message: string
}

export type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

export type ApiError = {
  status: boolean | number
  message: string
  error: string
}

export type UninterceptedApiError = {
  status: boolean
  message: string | Record<string, string[]>
}
