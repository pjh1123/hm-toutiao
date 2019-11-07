<template>
  <el-container class="container-home">
    <el-aside :width="openMenu?'200px':'60px'">
      <div class="logo"
           :class="{small_logo:!openMenu}"></div>
      <el-menu :default-active="$route.path"
               class="el-menu-vertical-demo"
               text-color="#fff"
               background-color="#002033"
               active-text-color="#ffd04b"
               :collapse="!openMenu"
               :collapse-transition="false"
               router>
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span class="el-icon-s-fold icon"
              @click="toggleMenu"></span>
        <span class="head_text">江苏传智播客科技教育有限公司</span>

        <el-dropdown @command="handleClick">
          <span class="el-dropdown-link">
            <img class="userimg"
                 :src="src"
                 alt="">
            <span>{{username}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting"
                              command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock"
                              command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local.js'
export default {
  data () {
    return {
      openMenu: 'true',
      src: '',
      username: ''
    }
  },
  methods: {
    toggleMenu () {
      this.openMenu = !this.openMenu
    },
    handleClick (command) {
      // command的值是哪个方法，就执行哪个方法。
      // 等同于this.logout/setting()
      this[command]()
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.delUser()
      this.$router.push('/login')
    }
  },
  created () {
    // 根据返回信息同步页面的用户信息
    let { name, photo } = local.getUser()
    this.src = photo
    this.username = name
    // 接收修改头像的数据
    eventBus.on('updateName', (name) => {
      this.username = name
    })
    // 接收修改头像的数据
    eventBus.on('updatePhoto', (photo) => {
      this.src = photo
    })
  }
}
</script>

<style scoped lang='less'>
.container-home {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center /
        140px auto;
    }
    .small_logo {
      background: #002244 url(../../assets/logo_admin_01.png) no-repeat center /
        30px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon,
    .head_text {
      display: inline-block;
      font-size: 25px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .el-dropdown {
      float: right;
      margin-right: 20px;
      cursor: pointer;
      .userimg {
        width: 30px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
  }
}
</style>
