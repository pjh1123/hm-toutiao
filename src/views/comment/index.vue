<template>
  <div class='container-comment'>
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="标题"
                         width="400"
                         prop="title"></el-table-column>
        <el-table-column label="总评论数"
                         prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数"
                         prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.comment_status"
                       type="danger"
                       size="small"
                       @click="toggStatus(scope.row.id,false)">关闭评论</el-button>
            <el-button type="success"
                       v-else
                       size="small"
                       @click="toggStatus(scope.row.id,true)">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background
                     layout="prev, pager, next"
                     :total="total"
                     style="text-align:center;margin-top:20px"
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
      articles: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    async getArticles () {
      // 获取文章列表同时要包含评论信息
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 切换文章打开关闭状态
    toggStatus (id, status) {
      const text = status ? '确认打开评论吗' : '确认关闭评论吗？如果关闭，用户将无法对该文章进行评论'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${id}`, {
          allow_comment: status
        })
        this.$message(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        this.getArticles()
      }).catch(() => { })
    }
  }
}
</script>

<style scoped lang='less'></style>
