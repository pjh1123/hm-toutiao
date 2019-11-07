// 自定义插件的注册方法，在这个组件专门封装需要全局使用
// 的功能，在main.js中就可以直接使用Vue.use()使用这个自定义封装好的插件
import bread from '@/components/bread.vue'
import MyChannel from '@/components/my-channel'
import MyImage from '@/components/my-image'
export default {
  install (Vue) {
    // 这里的Vue是一个构造函数
    Vue.component('my-bread', bread)

    Vue.component('my-channel', MyChannel)

    Vue.component('my-image', MyImage)
  }
}
