<!doctype html>
<html class="no-js fixed-layout">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>@yield('title') - FZYZ School Music Voting System</title>
  <meta name="description" content=" index">
  <meta name="keywords" content="index">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="renderer" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <link rel="icon" type="image/png" href="{{url('/assets/i/favicon.png')}}">
  <link rel="apple-touch-icon-precomposed" href="{{url('/assets/i/app-icon72x72@2x.png')}}">
  <meta name="apple-mobile-web-app-title" content="FZYZ" />
  <link rel="stylesheet" href="{{url('/assets/css/amazeui.min.css')}}"/>
  <link rel="stylesheet" href="{{url('/assets/css/admin.css')}}">
@yield('css')
</head>
<body>
<!--[if lte IE 9]>
<p class="browsehappy">你正在使用<strong>过时</strong>的浏览器，Amaze UI 暂不支持。 请 <a href="http://browsehappy.com/" target="_blank">升级浏览器</a>
  以获得更好的体验！</p>
<![endif]-->

<header class="am-topbar am-topbar-inverse admin-header">
  <div class="am-topbar-brand">
    <strong>FZYZ</strong> <small>School Music Voting System</small>
  </div>

  <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#topbar-collapse'}"><span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span></button>

  <div class="am-collapse am-topbar-collapse" id="topbar-collapse">

    <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
          <li><a href="#"><span class="am-icon-user"></span> 资料</a></li>
          <li><a href="Login"><span class="am-icon-sign-in"></span> 登录</a></li>
          <li><a href="Logout"><span class="am-icon-sign-out"></span> 退出</a></li>
    </ul>
  </div>
</header>
@section('sidebar')
<div class="am-cf admin-main">
  <!-- sidebar start -->
  <div class="admin-sidebar am-offcanvas" id="admin-offcanvas">
    <div class="am-offcanvas-bar admin-offcanvas-bar">
      <ul class="am-list admin-sidebar-list">
        <li><a href="/"><span class="am-icon-home"></span> 首页</a></li>
        <li class="admin-parent">
<a class="am-cf" data-am-collapse="{target: '#collapse-nav'}"><span class="am-icon-file"></span> 投票 <span class="am-icon-angle-right am-fr am-margin-right"></span></a>
          <ul class="am-list am-collapse admin-sidebar-sub am-in" id="collapse-nav">
            <li><a href="/Vote/1" class="am-cf"><span class="am-icon-bed"></span> 6:30 起床</a></li>
            <li><a href="/Vote/2"><span class="am-icon-flag"></span> 7:00 早出门</a></li>
            <li><a href="/Vote/3"><span class="am-icon-graduation-cap"></span> 13:45 午出门</a></li>
            <li><a href="/Vote/4"><span class="am-icon-calendar"></span> 18:40 晚出门</a></li>
            <li><a href="/Vote/5"><span class="am-icon-bug"></span> 21:35 晚自习结束</a></li>
            <li><a href="/Vote/6"><span class="am-icon-moon-o"></span> 22:30 熄灯</a></li>
          </ul>
        </li>
        <li><a href="Upload"><span class="am-icon-upload"></span> 上传</a></li>
        <li><a href="Help"><span class="am-icon-question"></span> 帮助</a></li>
        <li><a href="Logout"><span class="am-icon-sign-out"></span> 注销</a></li>
      </ul>

      <div class="am-panel am-panel-default admin-sidebar-panel">
        <div class="am-panel-bd">
          <p><span class="am-icon-bookmark"></span> 公告</p>
          <p>时光静好，与君语；细水流年，与君同。—— Amaze UI</p>
        </div>
      </div>

    </div>
  </div>
  <!-- sidebar end -->
@show

<!-- content start -->
  <div class="admin-content">
    <div class="admin-content-body">
@yield('contents')

@section('footer')
<footer class="admin-content-footer">
      <hr>
      <p class="am-padding-left">
<a href="#Top">返回顶部</a><br>
© 2009-2017 FZYZ SCAN.</p>
    </footer>
  </div>
  <!-- content end -->
</div>

<a href="#" class="am-icon-btn am-icon-th-list am-show-sm-only admin-menu" data-am-offcanvas="{target: '#admin-offcanvas'}"></a>
@show
<!--[if lt IE 9]>
<script src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.staticfile.org/modernizr/2.8.3/modernizr.js"></script>
<script src="{{url('/assets/js/amazeui.ie8polyfill.min.js')}}"></script>
<![endif]-->

<!--[if (gte IE 9)|!(IE)]><!-->
<script src="{{url('/assets/js/jquery.min.js')}}"></script>
<!--<![endif]-->
<script src="{{url('/assets/js/amazeui.min.js')}}"></script>
<script src="{{url('/assets/js/app.js')}}"></script>
@yield('js')
</body>
</html>
