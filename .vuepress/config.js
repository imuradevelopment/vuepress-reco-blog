//.vuepress/config.js
const fs = require("fs");
const path = require("path");

// sidebar 自動化
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

// -------------------------------------------------------------------
function getRandomBgImage() {
  let parentDir = "./.vuepress/public/images/freeImage";
  let inFiles = fs.readdirSync(parentDir).filter((f) => {
    if (
      fs.existsSync(parentDir + "/" + f) &&
      fs.statSync(parentDir + "/" + f).isFile()
    ) {
      return f;
    }
  });
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  let index = getRandomInt(0, inFiles.length);
  //return parentDir + inFiles[index];
  return "/images/freeImage/" + inFiles[index];
}
// -------------------------------------------------------------------
let bgImagePath = getRandomBgImage();
try {
  fs.writeFileSync("README.md", "---");
  fs.appendFileSync("README.md", "home: true");
  fs.appendFileSync("README.md", "bgImage: /images/freeImage/65.jpg");
  fs.appendFileSync("README.md", "heroText: TESTfunction");
  fs.appendFileSync("README.md", "tagline: test");
  fs.appendFileSync("README.md", "---");
} catch (e) {
  console.log(e.message);
}
// -------------------------------------------------------------------

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
  // クライアントの一時ディレクトリ
  //temp: "/path/to/@vuepress/core/.temp",
  // 出力ディレクトリ
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
    [
      "reading-progress",
      {
        readingDir: ["docs", "blogs"],
      },
    ],
    [
      "vuepress-plugin-code-copy",
      {
        backgroundTransition: true,
        successText: "コピー完了!",
        staticIcon: false,
      },
    ],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        //updatePopup: true,
        updatePopup: {
          message: "コンテンツが新しく配信されています。",
          buttonText: "更新する",
        },
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
        //link: "/docs/",
        items: [
          { text: "ブログ", link: "/blogs/" },
          { text: "技術系メモ", link: "/docs/" },
        ],
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
    authorAvatar: "/avatar.jpg",
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
      "/blogs/": getSidebar("./blogs", ".md", ".vue"),
    },
  }
};
