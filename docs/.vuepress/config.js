const { path } = require('@vuepress/utils')
// const webpack = require('webpack')
// const axios = require('axios')
const java = require('./assets/js/java.js')
const interview = require('./assets/js/interview.js')
const base = "/static/dist/"
console.log(java)
module.exports = {
  lang: 'zh-CN',
  title: 'java 知识全栈体系',
  description: 'java 知识全栈体系',
  base: base,
  head: [
  //  ['script', {type: 'text/javascript', src: base+'baidu.js'}],
   // ['script', {type: 'text/javascript', src: 'https://www.googletagmanager.com/gtag/js?id=G-ELBNL6ERJ1'}],
  //  ['script', {type: 'text/javascript', src: base+'google.js'}],
    ['link', { rel: 'icon', href: '/images/javalog.png' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  theme: path.resolve(__dirname, 'theme'),
  themeConfig: {
    logo: '/images/javalog.png',
    sidebar: {
      '/java/': java,
      '/interview/': interview
    } ,
    lastUpdatedText: '日期',
    contributorsText: '作者'
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        components: {
          UserComment: path.resolve(__dirname, './components/Comment/index.vue'),
        },
      },
      {
        components: {
          LoginUser: path.resolve(__dirname, './components/LoginUser/index.vue'),
        },
      },
    ],
  ],
}
