# 问题排查

## Git 出现大量已修改文件
执行 `git config core.filemode false`

## Nginx 返回 403
1. 未在虚拟主机配置文件中将网站根目录设置为 `f1music/public`
2. 文件权限配置不正确，`nginx` 用户无足够权限

## Nginx 将内存耗尽
检查 `nginx.conf` 中的 `worker_processes` 和 `worker_connections` 选项，可适当调小

## npm / yarn 安装时出现 Permission denied 或莫名其妙的错误
尝试使用 `sudo`，调整 `node_modules` 的权限或删除 `node_modules` 重试

## 文件上传总是失败
查看 `nginx` 和 `php` 的错误日志，可能是 `php.ini` 中 `post_max_size`, `file_uploads` 或 `upload_max_filesize` 设置有误