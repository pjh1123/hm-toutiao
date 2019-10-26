import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'

import axios from '@/api'
Vue.prototype.$http = axios

Vue.use(ElementUi)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
