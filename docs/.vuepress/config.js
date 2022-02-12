const { path } = require('@vuepress/utils')
// const webpack = require('webpack')
// const axios = require('axios')

const base = "/static/dist/"

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
    // layouts: path.resolve(__dirname, 'components/layouts/Layout.vue'),
    // navbar: [
    //   {
    //     text: '首页',
    //     link: ''
    //   }
    // ],

    sidebar: {
      '/java/': [
        {
          text: 'java 基础',
          children: [
            {
              text: '面向对象',
              link: '/java/java-basic/java-basic-object',
            },
            {
              text: '常见基础类',
              link: '/java/java-basic/java-basic-class',
            },
            {
              text: '泛型机制',
              link: '/java/java-basic/java-basic-generic',
            },
            {
              text: '注解机制',
              link: '/java/java-basic/java-basic-annotation',
            },
          ],

        },
        {
          text: '日期框架',
          children: [
            {
              text: '概述',
              link: '/java/java-date/java-date-summary',
            },
          ],
        },
        {
          text: '异常框架',
          children: [
            {
              text: '概述',
              link: '/java/java-exception/java-exception-summary',
            },
          ],
        },
        {
          text: '集合框架',
          children: [
            {
              text: '概述',
              link: '/java/java-collection/java-collection-summary',
            },
          ],
        },
        {
          text: 'IO框架',
          children: [
            {
              text: '概述',
              link: '/java/java-io/java-io-summary',
            },
          ],
        },
        {
          text: 'NIO框架',
          children: [
            {
              text: '概述',
              link: '/java/java-nio/java-nio-summary',
            },
          ],
        },
        {
          text: 'juc并发',
          children: [
            {
              text: '线程基础',
              link: '/java/java-juc/java-juc-base',
            },
            {
              text: '线程同步锁',
              link: '/java/java-juc/java-juc-sys',
            },
            {
              text: '线程全部',
              link: '/java/java-juc/java-juc-all',
            },
          ],

        },
        {
          text: 'jvm虚拟机',
          children: [
            {
              text: '概述',
              link: '/java/java-jvm/java-jvm-summary',
            },
          ],
        },
      ]
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
