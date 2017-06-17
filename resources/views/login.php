<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>登录 | FZYZ School Music Voting System</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no">
  <meta name="renderer" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <link rel="alternate icon" type="image/png" href="/imgs/favicon.png">
  <link rel="stylesheet" href="/css/amazeui.min.css"/>
  <style>
    .header {
      text-align: center;
    }
    .header h1 {
      font-size: 200%;
      color: #333;
      margin-top: 30px;
    }
    .header p {
      font-size: 14px;
    }
  </style>
</head>
<body>
<div class="loginPage">
<div class="header">
  <div class="am-g">
    <h1>FZYZ School Music Voting System</h1>
  </div>
  <hr />
</div>
<div class="am-g">
  <div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
    <h2>登录</h2>
    <hr>
    <div class="am-alert am-alert-success" data-am-alert v-if="loginSuccess"><p>登录成功,正在跳转...<a href="/">不想等待?</a></p> </div>
    <div class="am-alert am-alert-danger" data-am-alert v-if="errorMsg"> <button type="button" class="am-close">&times;</button> <p>{{ errorMsg }}</p> </div>
    <form class="am-form">
      <div class="am-form-group am-form-icon am-form-feedback" v-bind:class="{ 'am-form-success' : loginSuccess , 'am-form-error' : errorMsg }">
      <label for="stuId">学号:</label>
      <input type="text" v-model="stuId" class="am-form-field" id="stuId" value="" maxlength="11" data-input="validate">
      <span v-bind:class="{ 'am-icon-check' : loginSuccess , 'am-icon-times' : errorMsg }"></span>
      </div>
      <div class="am-form-group am-form-icon am-form-feedback" v-bind:class="{ 'am-form-success' : loginSuccess , 'am-form-error' : errorMsg }">
      <label for="password">密码:</label>
      <input type="password" v-model="password" class="am-form-field" id="password" value="" maxlength="30">
       <span v-bind:class="{ 'am-icon-check' : loginSuccess , 'am-icon-times' : errorMsg }"></span>
      </div>
    </form>
      <div class="am-cf">
        <button @click="loginnew" class="am-btn am-btn-primary am-btn-sm am-fl" :class="{ 'am-disabled' : loading }"><div v-if="loading"><i class="am-icon-spinner am-icon-spin" v-show="loading"></i>登录中...</div><div v-else>登录</div></button>
      </div>
    <hr>
    <p>© Copyright 2009-2017 SCAN.</p>
  </div>
</div>
</div>
<script src="/js/vue/vue.js"></script>
<script src="/js/vue/vue-resource.min.js"></script>
<script src="/js/login.js"></script>
</body>
</html>
