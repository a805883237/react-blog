# be

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



# 处理过的坑
- antd 的 message 组件不能再全局用

  解决方法： 放到全局的 `app.vue` 的 `created` 生命周期内， 将 this.$message 绑定到 `global` 内 ，这样全局都可以调用 `message`