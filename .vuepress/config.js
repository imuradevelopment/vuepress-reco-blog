module.exports = {
  // ベースURL
  //base:"/imura/",
  // タイトル
  title: "ADHDの休憩所",
  // 説明
  description: "Information is not knowledge.",
  // HEAD
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  // 開発用サーバー
  host: "0.0.0.0",
  // ポート
  port: "8080",
  // クライアントの一時ディレクトリ
  temp: "/path/to/@vuepress/core/.temp",
  // 出力ディレクトリ
  //dest: ".vuepress/dist",
  dest: "public",
  // 多言語対応
  locales: {
    "/": {
      lang: "ja",
    },
  },
  // 意味不明
  shouldPrefetch: () => true,
  // キャッシュ(webpack高速化)
  cache: true,
  // 監視ファイル(vuepress再構築,リアルタイム更新)
  extraWatchFiles: ["/README.md"],
  // ファイルが見つからないとき探しに行くパターン
  pattern: ["**/*.md", "**/*.vue"],
  markdown: {
    //lineNumbers: true,
    toc: { includeLevel: [1, 2, 3] },
    anchor: {
      permalink: true,
      permalinkSymbol: "#",
    },
    linkify: true,
    externalLinks: { target: "_blank", rel: "noopener noreferrer" },
    config: (md) => {
      md.use(require("markdown-it-mark"));
    },
    plugins: [
      // 語彙説明
      // *[説明したい語彙]:ホバー表示文
      "markdown-it-abbr",
      // マーカー
      // ==マークしたい文章==
      "markdown-it-mark",
    ],
  },
  theme: "reco",
  themeConfig: {
    nav: [
      { text: "ホーム", link: "/", icon: "reco-home" },
      { text: "タイムライン", link: "/timeline/", icon: "reco-date" },
      {
        text: "記事",
        icon: "reco-message",
        items: [
          { text: "vue.js", link: "/docs/vuejs/" },
          { text: "vuepress", link: "/docs/vuepress/" },
          { text: "javascript", link: "/docs/javascript/" },
          { text: "GitとGithub", link: "/docs/infrastructure/git&github/" },
          { text: "Github", link: "/docs/infrastructure/github/" },
        ],
      },
      {
        text: "SNS",
        icon: "reco-message",
        items: [
          {
            text: "Twitter",
            link: "https://twitter.com/ADHD66502327",
            icon: "reco-twitter",
          },
        ],
      },
    ],
    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    searchMaxSuggestions: 10,
    // sidebar: [
    //   {
    //     title: "",
    //     path: "/blogs/",
    //     collapsable: false,
    //     sidebarDepth: 3,
    //     children: ["/vuepress", "/markdown拡張"],
    //   },
    //   {
    //     title: "ブログ",
    //     path: "/blog/",
    //     collapsable: true,
    //     sidebarDepth: 3,
    //     children: ["/blog/article_2", "/blog/article_3"],
    //   },
    // ],
    subSidebar: true,
    type: "blog",
    // ブログ設定
    blogConfig: {
      category: {
        location: 2,
        text: "カテゴリー",
      },
      tag: {
        location: 3,
        text: "タグ",
      },
    },
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
    search: true,
    searchMaxSuggestions: 10,
    // サイドバー自動
    // sidebar: 'auto',
    // 最終更新
    lastUpdated: "最終更新",
    // 作者
    author: "Imura",
    // 作者アバター
    authorAvatar: "/avatar.png",
    // 备案号
    record: "xxxx",
    // プロジェクト開始
    startYear: "2020",
    /**
     * 密钥 (if your blog is private)
     */

    //    keyPage: {
    //      keys: ["5f4dcc3b5aa765d61d8327deb882cf99"],
    //      color: "#42b983",
    //      lineColor: "#42b983",
    //    },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
};
