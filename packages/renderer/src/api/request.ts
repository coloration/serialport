import { RequestType, IpcType } from '../../../types'

const _map = new Map<string, Function>()

window.ipcRenderer.on(IpcType.REQUEST_RENDERER_RECEIVE, (event, params) => {
  const cb = _map.get(params._symbol)
  if (typeof cb === 'function') {
    _map.delete(params.symbol)
    cb(params.data)
  }
})

export function request<T = any, K = any> (type: RequestType, data?: T) {
	const _symbol = `${Date.now()}/${type}`
  return new Promise(resolve => {
    _map.set(_symbol, (data: K) => {
      resolve(data)
    })
    window.ipcRenderer.send(IpcType.REQUEST_RENDERER_SEND, {
			_symbol, type, data
    })
  })
}