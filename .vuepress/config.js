module.exports = {
  title: "ADHDの休憩所",
  description: "Information is not knowledge.",
  dest: "public",
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
  theme: "reco",
  themeConfig: {
    nav: [
      { text: "ホーム", link: "/", icon: "reco-home" },
      { text: "カテゴリ", link: "/category/", icon: "reco-home" },
      { text: "タグ", link: "/tag/", icon: "reco-home" },
      { text: "テスト", link: "/test/", icon: "reco-home" },
      { text: "タイムライン", link: "/timeline/", icon: "reco-date" },
      {
        text: "文書",
        icon: "reco-message",
        items: [{ text: "vuepress-reco", link: "/docs/testdir/" }],
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
    sidebar: {
      "/docs/theme-reco/": ["", "theme", "plugin", "api"],
    },
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
      }
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
    lastUpdated: "Last Updated",
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

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  markdown: {
    //lineNumbers: true,
  },
  // *****************以下自分で設定
  locales: {
    "/": {
      lang: "ja",
      title: "ADHDの休憩所",
    },
  },
};
