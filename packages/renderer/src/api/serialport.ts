import { RequestType } from '../../../types'
import { request } from './request'

export function serialportList () {
  return request(RequestType.SERIALPORT_LIST)
}

export function serialsend () {

}

export function serialListen () {
  
}