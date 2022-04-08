<script lang="ts" setup>
import { ILayout, ILabel, ISelect, IButton, ITextarea, IFlexRow, IRadio, IText, IHangText, IBadge } from '@coloration/island'
import { onMounted, ref } from 'vue'
import { numberPrefix, curry } from '@coloration/kit'
import { serialListen, serialportList } from '../../api'
import { PortInfo } from '../../../../types'

enum ContentType {
  input = 1,
  output = 0
}

interface Content {
  type: ContentType
  data: string
  date: String
}

const baudrateOptions = [
  { name: '9600', value: '9600' }
]

const parityOptions = [
  { name: 'None', value: 'None' }
]

const databytesOptions = Array.from({ length: 8 }).map((d, i) => ({
  name: `${i + 1}`, value: `${i + 1}`
}))

const stopbitsOptions = Array.from({ length: 8 }).map((d, i) => ({
  name: `${i + 1}`, value: `${i + 1}`
}))

const param = ref({
  port: '',
  baudrate: '9600',
  databytes: '8',
  parity: 'None',
  stopbits: '1', 
  sendType: 'HEX',
  sendContent: ''
})
const sendType = ref('HEX')
const portInfo = ref<PortInfo & { status: 0 | 1 }>({
  path: '',
  manufacturer: '',
  serialNumber: '',
  pnpId: '',
  locationId: '',
  vendorId: '',
  productId: '',
  status: 0
})

const contentPool = ref<Content[]>([])
const ports = ref<PortInfo[]>([])
const dbl = curry(numberPrefix, '0', 2)
function handleSend () {
  if (!param.value.sendContent) {
    
    return 
  }

  // 校验

  // 发送
  const d = new Date()
  const date = `${d.getFullYear()}-${dbl(d.getMonth() + 1)}-${dbl(d.getDate())} ${dbl(d.getHours())}:${dbl(d.getMinutes())}:${dbl(d.getSeconds())}`
  contentPool.value.push({
    type: ContentType.input,
    data: param.value.sendContent,
    date: date
  })
  // 清空
  param.value.sendContent = ''

}


onMounted(() => {
  serialportList()
  .then((res: any) => {

    ports.value = res.data
    if (res.data.length > 0) {
      param.value.port = res.data[0].serialNumber
      portInfo.value = Object.assign(portInfo.value, res.data[0])
    }

  })

  serialListen(() => {
    
  })

})

</script>
<template>
<ILayout type="horizontal">
  <div class="w-1/4 bg-white py-2 p-4">
    <div>
      <ILabel for="port">Port</ILabel>
      <ISelect id="port" v-model="param.port">

        <option v-for="port in ports" :value="port.serialNumber">{{ port.serialNumber }}</option>
      </ISelect>
    </div>
    <div>
      <ILabel for="baudrate">Baudrate</ILabel>
      <ISelect id="baudrate" v-model="param.baudrate">
        <option v-for="opt in baudrateOptions" :value="opt.value">{{ opt.name }}</option>
      </ISelect>
    </div>
    <div>
      <ILabel for="databytes">Data Bytes</ILabel>
      <ISelect id="databytes" v-model="param.databytes">
        <option v-for="opt in databytesOptions" :value="opt.value">{{ opt.name }}</option>
      </ISelect>
    </div>
    <div>
      <ILabel for="parity">Parity</ILabel>
      <ISelect id="parity" v-model="param.parity">
        <option v-for="opt in parityOptions" :value="opt.value">{{ opt.name }}</option>
      </ISelect>
    </div>
    <div>
      <ILabel for="stopbits">Stop Bits</ILabel>
      <ISelect id="stopbits" v-model="param.stopbits">
        <option v-for="opt in stopbitsOptions" :value="opt.value">{{ opt.name }}</option>
      </ISelect>
    </div>
    <div>
      <IButton block type="primary">OPEN</IButton>
    </div>
    <IFlexRow horizontal="center" class="py-4">
      <IBadge>
        {{ portInfo.status === 0 ? 'Closed' : 'Opened' }}
      </IBadge>
    </IFlexRow>
  </div>
  <ILayout>
    <ILayout class="p-4">
      <div 
        v-for="cont in contentPool" 
        :class="{'text-right': cont.type === ContentType.input }">
        <IHangText>
          {{ cont.type === ContentType.output ? 'receive' : 'send' }} 
          {{ cont.date }}
        </IHangText>
        <div>
          <IText class="font-semibold">{{ cont.data }}</IText>
        </div>
      </div>

    </ILayout>
    <IFlexRow class="bg-white pt-4 px-4 gap-2">
      <ITextarea v-model="param.sendContent" class="" />
      <div class="w-20">
        <IRadio value="ASCII" v-model="sendType">
          <IText size="xs">ASCII</IText>
        </IRadio>
        <IRadio value="HEX" v-model="sendType">
          <IText size="xs">HEX</IText>
        </IRadio>
        <IButton block size="sm" @click="handleSend" :disabled="portInfo.status === 0">
          Send
        </IButton>
      </div>
    </IFlexRow>
  </ILayout>
</ILayout>
</template>