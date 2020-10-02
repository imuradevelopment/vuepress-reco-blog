# ブログ構築
[[TOC]]
## 全般

### 参考リンク
- vuepress
  - よく使う
    - [vuepressドキュメント](https://vuepress.vuejs.org/guide/getting-started.html#prerequisites)
  - 後で使う
    - [使える絵文字一覧](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)
    - [コードスニペットのimport](https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets)
    - [コンテナ拡張](https://vuepress.github.io/en/plugins/container/#installation)
    - [アルゴリア検索](https://vuepress.vuejs.org/theme/default-theme-config.html#algolia-search)
  - 調査
    - [リダイレクト？](https://vuepress.vuejs.org/guide/markdown.html#redirection-for-urls)
    - [フロントマター](https://vuepress.vuejs.org/guide/markdown.html#frontmatter)
    - [SEO対策](https://blog.ouvill.net/blog/2019-03-30--vuepress_blog/make_vuepress_blog/#seo-%E5%AF%BE%E7%AD%96%E3%82%92%E6%96%BD%E3%81%99)
- markdown
    - [Qiita Markdown 書き方 まとめ](https://qiita.com/shizuma/items/8616bbe3ebe8ab0b6ca1)
    - [Markdown記法 チートシート](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)
    - [Markdown記法 チートシート](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)
- 構築
    - [[VuePress/Netlify]markdownだけでWebページを作成して公開するまで](https://qiita.com/ozaki25/items/a1988b01f83f6616b7f9)
    - [TermuxでgitのAndroid設定](https://debslink.hatenadiary.jp/entry/20180922/1537573651)
- Git
  - [Gitでやりたいこと、ここで見つかる](https://qiita.com/shimotaroo/items/b73d896ace10894fd290)
  - [Gitで色々取り消したい](https://qiita.com/tani-shi/items/3419600447292abf6c79)
- Netlify
  - [netlifyナレッジ共有](https://qiita.com/asahi13/items/4efc5615fa60384c5220)

## vuepress

### ディレクトリ構成一覧
  ```
  .
  ├── docs
  │   ├── .vuepress (任意)
  │   │   ├── components (任意)
  │   │   ├── theme (任意)
  │   │   │   └── Layout.vue
  │   │   ├── public (任意)
  │   │   ├── styles (任意)
  │   │   │   ├── index.styl
  │   │   │   └── palette.styl
  │   │   ├── templates (任意, 危険区域)
  │   │   │   ├── dev.html
  │   │   │   └── ssr.html
  │   │   ├── config.js (任意)
  │   │   └── enhanceApp.js (任意)
  │   │ 
  │   ├── README.md
  │   ├── guide
  │   │   └── README.md
  │   └── config.md
  │ 
  └── package.json


  ```

### ディレクトリ構成詳細

#### docs > .vuepress
  ```
    グローバル構成、コンポーネント、静的リソースなどを格納するために使用されます。
  ```

#### docs > .vuepress > components
  ```
    このディレクトリーのVueコンポーネントは、グローバルコンポーネントとして自動的に登録されます。
  ```

#### docs > .vuepress > theme
  ```
    ローカルテーマを格納するために使用されます。
  ```

#### docs > .vuepress > styles
  ```
    スタイル関連ファイルを格納します。
  ```

#### docs > .vuepress > styles > index.styl
  ```
    CSSファイルの最後に生成される、自動的に適用されるグローバルスタイルファイルは、デフォルトスタイルよりも優先されます。
  ```

#### docs > .vuepress > styles > palette.styl
  ```
    パレットは、デフォルトの色定数を上書きし、スタイラスの色定数を設定するために使用されます。
   ```

#### docs > .vuepress > public
  ```
    静的リソースディレクトリ。
  ```

#### docs > .vuepress > templates
  ```
    HTMLテンプレートファイルを保存します。
  ```

#### docs > .vuepress > templates > dev.html
  ```
    開発環境用のHTMLテンプレートファイル。
  ```

#### docs > .vuepress > templates > ssr.html
  ```
    ビルド時のVue SSRベースのHTMLテンプレートファイル。
  ```

#### docs > .vuepress > config.js
  ```
    構成のエントリファイル。ymlまたはにすることもできますtoml。
  ```

#### docs > .vuepress > enhanceApp.js
  ```
    アプリレベルの機能強化
  ```
