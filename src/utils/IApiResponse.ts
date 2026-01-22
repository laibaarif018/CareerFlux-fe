export interface IApiResponse<T = any> {
  statusCode: number
  message: string
  payload?: T
  errors?: { [key: string]: string }
}