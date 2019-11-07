<template>
  <div class='container-publish'>
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form>
        <el-form-item label="标题:">
          <el-input v-model="articleForm.title"
                    style="width:400px"></el-input>
        </el-form-item>
        <!-- 富文本框 -->
        <el-form-item label="内容:">
          <quill-editor v-model="articleForm.content"
                        :options="editorOption"
                        style="float:left;width:800px"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <el-radio-group v-model="articleForm.cover.type"
                          @change="articleForm.cover.images = []">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 自定义上传组件 -->
          <div v-if='articleForm.cover.type ===1'>
            <my-image v-model="articleForm.cover.images[0]">
            </my-image>
          </div>
          <div v-if='articleForm.cover.type ===3'>
            <my-image v-for="i in 3"
                      :key="i"
                      v-model="articleForm.cover.images[i-1]">
            </my-image>
          </div>

        </el-form-item>
        <el-form-item label="频道:">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="createArticle(false)">发表</el-button>
          <el-button @click="createArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 局部挂载 富文本框
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: { quillEditor },
  data () {
    return {
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置对象
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    // 新建文章
    async createArticle (draft) {
      // draft 是用来判断是否保存为草稿状态
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '发布文章成功')
      this.$router.push('/article')
    },
    // 修改文章
    async update (draft) {
      // 修改 存入草稿
      await this.$http.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    },
    async getArticle (id) {
      const { data: { data } } = await this.$http.get('articles/' + id)
      this.articleForm = data
    },
    // 切换发布与修改
    toggleArticleStatus () {
      const articleId = this.$route.query.id
      if (articleId) {
        // 如果地址栏带参数，说明是编辑状态，需要在页面显示当前文章信息
        this.getArticle(articleId)
      } else {
        // 重置数据不能为空对象 模板中
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  },
  created () {
    this.toggleArticleStatus()
  },
  // created只有路由初始化的时候才会执行一次，编辑和发布文章都用的是publish这个路由，路由规则没有发生变化的时候不会重新初始化
  // 监听地址栏参数的变化
  watch: {
    // 只要是this可以获取到的数据都可以监听
    '$route.query.id': function () {
      this.toggleArticleStatus()
    }
  }

}
</script>

<style scoped lang='less'>
</style>
