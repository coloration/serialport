import { IotClient } from './IotClient'
import { formatNumberAddressToHex, suffixCrc } from '../util'
import { IotTerminalStatus } from '../type'
import { IotBus } from '../bus/IotBus'

export class IotMockClient extends IotClient {
  #readCommand: string = ''
  #updateCommand: string = ''
  #address: number = 1
  #timer: number = 0

  constructor (options: any, bus: IotBus) {
    super(options, bus)
    this.#address = options.address || this.#address
    this.#readCommand = options.readCommand || this.#readCommand 
    this.#updateCommand = options.updateCommand || this.#updateCommand 
  }

  mount () {
    if (
      !this.bus 
      || this.bus.status !== IotTerminalStatus.normal
    ) return
    clearInterval(this.#timer)
    // 11 => 0A
    const hexAddress = formatNumberAddressToHex(this.#address)
    
    // 010300000002 => 010300000002C40B
    const readBufferString = suffixCrc(`${hexAddress}${this.#readCommand}`)
    
    // string -> arrayBuffer
    const readBuffer = Buffer.from(readBufferString, 'hex')

    this.#timer = setInterval(() => {
      this.bus?.send(readBuffer)
    }, this.interval) as any

    super.mount()
  }

  unmount() {
    super.unmount()
    clearInterval(this.#timer)
  }
  
  handler (response: Buffer) {
    if (this.#address !== response[0]) return Promise.resolve()
    const resCommand = response[1]
    const responseData = response.slice(3, 3 + response[2])
    if (parseInt(this.#readCommand.slice(0, 2)) === resCommand) {
      this.handleRead(responseData)
    }

    return Promise.resolve()
  }

  handleRead (data: Buffer) {
    const value = data.reduce((acc: number, current: number, i: number) => {
      return acc * Math.pow(256, i) + current
    }, 0)

    this.value = Number(this.clacValue(value))
  }
}