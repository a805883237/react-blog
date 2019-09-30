// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // "no-unused-vars": [2, {
    //   // 允许声明未使用变量
    //   "vars": "local",
    //   // 参数不检查
    //   "args": "none"
    // }],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    // 关闭缩进校验
    "indent": 'off',
    // 方法 {  和 ） 之间的空格校验
    "space-before-blocks": 'off',
    // 参数之间的 , 前后空格
    "comma-spacing": 'off',
    // 末尾的;
    "semi": 'off',
    // 未使用的变量
    "no-unused-vars": 'off',
    // 不知道什么意思的
    "key-spacing": 'off',
    // 定义的全局不识别， 关掉它
    "no-undef": 'off',
    // 注释后边必须带空格？ 为啥？
    "spaced-comment": 'off',
    // 多个空格
    "no-multi-spaces": 'off',
    // 鬼知道是啥，空格的
    "space-in-parens": 'off',
    // 老子三目爱咋写咋写
    "operator-linebreak": 'off',
    // 文件最后竟然不带; 玩呢？
    "eol-last": 'off',
    // 划分区域的多个空行，为啥不让类
    "no-multiple-empty-lines": 'off',
    // 行末尾的注释，不支持
    "comma-dangle": 'off',
    // 关闭 单双引号校验
    "quotes" : 'off'
  }
}
