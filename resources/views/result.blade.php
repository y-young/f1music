<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="renderer" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <meta name="description" content="福州一中 校园音乐征集">
  <meta name="keywords" content="福州一中,校园音乐,FZYZ,FZYZ SCAN">
  <link rel="icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
  <link rel="shortcut icon" href="{{url('/favicon.ico')}}" type="image/x-icon" />
  <link rel="stylesheet" href="https://cdn.bootcss.com/element-ui/1.4.12/theme-default/index.css" />
  <style>
    #app {
        padding-top: 5%;
        margin: auto;    
        //position: absolute;
        left: 0;
        width: 100%;
    }
  </style>
  <title>投票结果 - 福州一中 校园音乐征集</title>
</head>
<body>
  <div id="app">
    <div style="text-align: center; font-size: 24px">2018年福州一中校园音乐</div><br>
    <div style="width: 90%; max-width: 500px; margin: auto" class="aplayer"></div><br>
    <div style="width: 200px; margin: auto">
      <a href="http://music.163.com" style="font-size: 13px; color: #777; text-decoration: none"><i class="el-icon-arrow-right"></i> 前往网易云歌单</a>
      <a href="/Index" style="font-size: 13px; color: #777; text-decoration: none"><i class="el-icon-arrow-right"></i> 进入首页</a>
    </div>
  </div>
</body>
<!-- <script src="https://cdn.bootcss.com/element-ui/1.4.12/index.js"></script> -->
<script src="https://cdn.bootcss.com/aplayer/1.6.0/APlayer.min.js"></script>
<script src="{{url('/js/result.js')}}"></script>
</html>
