
# dhash

## 基于以太坊生态MetaMask钱包 去中心化Dapp
- 项目地址：https://github.com/dhash-mining/standard-hash-website
- 项目主要使用了react前端库、yarn 作为包管理工具，webpack打包工具。
- 多端设备适配

---

## 开发环境配置
- 	本地测试环境	Node	http://nodejs.cn/%EF%BC%89%E3%80%82
- 	本地静态资源服务器	nginx	http://nginx.org/
- 	Sass 编译	Node-sass	https://www.npmjs.com/package/node-sass
- 	命令行工具	Item	https://www.iterm2.com/
- 	代码管理	Git	https://git-scm.com/
- 	host切换	SwitchHosts	https://oldj.github.io/SwitchHosts/#cn
- 	编辑器	Vscode	https://code.visualstudio.com/

---

## 依赖安装
- yarn install
- yarn start 启动

---

## 项目说明
- 1.底层框架	    Recat	https://react.docschina.org/
-	2.ui库	       ant design	https://ant.design/components/overview-cn/
-	3.语法编译	    babel	https://www.babeljs.cn/
-	4.语法糖	    Typescript	https://www.tslang.cn/
-	5.css预处理器	Node-sass	https://www.npmjs.com/package/node-sass/v/4.9.1
-	6.版本管理	    Git	https://www.liaoxuefeng.com/wiki/896043488029600
-	7.打包工具	    webpack	https://www.webpackjs.com/
-	8.https 	   Axios	http://www.axios-js.com/
-	9.路由	       React-dom	https://react.docschina.org/docs/react-dom.html	

---
## 项目部署说明

-  node   https://www.cnblogs.com/coder-zyz/p/6748963.html，
-  yarn   https://www.jianshu.com/p/907ce1f908e5(安装node之后)，
          https://majing.io/posts/10000045261168(未安装node)，
- yarn build 打包
- nginx静态资源代理




## 部署

#### 部署环境
- 1.node.js  10+版本 
- 2.yarn  (无版本要求)


####  部署步骤：
- 1:安装依赖
    npm install 
- 2:打包
    npm run build 
- 3:上传文件 
    上传/build 目录下所有文件致服务器部署地址
- 4:重载nginx
    nginx -s reload

####  打包步骤： 
 1.根目录下 yarn build（会产生一个build 目录），
 2.将build 目录下的所有文件上传到服务器nginx配置的指定目录。


#### nginx配置：

- nginx server
```
  server {
        listen       8080;
        server_name   www.dhash.finance dhash.finance;
        location / {
           root /var/www/dapp/standard-hash-website
           build;    ///  文件存放地址
           #index  index.html index.htm;
           try_files $uri $uri/ @rewrites;
        }
        location @rewrites {
            rewrite ^(.*)$ /index.html last;
        }
  }
```