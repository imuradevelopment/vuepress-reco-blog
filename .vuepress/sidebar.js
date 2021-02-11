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

console.dir(getSidebar("./docs", ".md", ".vue"));
console.log("test");
