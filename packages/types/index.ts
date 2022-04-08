import { PlainObject } from "@coloration/kit"

export type SigninPayload = {
  username: string
  password: string
}

export type UserDto = {
  username: string
}

export type NodeStatus = ClientStatus
export enum ClientStatus {
  offline = 0,
  normal = 10,
  warning = 20,
  danger = 30,
} 

export const StatusMap = {
  [ClientStatus.offline]: '离线',
  [ClientStatus.normal]: '正常',
  [ClientStatus.warning]: '异常',
  [ClientStatus.danger]: '危险',
}

export interface DustNodeDto {
  id: string,
  uri: string
  status: NodeStatus,
  clients: DustClientDto[]
}

export interface DustClientDto {
  id: string,
  status: ClientStatus,
  name: string,
  value: number,
  trend: number[]
}


export type ResetPasswordPayload = SigninPayload & {
  newPassword: string
}

export enum IpcType {
  REQUEST_RENDERER_RECEIVE = 'REQUEST_RENDERER_RECEIVE',
  REQUEST_RENDERER_SEND = 'REQUEST_RENDERER_SEND',
  REQUEST_MAIN_RECEIVE = 'REQUEST_RENDERER_SEND',
  REQUEST_MAIN_SEND = 'REQUEST_RENDERER_RECEIVE',  

  IOT_TRANS = 'IOT_TRANS',
  IOT_WARNING = 'IOT_WARNING',
}

export enum RequestType {
  SIGNIN,
  RESET_PASSWORD,

  EXPORT_CONFIG_FILE,
  IMPORT_CONFIG_FILE,
  RESET_CONFIG_FILE,
  
  START_MODULE,
  UNMOUNT_MODULE,
  
  READ_HISTORY,
  CLEAR_HISTORY,
  SEND_COMMAND,


  SERIALPORT_LIST,
  SERIALPORT_OPEN,
}

export enum IotNodeSignal {
  websocket = 'ws',
  serial = 'serial',
}

export enum IotNodeProtocol {
  rs485 = 'rs485',
}

export interface IIotNode {
  signal: IotNodeSignal
  name: string
  uri: string
  unit: string
  protocol: IotNodeProtocol
  readInterval: number // ms
  readCommand: string
  calcRatio: number
  calcOffset: number
  clients: IIotClient[]

  addListener: (callback: (client: IIotClient, node: IIotNode) => void) => void
  removeListener: (callback: Function) => void
  mount: () => void 
  unmount: () => void

}

export interface IIotClient {
  name: string
  calcRatio: number
  calcOffset: number
  unit: string
  node: IIotNode,

  getValueString: () => string

}

export interface IIotRs485Client extends IIotClient {
  address: number,
  readCommand: string
  readInterval: number // ms
  bit: number
}

export interface PortInfo {
  path: string,
  manufacturer: string,
  serialNumber: string,
  pnpId: string,
  locationId: string,
  vendorId: string,
  productId: string
}
