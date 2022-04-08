import { RequestType, SigninPayload, ResetPasswordPayload } from '../../../types'
import { request } from './request'
export * from './serialport'

export function signin (param: SigninPayload) {
  return request(RequestType.SIGNIN, param)
  .then((res: any) => {
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res.message)
  })
}

export function resetPassword (params: ResetPasswordPayload) {
  return request(RequestType.RESET_PASSWORD, params)
  .then((res: any) => {
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res.message)
  })
}

export function exportConfigFile () {
  return request(RequestType.EXPORT_CONFIG_FILE)
}

export function importConfigFile (json: any) {
  return request(RequestType.IMPORT_CONFIG_FILE, json)
}

export function resetConfigFile () {
  return request(RequestType.RESET_CONFIG_FILE)
}

export function mountModule () {
  return request(RequestType.START_MODULE)
}

export function unmountModule () {
  return request(RequestType.UNMOUNT_MODULE)
}

export function getHistory () {
  return request(RequestType.READ_HISTORY)
}

export function clearHistory () {
  return request(RequestType.CLEAR_HISTORY)
}

export function sendCommand (uri: string, data: any) {
  return request(RequestType.SEND_COMMAND, { uri, data })
}