<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮 -->
      <div class="btn_box">
        <!-- 按钮样式的单选框 label就是值 同时也是显示的文字 -->
        <el-radio-group v-model="reqParams.collect"
                        size="small"
                        @change="toggleList">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button type="success"
                   size="small"
                   style="float:right"
                   @click="open">添加素材</el-button>
        <!-- 素材列表 -->
        <div class="img_list">
          <div class="img_item"
               v-for="item in images"
               :key="item.id">
            <img :src="item.url"
                 alt="">
            <!-- 如果选中的是收藏列表 那么就隐藏footer中的操作内容 -->
            <div class="footer"
                 v-if="!reqParams.collect">
              <!-- 如果素材的is_collected结果为true，就是被收藏了，
              那么收藏图标添加red类名，变成红色 -->
              <span class="el-icon-star-off"
                    :class="{red:item.is_collected}"
                    @click="toggleStatus(item)"></span>
              <span class="el-icon-delete"
                    @click="deleteImage(item.id)"></span>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <el-pagination background
                       layout="prev, pager, next"
                       :total="total"
                       style="text-align:center"
                       :page-size="reqParams.per_page"
                       :current-page="reqParams.page"
                       @current-change="pager">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加素材的对话框 -->
    <el-dialog title="添加素材"
               :visible.sync="dialogVisible"
               width="300px">
      <!-- 这里是elementui上给的接口请求方式 不是axios方式发送的 所以关于axios的方法都不能用 -->
      <!-- action 是上传图片的接口地址 -->
      <el-upload class="avatar-uploader"
                 action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                 :headers="headers"
                 name="image"
                 :show-file-list="false"
                 :on-success="handleSuccess">
        <img v-if="imageUrl"
             :src="imageUrl"
             class="avatar">
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        // 这个参数是接口文档中的 用于后台看是否是收藏的图片
        // false为全部图片 true为收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制添加素材的对话框显示和隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 上传带的头 token数据
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 上传图片成功后会执行的钩子函数
    handleSuccess (response) {
      // response直接就是完整的响应体
      this.imageUrl = response.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 两秒后自动关闭对话框
        this.dialogVisible = false
        this.getImages()
      }, 2000)
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 收藏图片 收藏列表里面不需要底部操作栏
    // 全部图片
    toggleList () {
      // 切换列表内容的时候重置 默认选中第一页
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换添加收藏和取消收藏
    async toggleStatus (item) {
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功后 修改状态，就可以修改按钮样式
      item.is_collected = data.collect
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    deleteImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认删除
        await this.$http.delete(`user/images/${id}`)
        // 删除成功 提示删除成功 并且重新渲染图片列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getImages()
      }).catch(() => {
        // 取消删除  不做任何逻辑
      })
    }
    // 添加素材

  }
}
</script>

<style scoped lang='less'>
.img_list {
  padding-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        //span标签 且类名是red &就是连接符 可以将后代容器和上级容器链接
        &.red {
          color: red;
        }
      }
    }
  }
}
//样式在这里写 只在当前组件下生效 （在模板中能看到的标签就是当前组件）
//使用其他组件 组件内部存在标签 就无法给组件内部标签生效 提到全局下 就可以任何地方都可以生效
</style>
