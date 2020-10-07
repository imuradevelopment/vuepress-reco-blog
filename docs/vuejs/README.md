---
title: vue
date: 2020-10-01
categories:
 - カテゴリ1
 - カテゴリ2
tags:
 - タグ1
 - タグ2
keys:
 - 'e10adc3949ba59abbe56e057f20f883e'
publish: true
sticky: 1
isTimeLine: true
sidebar: true
isComment: false
---

<p class="demo" :class="$style.example"></p>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ['slot-key'],
  mounted () {
    document.querySelector(`.${this.$style.example}`)
      .textContent = 'この文章のみスタイリングする書き方'
  }
}
</script>
