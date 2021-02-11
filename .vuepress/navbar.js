//.vuepress/config.js
const fs = require("fs");
const path = require("path");

function getNavItem(parentDir, ...extens) {
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
        return startNodeDir.substring(1) + "/";
      } else {
        return startNodeDir.substring(1) + "/" + childFile;
      }
    } else {
      if (childFile.toLowerCase() == "readme.md") {
        return parentDir.substring(1) + "/";
      } else {
        return parentDir.substring(1) + "/" + childFile;
      }
    }
  };
  let getNavItemRecurce = function(
    parentDir,
    extens,
    callBackgetNavItemRecurce
  ) {
    let navItemRecurce = [];
    let childDirsArray = getInDirsArray(parentDir);
    let childFilesArray = getInFilesArray(parentDir, extens);
    let replacedChildFilesArray = childFilesArray.map((childFile) => {
      return replaceParentDir(parentDir, childFile);
    });
    // ファイルの配列結合
    if (parentDir == startNodeDir){
      navItemRecurce = navItemRecurce.concat(
          [{
            text: startNodeDir.substring(2,startNodeDir.length-1),
            items: replacedChildFilesArray
          }]
        );
    }else{
      navItemRecurce = navItemRecurce.concat(replacedChildFilesArray);
    }

    let replacedChildDirsArray = childDirsArray.map((childDir) => {
      let unitnavItem = {
        text: childDir,
        items: callBackgetNavItemRecurce(
          parentDir + "/" + childDir,
          extens,
          callBackgetNavItemRecurce
        ),
      };
      return unitnavItem;
    });
    replacedChildDirsArray = replacedChildDirsArray.filter(
      (unitnavItem) => unitnavItem.items.length != 0
    );
    navItemRecurce = navItemRecurce.concat(replacedChildDirsArray);
    return navItemRecurce;
  };
  let navItem = getNavItemRecurce(parentDir, extens, getNavItemRecurce);
  console.log(...extens);
  console.dir(navItem);
  return navItem;
}

console.dir(getNavItem("./docs", ".md", ".vue"));

console.log("test");

[
  {
    text: "folderName1",
    items: [
      {
        text: "folderName2",
        items: [
          /*  */
        ],
      },
    ],
  },
  {
    text: "folderName3",
    items: [
      /*  */
    ],
  },
];
[
  "/docs/",
  "/docs/template.md",
  { text: "django", items: ["/docs/django/drf.md"] },
  {
    text: "infrastructure",
    items: [
      "/docs/infrastructure/",
      "/docs/infrastructure/template.md",
      [Object],
      [Object],
    ],
  },
  { text: "javascript", items: ["/docs/javascript/"] },
  { text: "profile", items: ["/docs/profile/"] },
  {
    text: "test",
    items: ["/docs/test/", "/docs/test/template.md", [Object], [Object]],
  },
  { text: "typescript", items: ["/docs/typescript/"] },
  { text: "vuejs", items: ["/docs/vuejs/", "/docs/vuejs/sidebarSetting.md"] },
  {
    text: "vuepress",
    items: ["/docs/vuepress/markdown.md", "/docs/vuepress/vuepress.md"],
  },
];
