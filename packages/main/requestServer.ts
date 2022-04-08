import { ipcMain } from 'electron'
import { IpcType, RequestType } from '../types'
const _map = new Map()

ipcMain.on(IpcType.REQUEST_MAIN_RECEIVE, (event, params) => {
  
    const reply = function (data: any) {
      event.reply(IpcType.REQUEST_MAIN_SEND, {
        _symbol: params._symbol,
        // data 传递给客户端，最终 resolve 它
        data
      })
    }
    const ctx = {
      reply,
      event,
      type: params.type
    }
    const cb = _map.get(params.type)
    if (typeof cb === 'function') {
      cb(ctx, params.data)
    } else {
      // 没有注册~
    }
})

export function regist (type: RequestType, cb: Function) {
	_map.set(type, cb)
}