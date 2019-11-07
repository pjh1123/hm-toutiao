import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'

import router from '@/router'

import axios from '@/api'
// 把自定义的全局组件挂载在main.js上，在use一下 就可以全局下使用
import plugin from '@/components'

Vue.prototype.$http = axios

Vue.use(ElementUi)
Vue.use(plugin)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
