import { IotWebSocketBus, IotBus, IotMockBus } from './bus'
import { IotRs485Client, IotClient, IotMockClient } from './client'
import { IotModule } from './IotModule'
import { IotTerminalProtocol, IotTerminalSignal } from './type'

export class IotNodeFactory {
  create (options: any, mod: IotModule) {
    const singal: IotTerminalSignal = options.signal
    const protocol: IotTerminalProtocol = options.protocol
    let IotClientConstrutor: typeof IotClient = IotClient
    let IotBusConstrutor: typeof IotBus = IotBus

    if (protocol === IotTerminalProtocol.rs485) {
      console.log('CLIENT_TYPE: rs485')
      IotClientConstrutor = IotRs485Client
    }
    else {
      console.log('CLIENT_TYPE: mock')
      IotClientConstrutor = IotMockClient
    }


    if (singal === IotTerminalSignal.websocket) {
      console.log('BUS_TYPE: websocket')
      IotBusConstrutor = IotWebSocketBus
    }
    else if (singal === IotTerminalSignal.serial) {

    }
    else {
      console.log('BUS_TYPE: mock')
      IotBusConstrutor = IotMockBus
    }
    
    return new IotBusConstrutor(options, mod, IotClientConstrutor)
  }
}