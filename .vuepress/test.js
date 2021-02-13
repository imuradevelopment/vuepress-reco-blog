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

// ---
// home: true
// bgImage: /images/freeImage/65.jpg
// heroText: TEST
// tagline: test
// ---
