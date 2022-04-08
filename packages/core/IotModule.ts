import { IotNodeFactory } from './IotNodeFactory'
import { IotClient } from './client'
import { IotBus } from './bus'
import { FixLengthQueue, debounce } from './util'
import { IotModuleResponseBusDto, IotModuleResponseClientDto, IotModuleResponseDto, IotTerminalStatus } from './type'
export class IotModule {

  static #ins: IotModule

  #buses: IotBus[] = []
  fixCount = 2
  unit = ''
  warning = 10000
  interval = 2000
  cacheLength = 5
  max: number = 0
  average: number = 0
  maxCache: FixLengthQueue = new FixLengthQueue(this.cacheLength)
  averageCache: FixLengthQueue = new FixLengthQueue(this.cacheLength)
  clientCount: number = 0
  busCount: number = 0
  busNormalCount: number = 0
  busAbnormalCount: number = 0
  busOfflineCount: number = 0
  clientNormalCount: number = 0
  clientAbnormalCount: number = 0
  clientOfflineCount: number = 0

  cb: Function | undefined
 
  setMax () {
    this.max = this.#buses.reduce((max: number, n: IotBus) => {
      return n.clients.reduce((m: number, cl: IotClient) => {
        return m > cl.max ? m : cl.max
      }, max)
    }, 0)

    this.maxCache.push(this.max)
  }

  setAverage () {
    let length = 0
    const total = this.#buses.reduce((average: number, n: IotBus) => {
      return n.clients.reduce((ave: number, cl: IotClient) => {
        length++
        return ave + cl.value || 0
      }, average)
    }, 0)

    

    this.average = Number((length === 0 ? 0 : total / length).toFixed(this.fixCount))
    this.averageCache.push(this.average)
  }

  setCount () {
    this.busCount = this.#buses.length
    this.busNormalCount = 0
    this.busAbnormalCount = 0
    this.busOfflineCount = 0
    this.clientNormalCount = 0
    this.clientAbnormalCount = 0
    this.clientOfflineCount = 0
    this.clientCount = this.#buses.reduce((count: number, bus: IotBus) => {
      switch (bus.status) {
        case IotTerminalStatus.normal:
          this.busNormalCount++
          break
        case IotTerminalStatus.abnormal:
          this.busAbnormalCount++
          break
        case IotTerminalStatus.offline:
          this.busOfflineCount++
          break
      }
      return bus.clients.reduce((cnt: number, cl: IotClient) => {
        switch (cl.status) {
          case IotTerminalStatus.normal:
            this.clientNormalCount++
            break
          case IotTerminalStatus.abnormal:
            this.clientAbnormalCount++
            break
          case IotTerminalStatus.offline:
            this.clientOfflineCount++
            break
        }

        return cnt + 1
      }, count)
    }, 0)

  }

  mount (options: any, cb?: Function) {
    console.log('module start')
    this.fixCount = options.fixCount || this.fixCount
    this.unit = options.unit || this.unit
    this.warning = options.warning || this.warning
    this.interval = options.interval || this.interval
    this.cacheLength = options.cacheLength || this.cacheLength

    this.maxCache = new FixLengthQueue(this.cacheLength)
    this.averageCache = new FixLengthQueue(this.cacheLength)


    const { buses, ...restOptions } = options
    const nodeFactory = new IotNodeFactory()
    this.#buses = buses.map((n: any) => {
      return nodeFactory.create({ ...restOptions, ...n }, this)
    })

    this.#buses.forEach(n => n.mount())
    this.cb = cb
  }

  tick = debounce(() => {
    this.setMax()
    this.setAverage()
    this.setCount()
    this.notify()
  }, 30)

  getJSONData (): IotModuleResponseDto {
    const clients: IotModuleResponseClientDto[] = []
    const buses: IotModuleResponseBusDto[] = this.#buses.map(bus => {
      const clientJsons = bus.clients.map(cl => {

        const clJson: IotModuleResponseClientDto = {
          address: cl.address,
          name: cl.name,
          value: cl.value,
          cache: cl.cache,
          status: cl.status,
          valueString: cl.clacValueString(),
        }

        clients.push(clJson)

        return clJson
      })

      return {
        name: bus.name,
        uri: bus.uri,
        status: bus.status,
        clients: clientJsons
      }
    })


    return {
      max: this.max,
      average: this.average,
      maxCache: this.maxCache.getList(),
      averageCache: this.averageCache.getList(),
      cacheLength: this.cacheLength,
      interval: this.interval,
      busCount: {
        total: this.busCount,
        normal: this.busNormalCount,
        abnormal: this.busAbnormalCount,
        offline: this.busOfflineCount,
      },
      clientCount: {
        total: this.clientCount,
        normal: this.clientNormalCount,
        abnormal: this.clientAbnormalCount,
        offline: this.clientOfflineCount,
      },
      buses,
      clients,
      fixCount: this.fixCount,
      unit: this.unit,
      warning: this.warning,
      
    }
  }


  notify () {
    this.cb?.(this.getJSONData())
  }

  sendCommand (uri: string, data: any) {
    const buses = this.#buses.filter(bus => uri === '' || bus.uri === uri)
    buses.forEach(bus => bus.request(data))
  }

  unmount () {
    console.log('module end')
    this.#buses.forEach(n => n.unmount())
    this.#buses.length = 0
    this.fixCount = 2
    this.unit = ''
    this.warning = 10000
    this.interval = 2000
    this.cacheLength = 5
    this.max = 0
    this.average = 0
    this.maxCache.clear()
    this.averageCache.clear()
    this.clientCount = 0
    this.busCount = 0
    this.cb = undefined
    this.busNormalCount = 0
    this.busAbnormalCount = 0
    this.busOfflineCount = 0
    this.clientNormalCount = 0
    this.clientAbnormalCount = 0
    this.clientOfflineCount = 0
  }

  static get instance () {
    if (!IotModule.#ins) {
      IotModule.#ins = new IotModule()
    }

    return IotModule.#ins
  }
}