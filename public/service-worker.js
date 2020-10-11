/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "9d5004ead8e1076f501ee6896a724e24"
  },
  {
    "url": "assets/css/0.styles.131285a9.css",
    "revision": "21a15d07a09dde028f824290876a8d67"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/js/1.7f5b841b.js",
    "revision": "2efb880e4d1596bb986fc6738f86557e"
  },
  {
    "url": "assets/js/10.36c8ddbd.js",
    "revision": "14a41f6c2b5eb88a1f689186556c62ce"
  },
  {
    "url": "assets/js/11.6e93033f.js",
    "revision": "34b94c3401c2e5a0b396a73f5ff64b86"
  },
  {
    "url": "assets/js/12.ac589c02.js",
    "revision": "183dc147804d1583dcad30d9b6983d97"
  },
  {
    "url": "assets/js/13.95fbf21f.js",
    "revision": "7221897c2c991debab2067ebaad54e9b"
  },
  {
    "url": "assets/js/14.062d9674.js",
    "revision": "813c538b378e487fc40223fe4f396da8"
  },
  {
    "url": "assets/js/15.9f9cd3cf.js",
    "revision": "d9d5d57c3852dbd2154abac3081450ea"
  },
  {
    "url": "assets/js/16.f27a9157.js",
    "revision": "3e2e3068ef8e52ec63b4565647ae7675"
  },
  {
    "url": "assets/js/17.ca2bb67d.js",
    "revision": "0289cf4ed957c09372ed7463ec753856"
  },
  {
    "url": "assets/js/18.aaceb709.js",
    "revision": "ce9ace7b135754ec21f3a822c469316e"
  },
  {
    "url": "assets/js/19.ba23f083.js",
    "revision": "e853973b6ecb26278bdb88f14896f70d"
  },
  {
    "url": "assets/js/20.aeb3eee8.js",
    "revision": "00f1ba65977182ec651abe821ae872a3"
  },
  {
    "url": "assets/js/21.6a623961.js",
    "revision": "8665ec599d46dda931cb20edd95c83f3"
  },
  {
    "url": "assets/js/22.ae131531.js",
    "revision": "400ad29db4afc554cad8ca0c2a2eb36d"
  },
  {
    "url": "assets/js/23.c430a99d.js",
    "revision": "899fc12099d60960feed047176202420"
  },
  {
    "url": "assets/js/24.e8df04b4.js",
    "revision": "1b661de664371b5edbfdc72bbfee2abd"
  },
  {
    "url": "assets/js/25.d5b520ee.js",
    "revision": "5e12cad94d2e9bd6dd1ed0b0a14b3b9a"
  },
  {
    "url": "assets/js/26.62a888a4.js",
    "revision": "0652020b15ed1b2fe3e38a4a34b0d5b4"
  },
  {
    "url": "assets/js/27.a6da452b.js",
    "revision": "c9df53bf290d5c51e7c94b98626c4b54"
  },
  {
    "url": "assets/js/28.86bf9f5f.js",
    "revision": "2674134a8dc9524091d3036502fd1b60"
  },
  {
    "url": "assets/js/29.c2a17dbe.js",
    "revision": "533242f661203de717129ca3f35f08fc"
  },
  {
    "url": "assets/js/3.7f021650.js",
    "revision": "ab07f455b2a27df9e08f0d7fe13fe813"
  },
  {
    "url": "assets/js/30.9bd31783.js",
    "revision": "02ba1c8ea0e409658ded895d64be6bb4"
  },
  {
    "url": "assets/js/31.d96ac494.js",
    "revision": "887f3caa4aa23437329420250c48148b"
  },
  {
    "url": "assets/js/4.120a59d5.js",
    "revision": "870f911021b4d8cf7eaf4d67b10e9c76"
  },
  {
    "url": "assets/js/5.6db7f820.js",
    "revision": "847df7a870ee9a05a6da6894b81166d0"
  },
  {
    "url": "assets/js/6.a94f9689.js",
    "revision": "e32e84686b1f25d38c3ae3bba0153acc"
  },
  {
    "url": "assets/js/7.da6265f5.js",
    "revision": "833d54c72374913a4eeb4617b3c2df6b"
  },
  {
    "url": "assets/js/8.21ac09e2.js",
    "revision": "c747e591051cca0459c8842b54952632"
  },
  {
    "url": "assets/js/9.3f4bdbf6.js",
    "revision": "fef14b6f7a8db2e5de18c714cef029a0"
  },
  {
    "url": "assets/js/app.85db5bf5.js",
    "revision": "d1855519641303e45b535a0425a8cccd"
  },
  {
    "url": "avatar.png",
    "revision": "df4467759eab42a8de547f7fe386f68d"
  },
  {
    "url": "blogs/category1/2018/121501.html",
    "revision": "676348bec51f72cc1d9fb009d0f37ef7"
  },
  {
    "url": "blogs/category1/2019/092101.html",
    "revision": "54a55378aa51de7cadc07e768a6d70d6"
  },
  {
    "url": "blogs/category2/2016/121501.html",
    "revision": "965d8f6682576f4239618b29febc5b18"
  },
  {
    "url": "blogs/category2/2017/092101.html",
    "revision": "9d9cae503cbf7ff1664efbee98d0d917"
  },
  {
    "url": "blogs/other/guide.html",
    "revision": "e4f05509f6c31aff9b822cf4cfa4138b"
  },
  {
    "url": "categories/category1/index.html",
    "revision": "662f5c095edf3de9a0dacbdec3e5b876"
  },
  {
    "url": "categories/category2/index.html",
    "revision": "29e416b53a69e6e20b44192eea7a9fca"
  },
  {
    "url": "categories/index.html",
    "revision": "24ba8df6c7ad7369608d7be49b10cf6f"
  },
  {
    "url": "categories/カテゴリ1/index.html",
    "revision": "ae76e63aa7bbe94f77afc31904b1a057"
  },
  {
    "url": "categories/カテゴリ2/index.html",
    "revision": "205895390f77faed27d858e1a571be28"
  },
  {
    "url": "docs/index.html",
    "revision": "2ea90ec3a47e00ab5c1dcd5b581ddec7"
  },
  {
    "url": "docs/infrastructure/git/index.html",
    "revision": "24babc8ddb6b318cdcc0b367837afb47"
  },
  {
    "url": "docs/infrastructure/git&github/index.html",
    "revision": "912f50ae4628b5ee8dc4741df88d28a2"
  },
  {
    "url": "docs/infrastructure/github/index.html",
    "revision": "175d29680445b4aae075fc96b7f5d7ae"
  },
  {
    "url": "docs/javascript/api.html",
    "revision": "4f2de81fd877367969e7a3129f86f477"
  },
  {
    "url": "docs/javascript/index.html",
    "revision": "6bf3167a3c9a794df09c6d3d9e88d4b8"
  },
  {
    "url": "docs/javascript/plugin.html",
    "revision": "42f9197ed3dccb824d9be81855cad0a9"
  },
  {
    "url": "docs/javascript/theme.html",
    "revision": "4d7134aa05c3cf9e3fe15ce811b1255f"
  },
  {
    "url": "docs/profile/index.html",
    "revision": "2ecf112789a09d6ac58ef8744859abb4"
  },
  {
    "url": "docs/vuejs/index.html",
    "revision": "132f575a26dcf15548c84a0c82d8bf4b"
  },
  {
    "url": "docs/vuejs/sidebarSetting.html",
    "revision": "5e452ae0d8f3348c67874b4f5f4cb150"
  },
  {
    "url": "docs/vuepress/markdown.html",
    "revision": "f44c53781190a94d2a962e41e064ca2f"
  },
  {
    "url": "docs/vuepress/vuepress.html",
    "revision": "b13639ff79170b83b754196198e2016e"
  },
  {
    "url": "hero.png",
    "revision": "5367b9349d4e048235eeed50d9ef36df"
  },
  {
    "url": "index.html",
    "revision": "735b1b06e80b3d8ae1d0a716c1063c13"
  },
  {
    "url": "items/reco_theme.html",
    "revision": "c5d308021d62a4e6e00fd77a55eba640"
  },
  {
    "url": "logo.png",
    "revision": "406370f8f120332c7a41611803a290b6"
  },
  {
    "url": "tag/index.html",
    "revision": "79ce41081feb19c62cee0d7d937db159"
  },
  {
    "url": "tag/tag1/index.html",
    "revision": "19e353e4cece36fc41850a8a91a562e5"
  },
  {
    "url": "tag/tag2/index.html",
    "revision": "77f8fd9f5881c9e51c23107abb30701c"
  },
  {
    "url": "tag/tag3/index.html",
    "revision": "f30f7c41a0ef216bcb6d84112a3d6d0a"
  },
  {
    "url": "tag/tag4/index.html",
    "revision": "66df4de6ae8e470e18741a6017219f3b"
  },
  {
    "url": "tag/タグ1/index.html",
    "revision": "ffe5a9de50135c6803e574ad0c230dd7"
  },
  {
    "url": "tag/タグ2/index.html",
    "revision": "8936f1aea266b58be03848e8c0a1105e"
  },
  {
    "url": "test.png",
    "revision": "c40f8f9b6448bb118792bdf84bdfe721"
  },
  {
    "url": "timeline/index.html",
    "revision": "84d4f4005ee9febccfc5bef0c7565af7"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
