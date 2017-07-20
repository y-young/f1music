<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="renderer" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <link rel="icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
  <link rel="shortcut icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
  <meta name="description" content="福州一中 校园音乐征集">
  <meta name="keywords" content="福州一中,校园音乐,FZYZ,FZYZ SCAN">
  <link rel="stylesheet" href="https://cdn.bootcss.com/element-ui/1.3.7/theme-default/index.css">
  <link rel="stylesheet" href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="/style.css">
  <title>@yield('title') - 福州一中 校园音乐征集</title>
  @yield('css')
</head>
<body>
    <div class="app" v-bind:class="{ 'show-sidebar': collapsed }">
        @section('sidebar')
        <div class="sidebar">
            <div class="logo">FZYZ 校园音乐征集</div>
            <el-menu mode="vertical" default-active="@yield('activeIndex')" class="navbar">
                <el-menu-item index="1"><i class="fa fa-home"></i><a href="/">首页</a></el-menu-item>
                <el-menu-item index="2"><i class="el-icon-upload"></i><a href="/Upload">上传</a></el-menu-item>
                <el-menu-item index="3"><i class="el-icon-information"></i>使用说明</el-menu-item>
                <el-menu-item-group title="投票">
                    <el-menu-item index="4"><a href="/Vote/1"> 6:30 起床铃</a></el-menu-item>
                    <el-menu-item index="5">18:40 晚出门</el-menu-item>
                    <el-menu-item index="6">21:40 晚自习结束</el-menu-item>
                    <el-menu-item index="7">22:30 熄灯铃</el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </div>
        @show
        <div class="container">
            <div class="container-inner">
                <div class="header">
                    <div class="header-inner">
                        <a class="show-btn" @click="collapse" href="#">
                            <i class="fa fa-align-justify"></i>
                        </a>
                        <div class="title">@yield('title')</div>
                    </div>
                </div>
                <div class="page">
                    <div class="page-inner">
                        @yield('contents')
                    </div>
                </div>
                @section('footer')
                <footer><hr>
                    <div class="footer">
                        <p>Copyright © 2009-2017 FZYZ SCAN. All rights reserved.<br>
                        Thanks to: <a href="https://blog.robotshell.org">Robot</a> <a href="http://blog.miskcoo.com">Miskcoo</a> <a href="https://www.upsuper.org">Upsuper</a></p>
                    </div>
                </footer>
                @show
            </div>
        </div>
    </div>
</body>
<script src="https://cdn.bootcss.com/vue/2.4.1/vue.js"></script>
<script src="https://cdn.bootcss.com/element-ui/1.3.7/index.js"></script>
<script src="{{url('/assets/js/main.js')}}"></script>
@yield('js')
</html>
