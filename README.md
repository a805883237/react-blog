## 前言

基于 [郭大大的项目](https://github.com/gershonv/react-blog) 上，进行我的一系列想法实现。

至于为什么选择 这个库，是因为他的想法跟我的想法，在架构上面大体相同。其中 以 `tag` 标签 进行文章分类最为重要。 其次就是样式了，不得不说，这个样式非常符合我的胃口。

## 博客介绍

- 前后台分离式开发（项目中也包含博客的后台管理系统），为了方便记录后端开发过程，笔者将后端也一起放在同个项目文件夹中。
- 博客样式几乎借助于 antd 这个优秀的 UI 框架，主打简约风格，是笔者借鉴了 antd 官方的风格所设计。

- [博客地址](https://andd.top)
- [项目地址](https://github.com/a805883237/react-blog)

### 实现功能

- [x] 主页 + 列表页 + 搜索页 + 后台增删改查文章等
- [x] 博客标签、分类
- [x] 评论与回复功能模块 评论回复的邮件通知
- [x] 用户登录注册，以及权限管理 (jwt + localStorage)
- [x] markdown 代码高亮
- [x] 锚点导航 回到顶部
- [x] 响应式开发
- [x] 个人账户信息的修改

### 技术栈

- 前端 （基于 `create-react-app eject` 后的配置）
  - react v16.8.1
  - redux redux-thunk
  - react-router4
  - axios
  - marked highlight.js
- 后端 （自构建后台项目）
  - koa2 + koa-router
  - sequelize + mysql
  - jwt + bcrypt
  - nodemailer

## 效果

[预览地址在这](http://andd.top)

## 开启项目

### 前端

```bash
git clone https://github.com/a805883237/react-blog.git

cd react-blog

npm i --registry=https://registry.npm.taobao.org

npm start
```

### 后端

创建一个 blogdev 的 mysql 数据库，修改 `server/config/db.js` 去连接你的数据库。
运行 `server/config/blogdev.sql` 文件导入数据

```bash
cd server
npm i --registry=https://registry.npm.taobao.org
npm start
```

## 总结

基于 [郭大大的项目](https://github.com/gershonv/react-blog) 上，进行我的一系列想法实现。
