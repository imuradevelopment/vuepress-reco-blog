//.vuepress/config.js
const fs = require("fs");
const path = require("path");

function getSidebar(parentDir, ...extens) {
  var startNodeDir = parentDir;
  var getInDirsArray = function(parentDir) {
    let inDirs = fs.readdirSync(parentDir).filter((f) => {
      if (
        fs.existsSync(parentDir + "/" + f) &&
        fs.statSync(parentDir + "/" + f).isDirectory()
      ) {
        return f;
      }
    });
    return inDirs;
  };
  var getInFilesArray = function(parentDir, extens) {
    let inFiles = fs.readdirSync(parentDir).filter((f) => {
      if (
        fs.existsSync(parentDir + "/" + f) &&
        fs.statSync(parentDir + "/" + f).isFile() &&
        extens.includes(path.extname(f))
      ) {
        return f;
      }
    });
    return inFiles;
  };
  var replaceParentDir = function(parentDir, childFile) {
    let extname = "." + path.extname(childFile);
    childFile = childFile.replace(extname, "");
    if (parentDir == startNodeDir) {
      if (childFile.toLowerCase() == "readme.md") {
        return "";
      } else {
        return childFile;
      }
    } else {
      if (childFile.toLowerCase() == "readme.md") {
        return parentDir.replace(startNodeDir + "/", "") + "/";
      } else {
        return parentDir.replace(startNodeDir + "/", "") + "/" + childFile;
      }
    }
  };
  let getSidebarRecurse = function(
    parentDir,
    extens,
    callBackGetSidebarRecurse
  ) {
    let sidebarRecurse = [];
    let childDirsArray = getInDirsArray(parentDir);
    let childFilesArray = getInFilesArray(parentDir, extens);
    let replacedChildFilesArray = childFilesArray.map((childFile) => {
      return replaceParentDir(parentDir, childFile);
    });
    // ファイルの配列結合
    sidebarRecurse = sidebarRecurse.concat(replacedChildFilesArray);

    let replacedChildDirsArray = childDirsArray.map((childDir) => {
      let unitSideBar = {
        title: childDir,
        collapsable: true,
        sidebarDepth: 1,
        children: callBackGetSidebarRecurse(
          parentDir + "/" + childDir,
          extens,
          callBackGetSidebarRecurse
        ),
      };
      return unitSideBar;
    });
    replacedChildDirsArray = replacedChildDirsArray.filter(
      (unitSideBar) => unitSideBar.children.length != 0
    );
    sidebarRecurse = sidebarRecurse.concat(replacedChildDirsArray);
    return sidebarRecurse;
  };
  let sidebar = getSidebarRecurse(parentDir, extens, getSidebarRecurse);
  console.log(...extens);
  console.dir(sidebar);
  return sidebar;
}

module.exports = {
  // ベースURL
  //base:'/imura/',
  // 多言語対応
  locales: {
    "/": {
      lang: "ja",
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
    // ["script", { src: "/bg.js" }],
  ],

  // 開発用サーバー
  host: "0.0.0.0",
  // ポート
  port: "8080",
  // クライアントの一時ディレクトリ
  //temp: "/path/to/@vuepress/core/.temp",
  // 出力ディレクトリ
  //dest: '.vuepress/dist',
  dest: "public",
  // 不明の設定
  //shouldPrefetch: () => true,
  // キャッシュ(webpack高速化)
  //cache: true,
  // 監視ファイル(vuepress再構築,リアルタイム更新)
  //extraWatchFiles: ["/README.md"],
  // ファイルが見つからないとき探しに行くパターン
  pattern: ["**/*.md", "**/*.vue"],
  plugins: [
    // [
    //   //彩带背景 先安装在配置， npm install vuepress-plugin-ribbon --save
    //   "ribbon",
    //   {
    //     size: 90, // リボンの幅、デフォルト：90
    //     opacity: 0.8, //リボンの不透明度、デフォルト：0.3
    //     zIndex: -1, // 背景のz-indexプロパティ、デフォルト：-1
    //   },
    // ],
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
    //displayAllHeaders: true,
    nextLinks: true,
    prevLinks: true,
    smoothScroll: true,
    searchMaxSuggestions: 10,
    subSidebar: "auto",
    //type: "blog",
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
    //  searchMaxSuggestions: 10,
    // サイドバー自動
    //  sidebar: "auto",
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
      //
      "/docs/": getSidebar("./docs", ".md", ".vue"),
    },
  },
};
