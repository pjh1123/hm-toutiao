<template>
   <!-- 登录页面 -->
   <div class='container'>
      <el-card>
          <img src="../../assets/logo_index.png" alt="">
          <el-form ref="form" :rules="rules" :model="loginForm" status-icon>
            <el-form-item  prop="phone">
                <el-input placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
            </el-form-item>
           <el-form-item prop="code">
                <el-input placeholder="请输入验证码" style="width:235px" v-model="loginForm.code"></el-input>
                <el-button style="margin-left:10px;">发送验证码</el-button>
            </el-form-item>
                <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
            <el-form-item>
                <el-button type="primary" style="width:100%;margin-top:20px;" @click="login">登录</el-button>
            </el-form-item>
            </el-form>
     </el-card>
   </div>
</template>

<script>
// 导入设置用户信息的工具函数
import local from '@/utils/local.js'
export default {
  data () {
    const checkPhone = (rule, value, callback) => {
      if (/^1[3-9]\d{9}/.test(value)) {
        // 验证手机号符合规范
        callback()
      } else {
        // 手机号不正确
        callback(new Error('手机号格式不正确'))
      }
    }
    return {
      loginForm: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码必须是6位字符', trigger: 'blur' }

        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['form'].validate(async valid => {
        // valid布尔类型值  true 校验成功  false 校验失败
        if (valid) {
          try {
            const { data: { data } } = await this.$http.post('authorizations', { mobile: this.loginForm.phone, code: this.loginForm.code })
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('手机号或者验证码不正确哦')
          }
          // this.$http({
          //   url: 'authorizations',
          //   method: 'post',
          //   data: { mobile: this.loginForm.phone, code: this.loginForm.code }
          // }).then(res => {
          //   local.setUser(res.data.data)
          //   this.$router.push('/')
          // }).catch(() => {
          //   this.$message.error('手机号或者验证码不正确哦')
          // })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
    width: 100%;
    height: 100%;
    background: url("../../assets/login_bg.jpg") no-repeat center / cover;
    position: absolute;
    left: 0;
    top: 0;
}
.el-card {
    width: 400px;
    height: 330px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    img{
        width: 200px;
        display: block;
        margin: 0 auto 20px;
    }
    .el-checkbox {
        margin-right: 10px;
    }
}
</style>
