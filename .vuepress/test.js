const fs = require("fs");
const path = require("path");

//    require("./.vuepress/test").getSideBar("/docs/", "testTitle")

module.exports = {
  getSideBar: function(folder, title) {
    const extension = [".md", ".vue"];
    let searchPath = path.join(`${__dirname}/../${folder}/`);
    const files = this.useGetFiles2(searchPath, extension);
    console.log(...files);
  },
  getFiles: function(searchPath, extension) {
    return fs
      .readdirSync(searchPath)
      .filter(
        (item) =>
          fs.statSync(path.join(searchPath, item)).isFile() &&
          extension.includes(path.extname(item))
      );
  },
  getFiles2: walk = function(p, extension, fileCallback, errCallback) {
    fs.readdir(p, function(err, files) {
      if (err) {
        errCallback(err);
        return;
      }
      files.forEach(function(f) {
        var fp = path.join(p, f); // to full-path
        if (fs.statSync(fp).isDirectory()) {
          walk(fp, extension, fileCallback); // ディレクトリなら再帰
        } else {
          if (extension.includes(path.extname(fp))) {
            //console.log(p);
            //console.log(fp);
            fileCallback(fp); // ファイルならコールバックで通知
          }
        }
      });
    });
  },
  jsons: new Array(),
  useGetFiles2: function(folder, extension) {
    arr = new Array();
    this.getFiles2(folder, extension, ((path) => {arr.push(path);}),(err => {console.log(err)}));
    console.log(arr);
    return arr;
  }
};
