import { RequestType } from '../types'
import { regist } from './requestServer'
import { SerialPort } from 'serialport'

regist(RequestType.SERIALPORT_LIST, (e: any) => {
  SerialPort.list()
  .then((res: any) => {
    console.log(res)
    const data = res.filter((d: any) => d.serialNumber)
    return e.reply({ status: 200, message: '', data })
  })
  
})