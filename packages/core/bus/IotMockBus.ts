import { IotTerminalStatus } from '../type'
import { IotClient } from '../client/IotClient'
import { IotBus } from './IotBus'
import { IotModule } from '../IotModule'

export class IotMockBus extends IotBus {

  #timer: number = 0
  constructor (
    options: any, 
    mod: IotModule,
    IotClientConstrutor: typeof IotClient
  ) {
    const { clients, ...restOptions } = options
    super(restOptions, mod, IotClientConstrutor)

    if (Array.isArray(options.clients)) {
      this.clients = options.clients.map((clOpt: any) => {
        return new IotClientConstrutor({ ...restOptions, ...clOpt }, this)
      })
    }
  }

  mount () {
    console.log('connected:', this.uri)
    this.status = IotTerminalStatus.normal
    this.clients.forEach(cl => {
      cl.mount()
    })
    clearInterval(this.#timer)
    this.#timer = setInterval(() => {
      const response = Buffer.from(`0${Math.floor(Math.random() * this.clients.length) + 1}030200${Math.ceil(Math.random() * 255).toString(16)}840A`, 'hex')
      Promise.all(this.clients.map((cl) => cl.handler(response)))
      .then(() => {
        this.mod?.tick()
      })
    }, this.interval) as any
  }


  unmount () {
    this.status = IotTerminalStatus.offline
    clearInterval(this.#timer)
  }

  send (data: any) {
    // noop
  }
}

