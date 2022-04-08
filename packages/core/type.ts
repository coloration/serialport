export enum IotTerminalStatus {
  offline = 0,
  normal = 10,
  abnormal = 20
}

export enum IotTerminalSignal {
  MOKE = '_',
  websocket = 'ws',
  serial = 'serial',
}

export enum IotTerminalProtocol {
  MOKE = '_',
  rs485 = 'rs485',
}


export interface IotModuleResponseBusDto {
  name: string
  uri: string
  status: IotTerminalStatus
  clients: IotModuleResponseClientDto[]
}

export interface IotModuleResponseClientDto {
  address: number,
  name: string,
  value: number,
  cache: number[],
  valueString: string,
  status: IotTerminalStatus

}

export interface IotModuleResponseDto {
  fixCount: number,
  unit: string,
  warning: number,
  max: number,
  average: number,
  interval: number,
  cacheLength: number,
  maxCache: number[]
  averageCache: number[]
  busCount: {
    total: number
    normal: number
    abnormal: number
    offline: number
  },
  clientCount: {
    total: number,
    normal: number,
    abnormal: number,
    offline: number,
  },
  buses: IotModuleResponseBusDto[],
  clients: IotModuleResponseClientDto[]
}

export interface IotHistoryItemDto {
  date: string
  max: number
  warningCount: number,
  clients: String[]
}


export interface IotBaseConfigure {
  readCommand: string
  readInterval: number
  calcRatio: number
  calcOffset: number
}

export interface IotClientConfigure extends IotBaseConfigure {
  name: string
  address: number
}

export interface IotBusConfigure extends IotBaseConfigure {
  name: string,
  uri: string,
  clients: IotClientConfigure[]
}

export interface IotModuleConfigure extends IotBaseConfigure {
  signal: IotTerminalSignal,
  protocol: IotTerminalProtocol,
  fixCount: number,
  unit: string,
  warning: number,
  max: number,
  average: number,
  interval: number,
  cacheLength: number,
  buses: IotBusConfigure[]
}