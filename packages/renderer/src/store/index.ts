import { createStore } from 'vuex'
import { IotModuleResponseDto, IotModule, IotModuleResponseBusDto, IotModuleResponseClientDto } from '../../../core'
import { UserDto, DustNodeDto, DustClientDto, ClientStatus } from "../../../types";


export interface IStore {
  user?: UserDto,
  dust: IotModuleResponseDto,
  warningHistory: { date: string, bus: IotModuleResponseBusDto[], client: IotModuleResponseClientDto[] }[]
}

export const store = createStore<IStore>({
  state () {
    return {
      user: undefined,
      dust: IotModule.instance.getJSONData(),
      warningHistory: []
    }
  },
  getters: {
   
  },
  mutations: {
    update (state, payload) {
      for (let key in payload) {
        if (Reflect.has(state, key)) {
          (state as any)[key] = payload[key]
        }
      }
    }
  },
  actions: {
    upgradeDust (context) {
      context.commit('update', {
        dust: IotModule.instance.getJSONData()
      })
    },
    update (context, payload) {
      context.commit('update', payload)
    },
    updateWarningHistory ({ commit, state }, payload) {
      let arr = state.warningHistory.slice(0, state.warningHistory.length > 100 ? -1 : undefined)
      arr.unshift(payload)

      commit('update', { warningHistory: arr })
    }

  }
})