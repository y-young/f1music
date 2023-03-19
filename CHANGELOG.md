# 更新日志

## 1.x (2009-2017)

架构: PHP 原生 + JavaScript (jQuery)  
特性：上传模块使用 Uploadify(基于 Flash)，投票无法调整播放进度，未适配手机版  
由 [@upsuper](https://upsuper.org) 开发， @Robot，[@miskcoo](https://blog.miskcoo.com/) 等 SCAN 计算机社前辈维护。  
无详细更新日志

## 2.x (2018- )

由 [@Googleplex](https://gpx.moe/) 开发，各届活动负责人维护。

### 2.0.x 未曾使用

概念原型，使用 [AmazeUI](http://amazeui.org/) 及原生 PHP 代码

### 2.1.x (2017)

架构： [Lumen](https://lumen.laravel.com/) + [Vue](https://cn.vuejs.org/) ([ElementUI](https://element.eleme.io/) 1.x)  
特性： 首次适配手机版，使用 HTML5 音频播放器，支持网易云音乐上传  
于 2017 年首次成功使用

### 2.2.x (2018- )

架构： [Lumen](https://lumen.laravel.com/) + [React](https://reactjs.org/) ([Ant Design](https://ant.design/) + [dva.js](http://dvajs.com/))  
特性： 优化外观及用户体验，投票页面首次支持调整播放进度(总时长达到 30 秒即可)

#### 2.2.0 (2018.7)

~~作死~~为追求更好的用户体验，对 2.2 版本前端使用 React, Ant Design 及 dva 进行重写  
于 2018 年首次成功使用

#### 2.2.5

新增已听过标记，无需再次等待 30 秒

#### 2.2.6

上传页面支持查看已上传曲目

#### 2.2.7

对 mp3 文件的验证进行了优化，支持识别无效文件和比特率

#### 2.2.8

大幅优化前端页面框架，完善自动部署脚本

#### 2.3.0

-   开源发布
-   后台曲目标签
-   后台曲目搜索
-   上传与投票阶段倒计时
-   3 星分值从 0 更改为 1 分
-   Bug 修复与依赖升级

#### 2.3.1

-   更新各时段对应时间
-   更新校园网登录 URL
-   支持 Docker Compose 部署

#### 2.4.0

-   后端框架更换为 [Laravel](https://laravel.com/)
-   升级 PHP 8.2
-   升级 MySQL 8
