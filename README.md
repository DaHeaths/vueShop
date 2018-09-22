# vueShop

## 简介
```txt
 使用 Vue + mongoDB + node(express)
```

## Vue项目(前端)初始化

``` bash
$ git git@github.com:DaHeaths/vueShop.git

$ cd vueShop

$ npm install

$ npm run dev
```
## server项目(后端)初始化
```bash
cd vueShop/server

# 由于前期后端跟前端代码放在一起（只依赖根文件夹的package.json），后期分离（这里不用再npm instal 安装依赖项），直接执行即可
node bin/www
or
pm2 bin/www
```


