<template>
  <el-select :value="value"
             @change="fn"
             placeholder="请选择"
             clearable>
    <el-option v-for="item in channelOptions"
               :key="item.id"
               :label="item.name"
               :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // 值改变时的函数
    fn (channelID) {
      // 把数据提交给父组件
      if (channelID === '') channelID = null
      this.$emit('input', channelID)
    },
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      // 赋值给频道下拉选项依赖数据
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
