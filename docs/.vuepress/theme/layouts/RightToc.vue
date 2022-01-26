<template>
  <div id="page-toc" v-html="toc"></div>
</template>

<script>
export default {
  data() {
    return {
      toc: ''
    }
  },
  mounted() {
    this.toc = document.querySelector('.table-of-contents').innerHTML
  }
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
  // background-color: #fff;
}
</style>