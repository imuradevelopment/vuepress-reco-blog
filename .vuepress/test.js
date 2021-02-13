//.vuepress/config.js
const fs = require("fs");

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
