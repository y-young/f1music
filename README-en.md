# FZYZ School Music Electing System

![Author](https://img.shields.io/badge/Author-Googleplex-green.svg?style=for-the-badge "Author")
![Backend](https://img.shields.io/badge/Backend-Lumen-orange.svg?style=for-the-badge "Backend")
![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg?style=for-the-badge "Author")
![UI](https://img.shields.io/badge/UI-Ant%20Design-blue.svg?style=for-the-badge "UI")

[中文](README.md) | English

## Introduction & Events Overview

The system used for electing annual school music in Fuzhou No.1 High School(FZYZ), the events can trace back to year 2007.  
1.x version(trace back to year 2009) was developed by [@upsuper](https://upsuper.org/), and maintained by several seniors of the SCAN Club such as @Robot and [@miskcoo](https://blog.miskcoo.com/) (Unconfirmed), the events were conducted by SCAN Club members.  
2.x version was developed by [@Googleplex](https://gpx.moe/) since 2016 according to the main logic of the 1.x version, and was first successfully used in November, 2017. Since the SCAN Club was incorporated with 7HMakers Club in 2017, the event of that year was conducted by the original SCAN members in 7HMakers Club, then the following events will be conducted by later 7HMakers members.

## Deployment

Recommended configuration for the server:
- OS: Popular Linux releases
- Memory: 512MB+
- Environment: PHP 7.2+ (with Composer), Nginx, MySQL 5.6+

Instructions to deploy production and development environment:  
See [DEPLOY.md](DEPLOY.md)

## Technology Stack

Backend:  
[Lumen](https://lumen.laravel.com/) with Filesystem & Session (PHP Framework)  
Frontend:  
2.1.x:
[Vue](https://cn.vuejs.org/) (JS Framework), [ElementUI](https://element.eleme.io/) 1.x (UI)  
2.2.x:
[React](https://reactjs.org/) (JS Framework),
[dva](https://dvajs.com/) (Dataflow frontend framework),
[Ant Design](https://ant.design/) (UI)


## Changelog
See [CHANGELOG.md](CHANGELOG.md)

## License

- 1.x: under GPLv3 license;
- 2.x: under MIT license.
