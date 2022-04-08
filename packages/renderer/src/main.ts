import { createApp } from 'vue'
import '@coloration/island/dist/style.css'
import App from './App.vue'
import { appRouter } from './router'
import 'virtual:windi.css'
import './style/index.css'
import { store } from './store'

createApp(App)
  .use(appRouter)
  .use(store)
  .mount('#app')
  .$nextTick(window.removeLoading)

// console.log('fs', window.fs)
// console.log('ipcRenderer', window.ipcRenderer)

// Usage of ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})
