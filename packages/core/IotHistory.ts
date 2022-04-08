import Store from 'electron-store'
import { formatDate } from '../main/util'
import { IotHistoryItemDto, IotModuleResponseBusDto, IotModuleResponseClientDto } from './type'

export class IotHistory {
  static #ins: IotHistory
  static DUST_HISTORY_STORE_KEY = 'COAL_HISTORY'
  store: Store | null = null

  constructor () {
    this.store = new Store()
  }

  static get instance () {
    if (!IotHistory.#ins) {
      IotHistory.#ins = new IotHistory()

    }

    return IotHistory.#ins
  }


  #getDefaultHistory () : IotHistoryItemDto {
    return {
      date: formatDate(new Date),
      max: 0,
      warningCount: 0,
      clients: []
    }
  }

  getHistory () : IotHistoryItemDto[] {
    return this.store?.get(IotHistory.DUST_HISTORY_STORE_KEY) as IotHistoryItemDto [] || []
  }

  setHistory (data: { date: string, bus: IotModuleResponseBusDto[], client: IotModuleResponseClientDto[] }) {
    const historyColl = this.getHistory()
    let today: IotHistoryItemDto  = historyColl.find(item => item.date === data.date.split(' ')[0]) as any

    if (!today) {
      today = this.#getDefaultHistory()
      historyColl.unshift(today)
      if (historyColl.length > 30) historyColl.pop()
    }

    if (today) {
      today.warningCount++
      data.bus.forEach(b => {
        b.clients.forEach(cl => {
          if (cl.value > today.max) today.max = cl.value
          const name = `${b.name}-${cl.name}`
          if (!today.clients.find(cl => cl === name )) today.clients.push(name)
        })
      })

      this.store?.set(IotHistory.DUST_HISTORY_STORE_KEY, historyColl)
    }

  }

  clearHistory () {
    this.store?.set(IotHistory.DUST_HISTORY_STORE_KEY, [])
  }
}