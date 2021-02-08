const fs = require("fs");
const path = require("path");

//    require("./test").getSideBar("/docs/", "testTitle")

module.exports = {
  getSideBar: function(folder, title) {
    const extension = [".md", ".vue"];
    let searchPath = path.join(`${__dirname}/../${folder}/`);
    const files = this.usegetFiles3(searchPath, extension);
    //console.log(...files);
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
  getFiles2: (walk = function(p, extension, fileCallback, errCallback) {
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
  }),
  //jsons: new Array(),
  useGetFiles2: function(folder, extension) {
    arr = new Array();
    this.getFiles2(
      folder,
      extension,
      (path) => {
        arr.push(path);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log(arr);
    return arr;
  },
  getFiles3: (searchPath, extension) => {
    return new Promise((resolve, reject) => {
      fileFullDirPaths = [];
      fileFullFilePaths = [];
      console.log(searchPath);
      fs.readdir(searchPath, function(err, files) {
        files.forEach((file) => {
          var fileFullPath = path.join(searchPath, file);
          if (fs.statSync(fileFullPath).isDirectory()) {
            fileFullDirPaths.push(fileFullPath);
          } else {
            if (extension.includes(path.extname(fileFullPath))) {
              fileFullFilePaths.push(fileFullPath);
            }
          }
        });
        //console.log(searchPath);
        //console.log(...fileFullDirPaths);
        //console.log(...fileFullFilePaths);
        //console.log(err);
        //console.log(files);
        if (err) {
          console.log("reject呼び出し：" + `${new Date()}`);
          reject(err);
        }
        console.log("resolve呼び出し：" + `${new Date()}`);
        resolve(fileFullDirPaths);
      });
    });
  },
  usegetFiles3: function(searchPath, extension) {
    this.getFiles3(searchPath, extension)
      .then((fileFullDirPaths) => {
        fileFullDirPaths.forEach((fileFullDirPath) => {
          return this.getFiles3(fileFullDirPath, extension);
        });
      })
      .catch(console.error("ディレクトリ読み込みエラー"));
  },
  getFiles4: function walkSync(dir, suffix) {
    let json = {};
    let results = [];
    json[dir] = results;
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      let stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        json[dir].push(walkSync(file, suffix));
        //results = results.concat(walkSync(file, suffix));
      } else {
        // NOTE: append files with specified suffix:
        if (!suffix || suffix.length <= 0 || _hasSuffix(file, suffix)) {
          json[dir].push(file);
          //results.push(file);
        }
      }
    });
    return json;
    //return results;

    function _hasSuffix(filename, list) {
      if (typeof list === "string") {
        return filename.endsWith(list);
      } else if (Array.isArray(list)) {
        for (let len = list.length, i = 0; i < len; i++) {
          const suffix = list[i];
          if (filename.endsWith(suffix)) {
            return true;
          }
        }
      }
      return false;
    }
  },
};
