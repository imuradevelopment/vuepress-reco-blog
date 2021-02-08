//require("./test").getSideBar("/docs/", "testTitle");
let testjs = require("./test");
let fsList = testjs.getFiles4("./docs/infrastructure", "md", "vue");
console.log(JSON.stringify(fsList));
let test2 = {
  title: "infrastructure",
  collapsable: true,
  sidebarDepth: 1,
  children: [
    "/docs/infrastructure/",
    "/docs/infrastructure/template.md",
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
      children: ["infrastructure/github/", "infrastructure/github/github"],
    },
  ],
};
let test = {
  "./docs/infrastructure": [
    "\\docs\\infrastructure\\README.md",
    "\\docs\\infrastructure\\template.md",
    {
      "\\docs\\infrastructure\\git": [
        "\\docs\\infrastructure\\git\\git.md",
        "\\docs\\infrastructure\\git\\README.md",
        { "\\docs\\infrastructure\\git\\test": [] },
      ],
    },
    {
      "\\docs\\infrastructure\\github": [
        "\\docs\\infrastructure\\github\\github.md",
        "\\docs\\infrastructure\\github\\README.md",
      ],
    },
  ],
};
