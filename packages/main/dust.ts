import defaultConfig from './template/device.json'
import Store from 'electron-store'
import { regist } from './requestServer'
import { IpcType, RequestType } from '../types'
import { IotModule, IotModuleResponseBusDto, IotModuleResponseDto, IotTerminalStatus } from '../core'
import { formatDate, formatTime } from './util'
import { IotHistory } from '../core/IotHistory'

const DUST_CONFIG_STORE_KEY = 'COAL_DUST'


const dustStore = new Store()

// dustStore.delete(DUST_CONFIG_STORE_KEY)


const oldDustConf = dustStore.get(DUST_CONFIG_STORE_KEY) 

if (!oldDustConf) {
  dustStore.set(DUST_CONFIG_STORE_KEY, defaultConfig)
}

regist(RequestType.EXPORT_CONFIG_FILE, (e: any) => {
  const conf = dustStore.get(DUST_CONFIG_STORE_KEY)
  return e.reply({ status: 200, message: '', data: conf })
})

regist(RequestType.IMPORT_CONFIG_FILE, (e: any, json: any) => {
  const conf = dustStore.set(DUST_CONFIG_STORE_KEY, json)
  return e.reply({ status: 200, message: '', data: conf })
})

regist(RequestType.RESET_CONFIG_FILE, (e: any) => {
  const conf = dustStore.set(DUST_CONFIG_STORE_KEY, defaultConfig)
  return e.reply({ status: 200, message: '', data: conf })
})


regist(RequestType.START_MODULE, (e: any) => {
  const conf: any = dustStore.get(DUST_CONFIG_STORE_KEY)

  conf.signal = ''
  conf.protocol = ''

  const sys = IotModule.instance
  sys.unmount()
  sys.mount(conf, function onTick (data: IotModuleResponseDto) {
    e.event.reply(IpcType.IOT_TRANS, data)

    const abnormalBuses = data.buses
    .filter((bus: IotModuleResponseBusDto) => bus.status === IotTerminalStatus.abnormal)
    
    if (abnormalBuses.length > 0) {
      const d = new Date()
      const dateString = formatDate(d)
      const timeString = formatTime(d)

      const warningData = abnormalBuses.reduce((acc: any, bus: IotModuleResponseBusDto) => {

        acc.bus.push(bus)
        bus.clients
        .filter(cl => cl.status === IotTerminalStatus.abnormal)
        .forEach(cl => {
          acc.client.push(cl)
        })
  
        return acc
      }, {
        date: `${dateString} ${timeString}`,
        bus: [],
        client: [],
      })

      IotHistory.instance.setHistory(warningData)
      e.event.reply(IpcType.IOT_WARNING, warningData)
    }


  })

  return e.reply({ status: 200, message: '', data: conf })
})


regist(RequestType.UNMOUNT_MODULE, (e: any) => {
  const sys = IotModule.instance
  sys.unmount()

  return e.reply({ status: 200, message: '', data: null })
})


regist(RequestType.READ_HISTORY, (e: any) => {
  const history = IotHistory.instance.getHistory()

  return e.reply({ status: 200, message: '', data: history })
})


regist(RequestType.CLEAR_HISTORY, (e: any) => {
  IotHistory.instance.clearHistory()
  return e.reply({ status: 200, message: '', data: [] })
})

regist(RequestType.SEND_COMMAND, (e: any, data: any) => {
  IotModule.instance.sendCommand(data.uri, data.data)
  return e.reply({ status: 200, message: '', data: [] })
})