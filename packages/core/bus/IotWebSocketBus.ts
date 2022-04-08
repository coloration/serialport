import WebSocket from 'ws'
import { IotBus } from './IotBus'
import { IotClient } from '../client/IotClient'
import { IotTerminalStatus } from '../type'
import { IotModule } from '../IotModule'

export class IotWebSocketBus extends IotBus {
  
  ws: WebSocket | null = null
  #timer: number = 0
  clients: IotClient[] = []
  sendQueue: { key: string, data: ArrayBuffer }[] = []

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

  mount (): void {
    if (this.ws) this.unmount() 
    this.status = IotTerminalStatus.normal
    const socket = new WebSocket(`ws://${this.uri}`)
    socket.binaryType = 'arraybuffer'
    this.ws = socket
    let receiving = false
    console.log('abc', this.uri)
    this.#timer = setInterval(() => {
      if (receiving) return
      if (this.sendQueue.length !== 0) {
        setTimeout(() => {
          const next = this.sendQueue.shift()
          if (next) {
            console.log('send data', next)
            socket.send(next.data)
          }
        }, 100)
      }
    }, 100) as any
    socket.on('message', (data: ArrayBuffer) => {
      console.log('callback', data) 
      receiving = true
      const response = Buffer.from(data)
      Promise.all(this.clients.map((cl) => cl.handler(response)))
      .then(() => {
        this.mod?.tick()
        receiving = false
      })
    })

    socket.on('error', (err) => {
      console.log(err)
    })

    socket.on('open', () => {
      console.log('connect success', this.uri)
      this.clients.forEach((cl, i) => {
        setTimeout(() => {
          cl.mount()
        }, (0))
      })
    })
  }

  unmount(): void {
    if (this.ws) {
      this.clients.forEach(cl => cl.unmount())
      clearInterval(this.#timer)
      this.sendQueue = []
      this.ws.close()
      this.ws = null
      this.status = IotTerminalStatus.offline
    }
  }
  send (d: { key: string, data: ArrayBuffer }): void {
    // this.ws!.send(data)

    let item = this.sendQueue.find(item => item.key === d.key)
    if (item) {
      item.data = d.data
    }
    else {
      this.sendQueue.push(d)
    }
  }

  request (d: any) {
    let item = this.sendQueue.find(item => item.key === d.key)
    if (item) {
      item.data = d.data
    }
    else {
      this.sendQueue.push(d)
    }
    return Promise.resolve()
  }
}
