import { IotTerminalStatus } from '../type'
import { IotClient } from '../client'
import { IotModule } from '../IotModule'

export class IotBus {
  uri: string = ''
  name: string = ''
  interval: number = 2000
  unit: string = ''
  calcRatio: number = 1
  calcOffset: number = 0
  status: IotTerminalStatus = IotTerminalStatus.offline
  clients: IotClient[] = []
  mod: IotModule | null = null


  constructor (options: any, mod: IotModule, _: typeof IotClient) {
    this.uri = options.uri || this.uri
    this.name = options.name || this.name
    this.interval = options.interval || this.interval
    this.unit = options.unit || this.unit
    this.calcRatio = options.calcRatio || this.calcRatio
    this.calcOffset = options.calcOffset || this.calcOffset

    this.mod = mod
  }

  mount () {
    this.status = IotTerminalStatus.normal
  }


  unmount () {
    this.status = IotTerminalStatus.offline
  }

  calcStatus () {
    if (this.status === IotTerminalStatus.offline) return
    if (this.clients.some(cl => cl.status === IotTerminalStatus.abnormal)) {
      this.status = IotTerminalStatus.abnormal
    }
    else {
      this.status = IotTerminalStatus.normal
    }
  }

  send (data: any) {
  }

  request(data: any) {
    return Promise.resolve()
  }
}

