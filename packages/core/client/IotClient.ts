import { IotTerminalStatus } from '../type'
import { IotBus } from '../bus/IotBus'

export class IotClient {
  #value: number = 0
  address: number = 0
  bus: IotBus | null = null
  name: string = ''
  uri: string = ''
  interval: number = 2000
  unit: string = ''
  calcRatio: number = 1
  calcOffset: number = 0
  fixCount: number = 2
  status: IotTerminalStatus = IotTerminalStatus.offline
  cache: number[] = []
  cacheLength: number = 5
  max: number = this.#value
  average: number = this.#value
  warning: number = 10000

  constructor (options: any, bus: IotBus) {
    this.name = options.name || this.name
    this.bus = bus
    this.uri = options.uri || this.uri
    this.interval = options.interval || this.interval
    this.calcRatio = options.calcRatio || this.calcRatio
    this.calcOffset = options.calcOffset || this.calcOffset
    this.fixCount = options.fixCount || this.fixCount
    this.warning = options.warning || this.warning
    this.unit = options.unit || this.unit
    this.address = options.address || this.address
  }

  get value () {
    return this.#value
  }

  set value (val: number) {
    this.#value = val
    if (this.cache.length === this.cacheLength) {
      this.cache.shift()
    }

    
    this.cache.push(val)

    this.max = Math.max(...this.cache)
    const total = this.cache.reduce((acc, n) => acc + n, 0)
    this.average = total / this.cache.length

    if (this.#value >= this.warning) {
      this.status = IotTerminalStatus.abnormal
    }
    else {
      this.status = IotTerminalStatus.normal
    }
    this.bus?.calcStatus()
  }

  mount () {
    this.status = IotTerminalStatus.normal
  }

  unmount () {
    this.status = IotTerminalStatus.offline
  }


  clacValue (val: number) {
    return ((val + this.calcOffset) * this.calcRatio).toFixed(this.fixCount)
  }

  clacValueString (val?: number): string {
    return Number(val ? this.clacValue(val) : this.value).toFixed(this.fixCount) + this.unit
  }

  handler (...args: any[]) {
    return Promise.resolve()
  }
}