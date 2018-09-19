module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017
  },
  env: {
    browser: true
  },
  extends: [
    'airbnb-base'
  ],
  globals: {
    'config': true
  },
  rules: {
    'comma-dangle': 'off', //结尾使用额外的逗号
    'quote-props': 'off', //只对非法标识符的属性使用引号
    // 'no-trailing-spaces': 'off' //禁止行尾空格
    'vue/html-self-closing': 'off', 
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/first': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-len': 'off',
    'import/no-dynamic-require': 'off',
    'linebreak-style': 'off', //强制统一的换行符
    'no-tabs': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'global-require': 'off', //全局的require
    'no-debugger': process.env.NODE_ENV === 'production'? 2 : 0,
    'no-alert': process.env.NODE_ENV === 'production'? 2 : 0,
    'no-console': 'off', //暂时先关掉，因为prod也有可能需要输入
    'no-param-reassign': 'off',
    "prefer-promise-reject-errors": 'off',
    "no-mixed-operators": 'off',
    "func-names": 'off'
  }
}
