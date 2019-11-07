<template>
  <div class='container_myImage'>
    <!-- 点击上传的按钮 -->
    <div class="btn_box"
         @click="open">
      <img :src="value || defaultImage"
           alt="">
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible"
               width="50%">
      <span>
        <el-tabs v-model="activeName">
          <el-tab-pane label="素材库"
                       name="image">
            <!-- 按钮 -->
            <el-radio-group v-model="reqParams.collect"
                            size="small"
                            @change="toggleList">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
            <!-- 素材列表 -->
            <div class="img_list">
              <div class="img_item"
                   :class="{selected:item.url === selectedImageUrl}"
                   @click="selectImage(item.url)"
                   v-for="item in images"
                   :key="item.id">
                <img :src="item.url"
                     alt="">
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
          </el-tab-pane>
          <el-tab-pane label="上传图片"
                       name="upload">

            <!-- 这里是elementui上给的接口请求方式 不是axios方式发送的 所以关于axios的方法都不能用 -->
            <!-- action 是上传图片的接口地址 -->
            <el-upload class="avatar-uploader"
                       action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                       :headers="headers"
                       name="image"
                       :show-file-list="false"
                       :on-success="handleSuccess">
              <img v-if="uploadImageUrl"
                   :src="uploadImageUrl"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-tab-pane>

        </el-tabs>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImage from '@/assets/default.png'
import local from '@/utils/local'
export default {
  // 封面图片地址
  props: ['value'],
  data () {
    return {
      defaultImage,
      dialogVisible: false,
      activeName: 'image',
      // 请求素材的参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 素材列表依赖数据
      images: [],
      total: 0,
      // 选中的图片
      selectedImageUrl: null,
      uploadImageUrl: null,
      imageUrl: null,
      // 上传带的头 token数据
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 说明此时选中的选项卡是素材库选项卡
        // 校验是否选中了一张图片，并且预览显示在页面上
        if (!this.selectedImageUrl) {
          // 没有选中
          return this.$message.warning('请选择一张图片')
        }
        // this.imageUrl = this.selectedImageUrl
        // 把选中的图片地址提交给父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        if (!this.uploadImageUrl) {
          // 没有选中
          return this.$message.warning('请上传一张图片')
        }
        // this.imageUrl = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    },
    // 点击按钮打开对话框
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 选中的图片进行操作
    selectImage (url) {
      this.selectedImageUrl = url
    },
    // 上传图片成功后会执行的钩子函数
    handleSuccess (response) {
      // response直接就是完整的响应体
      this.uploadImageUrl = response.data.url
      this.$message.success('上传成功')

      // 两秒后自动关闭对话框
      // this.dialogVisible = false
      this.getImages()
    }
  }
}
</script>

<style scoped lang='less'>
.container_myImage {
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
}
//素材样式
.img_list {
  padding-top: 20px;
  .img_item {
    width: 150px;
    height: 120px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url("../assets/selected.png") no-repeat
        center / 50px 50px;
    }
  }
}
</style>
