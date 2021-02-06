const fs = require("fs");
const path = require("path");

module.exports = {
  // ベースURL
  //base:'/imura/',
  // 多言語対応
  locales: {
    "/": {
      lang: "ja-JP",
    },
  },
  // タイトル
  title: "VanillaNote",
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
    //["link", { rel: "manifest", href: "/manifest.json" }],
  ],

  // 開発用サーバー
  host: "0.0.0.0",
  port: "8080",
  // 出力ディレクトリ
  dest: "public",
  //extraWatchFiles: ["/README.md"],
  // ファイルが見つからないとき探しに行くパターン
  pattern: ["**/*.md", "**/*.vue"],
  plugins: [
    [
      //彩带背景 先安装在配置， npm install vuepress-plugin-ribbon --save
      "ribbon",
      {
        size: 90, // リボンの幅、デフォルト：90
        opacity: 0.8, //リボンの不透明度、デフォルト：0.3
        zIndex: -1, // 背景のz-indexプロパティ、デフォルト：-1
      },
    ],
    [
      "reading-progress",
      {
        readingDir: ["docs", "blogs"],
      },
    ],
    [
      "vuepress-plugin-code-copy",
      {
        //align: "top",
        //color: String,
        backgroundTransition: true,
        //backgroundColor: String,
        successText: "コピー完了!",
        staticIcon: false,
      },
    ],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
  markdown: {
    //extractHeaders: ["h2", "h3", "h4"],
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
      // インライン<mark>マークしたい文章</mark>
      "markdown-it-mark",
      // CodePenとJSFiddleの埋め込み対応
      // @[codepen](iframe src)
      // @[jsfiddle](iframe src)
      "markdown-it-playground",
      // YouTubeとVimeoの埋め込み対応
      // @[youtube](movie id)
      // @[vimeo](movie id)
      "markdown-it-video",
    ],
  },
  theme: "reco",
  themeConfig: {
    type: "blog",
    mode: "dark", // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: false, // 默认 true，false 不显示模式调节按钮，true 则显示
    nav: [
      { text: "ホーム", link: "/", icon: "reco-home" },
      {
        text: "記事一覧",
        icon: "reco-message",
        link: "/docs/",
        // items: [
        //   { text: "vue.js", link: "/docs/vuejs/" },
        //   { text: "vuepress", link: "/docs/vuepress/" },
        //   { text: "javascript", link: "/docs/javascript/" },
        //   { text: "GitとGithub", link: "/docs/infrastructure/git&github/" },
        //   { text: "Github", link: "/docs/infrastructure/github/" },
        // ],
      },
      { text: "タイムライン", link: "/timeline/", icon: "reco-date" },
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
    subSidebar: "auto",
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
      // {
      //   title: "午后南杂",
      //   desc: "Enjoy when you can, and endure when you must.",
      //   email: "1156743527@qq.com",
      //   link: "https://www.recoluan.com",
      // },
      // {
      //   title: "vuepress-theme-reco",
      //   desc: "A simple and beautiful vuepress Blog & Doc theme.",
      //   avatar:
      //     "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   link: "https://vuepress-theme-reco.recoluan.com",
      // },
    ],
    search: true,
    // サイドバー自動
    //sidebar: "auto",
    displayAllHeaders: true,
    // 最終更新
    lastUpdated: "最終更新",
    // 作者
    author: "Imura",
    // 作者アバター
    authorAvatar: "/avatar.png",
    // 备案号
    //    record: "xxxx",
    // プロジェクト開始
    startYear: "2020",
    /**
     * 密钥 (if your blog is private)
     */

    //    keyPage: {
    //      keys: ['5f4dcc3b5aa765d61d8327deb882cf99'],
    //      color: '#42b983',
    //      lineColor: '#42b983',
    //    },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }

    sidebar: {
      "/docs/": [
        {
          title: "infrastructure",
          collapsable: true,
          sidebarDepth: 1,
          children: [
            {
              title: "git",
              collapsable: true,
              sidebarDepth: 1,
              children: ["infrastructure/git/", "infrastructure/git/git"],
            },
            {
              title: "github",
              collapsable: true,
              sidebarDepth: 1,
              children: [
                "infrastructure/github/",
                "infrastructure/github/github",
              ],
            },
          ],
        },
      ],
      "/test/": getSideBar("docs/infrastructure", "testTitle"),
    },
  },
  "getSideBar" : (folder, title) => {
      const extension = [".md"];
      let searchPath = path.join(`${__dirname}/../${folder}/`);
      let folderNames = fs
        .readdirSync(searchPath)
        .filter((item) => fs.statSync(path.join(searchPath, item)).isDirectory());
      let folderLength = folderNames.length;
      if(folderLength == 0){
        const files = fs
          .readdirSync(searchPath)
          .filter(
            (item) =>
              item.toLowerCase() != "readme.md" &&
              fs.statSync(path.join(searchPath, item)).isFile() &&
              extension.includes(path.extname(item))
          );
        console.log("選択フォルダ:" + folder);
        console.log(
          "選択フォルダ:" +
            JSON.stringify([{ title: title, children: ["", ...files] }])
        );
        //return [{ title: title, children: ["", ...files] }];
      }else{
        let searchPaths = [];
        searchPaths.push(searchPath);
        folderNames.forEach((folderName) =>
          searchPaths.push(path.join(searchPath, folderName))
        );
        searchPaths.foreach((searchPath) =>
          console.log(searchPath)
        );
        console.log(searchPaths);
      }
    }
};

function getSideBar (folder, title) {
  const extension = [".md"];
  const files = fs
    .readdirSync(path.join(`${__dirname}/../${folder}`))
    .filter(
      (item) =>
        item.toLowerCase() != "readme.md" &&
        fs.statSync(path.join(`${__dirname}/../${folder}`, item)).isFile() &&
        extension.includes(path.extname(item))
    );
  console.log(folder);
  console.log("選択フォルダ:" + folder);
  console.log(
    "選択フォルダ:" +
      JSON.stringify([{ title: title, children: ["", ...files] }])
  );
  //return [{ title: title, children: ["", ...files] }];
}
