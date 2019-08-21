# 部署

## 前期准备
1. 安装配置 `Git`, `PHP`, `Nginx` / `Apache` (不推荐) 和 `MySQL` / `MariaDB`：  
 推荐使用 `Oneinstack`，手动安装也可：
 具体教程见[Oneinstack 官网](https://oneinstack.com)  
 - 要求环境：PHP >= 7.1.3, PHP 扩展 (BCMath, Curl, OpenSSL, PDO, Mbstring, Fileinfo), MySQL >= 5.6 / MariaDB >= 10.3
2. 使用 `Oneinstack` 中的 `addons.sh` 安装 `composer`, 在 `php.ini` 中取消禁用函数 `putenv`, `proc_open` (`composer` 要求)
3. 安装 `yarn` 以及 `node.js` 和 `npm` （均推荐使用最新稳定版本），详见 [Yarn 官网](https://yarnpkg.com/) 和 [Node.js官网](https://nodejs.org/)
4. 为 `composer`, `yarn` 和 `npm` 配置国内镜像源：  
 composer: `composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/` ([镜像官网](https://mirrors.aliyun.com/composer/)))  
 yarn: `yarn config set registry 'https://registry.npm.taobao.org'`  
 npm: `npm config set registry https://registry.npm.taobao.org` ([镜像官网](https://npm.taobao.org/))
5. 建立虚拟主机：  
 使用 `Oneinstack` 中的 `vhost.sh`，按提示操作，建议启用 `Let's Encrypt`，伪静态规则使用 `laravel`
6. 修改虚拟主机配置文件，将网站根目录(`root` 选项)改为 `PATH_TO_F!MUSIC/public`
7. 建立用户组 `musicdev` (名称可自选)，将管理源码的用户加入此用户组
8. 修改服务器 `hosts` ，将福州一中官网（fzyz.net）解析为内网 IP，或将 `.env` 中的 `loginUrl` 更改为内网地址
9. 替换 `php.ini` ：
 生产环境： `php.ini-production`
 开发环境： `php.ini-development`
9.  按如下修改 `php.ini` 并重启 `php-fpm`
 ```
 post_max_size = 20M
 file_uploads = On
 upload_max_filesize = 20M
 ```

## 开始部署
### 自动部署
注：仅适用于 `Linux` 环境，`WSL` 也可

赋予 `deploy.sh` 执行权限：`sudo chmod +x deploy.sh`，执行命令 `sudo env PATH="$PATH" ./deploy.sh` （防止环境变量不同），按提示操作（可能存在bug）

### 手动部署
1. 从 `Git` 仓库克隆项目核心代码到网站根目录
2. 安装后端依赖库：  
 生产环境： `composer install --no-dev`  
 开发环境：`composer install`
3. `cd react` 进入前端资源目录，安装前端编译环境依赖库：`yarn`
4. 建立数据库及数据库专用用户（命令行工具或 `phpMyAdmin`），专用用户仅对本数据库有基本操作权限，且只允许本地访问
5. 生成 32 字符随机密钥用作 `APP_KEY`
6. 修改 `.env` 和 `config/database.php` 中的 `APP_KEY` 和数据库信息
7. 修改 `.env` 中的相关变量：  
 生产环境：`APP_ENV=production APP_DEBUG=false`  
 开发环境：`APP_ENV=local APP_DEBUG=true`
8. `php artisan migrate` 自动创建必要的数据表
9. 创建软链接：  
 Linux: `cd ../public && ln -s ../storage/app/uploads uploads && cd ..`  
 Windows: `cd ../public && mklink /D uploads ..\storage\app\uploads && cd ..` （以管理员身份运行）
10. `cd react && npm run build` 编译前端 JS & CSS 文件
11. 权限配置：  
 对于源码根目录（如 `f1music`），将用户组更改为`musicdev`，所有者更改为 `www` (`Nginx` 使用的用户)，权限更改为 570  
 将 `storage` 目录权限更改为 770