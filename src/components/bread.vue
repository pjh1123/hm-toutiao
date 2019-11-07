<template>
<!-- 面包屑导航栏 -->
  <div class='container-bread'>
       <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
            <slot></slot>
        </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>
