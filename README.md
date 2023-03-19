# 福州一中校园音乐征集投票系统

![Author](https://img.shields.io/badge/Author-Googleplex-green.svg?style=for-the-badge "Author")
![Backend](https://img.shields.io/badge/Backend-Laravel-%23f9322c.svg?style=for-the-badge "Backend")
![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg?style=for-the-badge "Author")
![UI](https://img.shields.io/badge/UI-Ant%20Design-blue.svg?style=for-the-badge "UI")

中文 | [English](README-en.md)

## 简介及活动概况

福州一中每年进行校园音乐征集和投票使用的系统，有据可查的活动开始时间为 2007 年。

1.x 版本(据考证的最早开始使用日期为 2009 年)由 [@upsuper](https://upsuper.org/) 开发， @Robot， [@miskcoo](https://blog.miskcoo.com/) 等前辈维护(未考证，仅参考了页脚版权信息)，活动由 SCAN 计算机社策划和组织；

2.x 版本由 [@Googleplex](https://gpx.moe/) 于 2016 年起借鉴上一版本逻辑重新开发，于 2017 年 11 月第一次使用，鉴于 SCAN 计算机社已于 2017 年与创客七户社合并，此次活动由创客七户社内原 SCAN 计算机社社员组织，后续活动将交由创客七户社各届有关负责社员组织。

## 部署

服务器推荐硬件配置及环境：

-   操作系统：Linux 各大发行版
-   内存：1GB 及以上
-   环境：PHP 8.1+ (with Composer 2.2+), Apache / Nginx, MySQL 5.7+

生产及开发环境部署：见 [DEPLOY.md](DEPLOY.md)

## 技术栈

-   后端：
    -   2.1.x: [Lumen](https://lumen.laravel.com/) with Filesystem & Session (PHP 框架)
    -   2.4.x: [Laravel](https://laravel.com/) (PHP 框架)
-   前端：
    -   2.1.x:
        [Vue](https://cn.vuejs.org/) (JS 框架), [ElementUI](https://element.eleme.io/) 1.x (UI 库)
    -   2.2.x:
        [React](https://reactjs.org/) (JS 框架),
        [dva](https://dvajs.com/) (数据流前端框架),
        [Ant Design](https://ant.design/) (UI 库)

## 更新日志

见 [CHANGELOG.md](CHANGELOG.md)

## 协议

-   1.x 版本依据 GPLv3 协议开源
-   2.x 版本依据 MIT 协议开源，请后续对此系统进行了更新的校内同学向 [GitHub 开源仓库](https://github.com/y-young/f1music) 提交 Pull request，以方便后续使用者
