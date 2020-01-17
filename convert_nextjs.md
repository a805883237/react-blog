# 将现有 react 项目转化成 nextJS 项目

### 搭建 `nextjs` 项目初始框架
搭建在我看来分为两种，一种是现有的脚手架，一种是从0开始搭建

从0开始搭建，考虑到 antd + react 环境配置略显繁杂，被我放弃了

* 脚手架搭建
```
yarn create next-app --example with-ant-design next

参数说明： create next-app --example with-ant-design 大意是指取脚手架的目录
最后一个参数: 为 clone 下来创建的目录，我这里使用 next 作为文件夹(目录)名称

clone下来的所有东西都在 next 文件夹下
```

### 构建初始脚本
刚创建完，`package.json` 内就有了这些
```json
{
 "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```
第一步，配置 `cross-env`,消除环境差异
```
npm install --save-dev cross-env
```
第二步，搭建 `route`, 因为考虑到大部分路径还是自己制定的比较好，用next自带的文件目录不够我操作的，不够明确
* 添加 `express` : `yarn add  express --save`
```js
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 运行 dev 模式时，监听的端口
const PORT = process.env.PORT || 8089;

app.prepare()
.then(() => {
  const server = express();
  server.get('/', (req, res) => {
    const actualPage = '/home';
    app.render(req, res, actualPage)
  });
  
  // server.get('/p/:id', (req, res) => {
  //   const actualPage = '/post';
  //   const queryParams = { title: req.params.id }
  //   app.render(req, res, actualPage, queryParams)
  // });
  
  server.get('*', (req, res) => {
    return handle(req, res)
  });
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});
```
我靠。。我搜各种文档后发现。。。原来next上就有
[Express integration](https://github.com/zeit/next.js/tree/7.0.0-canary.11/examples/custom-server-express)
[Koa integration](https://github.com/zeit/next.js/tree/7.0.0-canary.11/examples/custom-server-koa)


第三步，修改 `package.json` 内 `script` 脚本
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=production node server.js",
    "build": "next build",
    "start": "cross-env NODE_ENV=production node server.js",
    "prod": "next build && pm2 start ecosystem.config.js --only prod-front --watch"
  }
}
```
第四步，修改完后的启动命令为：
```
npm run start
或者
npm run dev
```

至此，初始化构建已完成

### 项目迁移


