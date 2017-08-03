<template>
    <div class="sidebar">
        <div class="logo">FZYZ 校园音乐征集</div>
            <el-menu mode="vertical" :default-active="activeIndex" class="nav" :router="true">
                <el-menu-item index="1" :route="{path: '/'}"><i class="fa fa-home"></i>曲目</el-menu-item>
                <el-menu-item index="2" :route="{path: '/'}">投票</el-menu-item>
                <el-menu-item index="3" :route="{path: '/Files'}">文件</el-menu-item>
                <el-menu-item index="4" :route="{path: '/'}">举报</el-menu-item>
                <el-menu-item index="5" :route="{path: '/'}"><i class="fa fa-home"></i>投票结果</el-menu-item>
                <el-menu-item index="6" :route="{path: '/'}">反馈</el-menu-item>
            </el-menu>
    </div>
</template>

<script>
  export default {
    props: ['activeIndex'],
  }
</script>

<style>
.sidebar{
    position: absolute;
    width: 300px;
    top: 0;
    left: -300px;
    bottom: 0;
    z-index: 1;
    overflow-y: auto;
    -webkit-transition: left 250ms ease;
    -moz-transition: left 250ms ease;
    -o-transition: left 250ms ease;
    transition: left 250ms ease;
}
@media (max-width:600px) {
    .sidebar {
        width: calc(100% - 60px);
        bottom: 0;
        left: -100%
    }
    .logo {
        width: calc(100% - 60px);
    }
}
.app.show-sidebar .sidebar {
    left: 0;
}
.nav {
    display: block;
    position: absolute;
    top: 60px;
    bottom: 0;
    margin: 0;
    width: 100%;
    -webkit-transition: left 250ms ease;
    -moz-transition: left 250ms ease;
    -o-transition: left 250ms ease;
    transition: left 250ms ease;
}
.nav a {
    text-decoration: none;
}
.logo {
    position: fixed;
    top: 0;
    width: calc(100% - 60px);
    padding: 0 15px;
    transition: all 250ms ease;
    font-size: 20px;
    line-height: 60px;
    z-index: 2;
    color: #fff;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
    background: #20a0ff;
}
</style>