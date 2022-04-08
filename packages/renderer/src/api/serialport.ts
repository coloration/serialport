import { RequestType } from '../../../types'
import { request } from './request'

export function serialportList () {
  return request(RequestType.SERIALPORT_LIST)
}

export function serialsend () {

}

export function serialOpen (params: any) {
  return request(RequestType.SERIALPORT_LIST)
}

export function serialListen (cb: Function) {
  
}