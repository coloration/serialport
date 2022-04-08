<script setup lang="ts">
import { ILayout, IUsergroupIcon, IDotsIcon, IBarChartIcon, IBoardIcon, ITitle, IText, ISidebar, IModal, IBadge } from '@coloration/island'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted, onUnmounted, ref } from 'vue'
import { useToggle } from '@vueuse/core'
import { IpcType } from '../../../types'
import { mountModule, unmountModule } from '../api'

const router = useRouter()
const route = useRoute()
const options = [
  { name: '功能', value: [
    { name: '串口调试', value: '/dashboard/serialport', icon: IBarChartIcon },
    { name: '其他工具', value: '/dashboard/other', icon: IBoardIcon }
  ] },
]

const store = useStore()
const [warningVisible, toggleWarningVisible] = useToggle(false)
const [siderBarShadowVisible, toggleSideBarShadowVisible] = useToggle(false)
const warningData = ref<any>({})
const warningBellDom = ref<HTMLAudioElement | null>(null)


function reset () {
  return unmountModule()
  .then(() => {
    warningBellDom.value?.pause()
    store.dispatch('upgradeDust')
  })
   
}

function playWarningAudio () {
  warningBellDom.value?.play()
}

function handleModalClose () {
  warningBellDom.value?.pause()
  toggleWarningVisible(false)
}

function warn (data: any) {
  warningData.value = data
  playWarningAudio()
  toggleWarningVisible(true)
}

function init () {

  window.ipcRenderer.on(IpcType.IOT_TRANS, (event, data) => {
    store.dispatch('update', {
      dust: data
    })
  })

  window.ipcRenderer.on(IpcType.IOT_WARNING, (event, data) => {
    console.log('warning', data)
    warn(data)
    store.dispatch('updateWarningHistory', data)
  })

  mountModule()
}


function handleChange (option: any) {
  router.push(option.value)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  reset()
})
</script>

<template>
  <ILayout type="horizontal">
    <ISidebar :options="options" @change="handleChange" :sidebar-open="siderBarShadowVisible" :active="route.path" @close-sidebar="toggleSideBarShadowVisible"/>
    <ILayout>
      <header class="h-16 border-b border-gray-300 flex justify-between items-center px-4">
        <div>
          <div class="lg:hidden text-gray-400 hover:text-indigo-500 cursor-pointer" @click.stop="(toggleSideBarShadowVisible as any)">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path fill="currentColor" d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"/></svg>
          </div>
        </div>
      </header>
      <ILayout>
        <div class="w-full h-full flex-1 bg-gray-100 relative">
          <!-- <img class="absolute w-full h-full opacity-50 object-fill z-0 select-none" src="../assets/contain-bg.png" /> -->
          <div class="w-full h-full flex-1 z-10">
            <router-view />
          </div>
          <audio id="warning-bell" loop ref="warningBellDom" src="/warning.mp3" />
          <IModal 
            title="警告"
            :visible="warningVisible" 
            @close="handleModalClose"
            @confirm="handleModalClose">
            <div class="mb-2">
              <ITitle :level="3" class="mb-2">
                报警时间
              </ITitle>
              <IText>
                {{ warningData.date }}
              </IText>
            </div>
            <div class="mb-2">
              <ITitle :level="3" class="mb-2">
                报警通道
              </ITitle>

            <IBadge v-for="(b, i) in warningData.bus || []" :key="i">
              {{ b.name }}
            </IBadge>
            </div>
            <div class="mb-2">
              <ITitle :level="3" class="mb-2">
                报警设备
              </ITitle>

              <IBadge class="mr-2" v-for="(cl, i) in warningData.client || []" :key="i">
                {{ cl.name }} {{ cl.valueString }}
              </IBadge>
            </div>
            <template #footer-cancel-button-name>
                取消
            </template>
            <template #footer-confirm-button-name>
                确定
            </template>
          </IModal>
        </div>
      </ILayout>
    </ILayout>
  </ILayout>
</template>

<style scoped>
</style>
