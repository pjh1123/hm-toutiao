<template>
  <div class='container-articles'>
    <!-- 筛选添加布局 -->
    <el-card>
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>

      <el-form label-width="80px"
               size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 频道组件 -->
          <!-- v-model的本质：绑定value属性 绑定了input事件 -->
          <!-- 可以当做这是父容器给子容器传值 传了一个value 可以去子组件中props接收值 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期">
          <!-- 这里日期的v-model绑定的是一个数组 [起始时间，结束时间] -->
          <el-date-picker v-model="dataArr"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="changeDate"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <el-table :data="articles">
        <!-- 列容器 prop：当前列包含(行)字段名称显示对应内容
        只能渲染字段 自定义列可以渲染任意结构-->
        <el-table-column label="封面">
          <template slot-scope="scope">
            <!-- 第一张封面图
            通过 scope 可以获取到插槽上的数据 row可以接收到当前行的数据-->
            <!-- elementui上面提供了如果加载失败可以参加的样式  -->
            <el-image :src="scope.row.cover.images[0]"
                      fit="fit"
                      style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif"
                     alt=""
                     width="150px"
                     height="100px">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题"
                         prop="title">
        </el-table-column>
        <el-table-column label="状态"
                         prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0"
                    type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status == 1"
                    type="success">待审核</el-tag>
            <el-tag v-if="scope.row.status == 2">审核通过</el-tag>
            <el-tag v-if="scope.row.status == 3"
                    type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status == 4"
                    type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间"
                         prop="pubdate">
        </el-table-column>
        <el-table-column label="操作"
                         width="120">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       plain
                       circle
                       @click="toEdit(scope.row.id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       plain
                       circle
                       @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- total是总条数 -->
      <!-- page-size 默认显示10条每一页 -->
      <!-- 动态激活当前选中的页数 -->
      <!-- current-change 事件：是elementui分页组件中给定的
      事件，当页码改变时，就执行这个事件
      默认参数是改变后的页码 -->
      <el-pagination style="margin-top:20px"
                     background
                     layout="prev, pager, next"
                     :total="total"
                     :page-size="reqParams.per_page"
                     :current-page="reqParams.page"
                     @current-change="pager">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 筛选要传递的参数
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页码 每页显示的条数
        page: 1,
        per_page: 20
      },
      // 频道选项数据
      channelOptions: [{ value: 1, label: 'java' }],
      dataArr: [],
      articles: [],
      // 文章总条数
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // 异步方法
    // async getChannelOptions () {
    //   const { data: { data } } = await this.$http.get('channels')
    //   // 赋值给频道下拉选项依赖数据
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表数据
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值文章列表依赖的数据
      this.articles = data.results
      // 渲染文章总条数
      this.total = data.total_count
    },
    pager (newPage) {
      // elementui中提供了这个事件，只要点击，就会默认传参进来
      // 得到当前的页码。根据新的页面和当前筛选条件，重新查询数据即可
      this.reqParams.page = newPage
      this.getArticles()
    },
    search () {
      // 选择日期之后，把选择的起始与结束日期分别赋值给 begin_pubdate,end_pubdate
      // 更改筛选后的页码渲染 并且回到第一页
      // 如果频道的值为'' 时候修改成null 否则后台接收到''会报错
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      this.reqParams.page = 1
      this.getArticles()
    },
    changeDate (dateArr) {
      // dateArr 的数据格式是日期格式
      // 后端需要的是字符串格式 需要改变格式  value-format是elementui给出的约束格式的属性
      // 注意：页面上可以清除选择的日期，这时候dateArr 为null 所以不能直接取值
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    toEdit (id) {
      // ?id=1 问号拼接参数的简便写法 query后面可以跟对象的形式
      this.$router.push({ path: '/publish', query: { id } })
    },
    async del (id) {
      await this.$http.delete(`articles/${id}`)
      // 提示删除
      this.$message.success('删除文章成功')
      this.getArticles()
    }

  }
}
</script>

<style scoped lang='less'>
</style>
