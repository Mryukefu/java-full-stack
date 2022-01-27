<!--
 * @Author: your name
 * @Date: 2022-01-18 14:25:05
 * @LastEditTime: 2022-01-26 17:48:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \press-test\docs\.vuepress\theme\layouts\RightToc.vue
-->
<template>
  <div id="page-toc"></div>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
  #page-toc {
    position: fixed;
    z-index: 10;
    right: 12px;
    top: 72px;
    width: calc((100vw - 820px - 320)/2);
    padding: 8px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    word-wrap: nowrap;
    border: 2px solid #999;
    border-radius: 8px;
    max-height: 60vh;
    overflow-y: auto;
    background-color: #2c3e50;
  }
  ::-webkit-scrollbar {
    width: 20px;
  }
  ::-webkit-scrollbar-track {
    background-color: #627efa;
    border-radius: 4px;
  } /* 滚动条的滑轨背景颜色 */

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
  } /* 滑块颜色 */
</style>