<template>
   <!-- 登录页面 -->
   <div class='container'>
      <el-card>
          <img src="../../assets/logo_index.png" alt="">
          <el-form ref="form" >
            <el-form-item>
                <el-input placeholder="请输入手机号"></el-input>
            </el-form-item>
           <el-form-item>
                <el-input placeholder="请输入验证码" style="width:235px"></el-input>
                <el-button style="margin-left:10px;">发送验证码</el-button>
            </el-form-item>
                <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
            <el-form-item>
                <el-button type="primary" style="width:100%;margin-top:20px;">登录</el-button>
            </el-form-item>
            </el-form>
     </el-card>
   </div>
</template>

<script>
export default {

}
</script>

<style  lang="less">
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
        display: block;
        margin: 0 auto 20px;
    }
    .el-checkbox {
        margin-right: 10px;
    }
}
</style>
