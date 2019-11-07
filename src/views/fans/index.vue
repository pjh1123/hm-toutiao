<template>
  <div class='container-fans'>
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- tabls组件 -->
      <el-tabs v-model="activeName"
               type="card">
        <el-tab-pane label="粉丝列表"
                     name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div class="fans_item"
                 v-for="item in fansList"
                 :key="item.id.toString()">
              <el-avatar :size="80"
                         :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary"
                         size="small"
                         plain>+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination background
                         layout="prev, pager, next"
                         :total="total"
                         :page-size="reqParams.per_page"
                         :current-page="reqParams.page"
                         @current-change="pager"
                         style="text-align:center"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像"
                     name="pic">
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'list',
      fansList: [],
      reqParams: {
        page: 1,
        per_page: 21
      },
      total: 0
    }
  },
  created () {
    this.getFansList()
  },
  methods: {
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('/followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    }
  }
}
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 150px;
    height: 190px;
    text-align: center;
    border: 1px dashed #ddd;
    padding-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
  }
}
</style>
