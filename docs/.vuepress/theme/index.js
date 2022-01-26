const { path } = require('@vuepress/utils')
// const defaultTheme = require('@vuepress/theme-default')

module.exports = {
  name: 'vuepress-theme-mak',
  extends: '@vuepress/theme-default',
  layouts: {
    Layout: path.resolve(__dirname, 'layouts/Layout.vue')
  }
}