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

完全なFront Matterケース

# Markdown 拡張

- 1 日目の記事です

::: tip ヒント
This is a tip
:::

::: warning 警告
This is a warning
:::

::: danger 警告
This is a dangerous warning
:::

::: details コードスニペットのテスト

```js{2}
let str = "HelloWorld";
console.log(str);
```

:::

::: theorem テスト
テストの内容

::: right
[wikipedia](https://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E8%BF%90%E5%8A%A8%E5%AE%9A%E5%BE%8B)
:::

::: details Markdown テーブル
| Tables | Are | Cool |
| ------------- |:-------------:| -----:|
| col 3 is | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat | \$1 |
:::

## バッジ <Badge text="beta" type="warning"/>

_[HTML]: Hyper Text Markup Language  
_[W3C]: World Wide Web Consortium  
The HTML specification is maintained by the W3C.

==このようにハイライト表示==

文章内の一部を<mark>このようにハイライト表示</mark>させることができます。

@[youtube](https://www.youtube.com/watch?v=KsOCxwt-5FQ)

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
