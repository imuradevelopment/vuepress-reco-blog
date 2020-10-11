<template>
  <div class="home-blog">
    <!-- <div class="hero" :style="{ ...bgImageStyle }"> -->
    <div class="hero">
      <canvas id="lines"></canvas>
      <h1>
        vanill<span class="End">a</span><br>
        Not<span class="End">e</span>
      </h1>
      <!-- <h1>vanilla Not<span class="End">e</span></h1> -->
      <!-- <div>
        <ModuleTransition>
          <img
            class="hero-img"
            v-if="recoShowModule && $frontmatter.heroImage"
            :style="heroImageStyle || {}"
            :src="$withBase($frontmatter.heroImage)"
            alt="hero"
          />
        </ModuleTransition>

        <ModuleTransition delay="0.04"> -->
          <!-- <h1 v-if="recoShowModule && $frontmatter.heroText !== null">
            {{ $frontmatter.heroText || $title || 'vuePress-theme-reco' }}
          </h1> -->
          <!-- <h1 v-if="recoShowModule && $frontmatter.heroText !== null" v-for="subItem in $frontmatter.heroText">{{ subItem || $title || 'vuePress-theme-reco' }}</h1>
        </ModuleTransition>

        <ModuleTransition delay="0.08">
          <p v-if="recoShowModule && $frontmatter.tagline !== null" class="description">
            {{ $frontmatter.tagline || $description || 'Welcome to your vuePress-theme-reco site' }}
          </p>
        </ModuleTransition>
      </div> -->
    </div>

    <ModuleTransition delay="0.16">
      <div v-show="recoShowModule" class="home-blog-wrapper">
        <div class="blog-list">
          <!-- 博客列表 -->
          <note-abstract
            :data="$recoPosts"
            :currentPage="currentPage"></note-abstract>
          <!-- 分页 -->
          <pagation
            class="pagation"
            :total="$recoPosts.length"
            :currentPage="currentPage"
            @getCurrentPage="getCurrentPage" />
        </div>
        <div class="info-wrapper">
          <PersonalInfo/>
          <h4><i class="iconfont reco-category"></i> {{homeBlogCfg.category}}</h4>
          <ul class="category-wrapper">
            <li class="category-item" v-for="(item, index) in this.$categories.list" :key="index">
              <router-link :to="item.path">
                <span class="category-name">{{ item.name }}</span>
                <span class="post-num" :style="{ 'backgroundColor': getOneColor() }">{{ item.pages.length }}</span>
              </router-link>
            </li>
          </ul>
          <hr>
          <h4 v-if="$tags.list.length !== 0"><i class="iconfont reco-tag"></i> {{homeBlogCfg.tag}}</h4>
          <TagList @getCurrentTag="getPagesByTags" />
          <h4 v-if="$themeConfig.friendLink && $themeConfig.friendLink.length !== 0"><i class="iconfont reco-friend"></i> {{homeBlogCfg.friendLink}}</h4>
          <FriendLink />
        </div>
      </div>
    </ModuleTransition>

    <ModuleTransition delay="0.24">
      <Content v-show="recoShowModule" class="home-center" custom/>
    </ModuleTransition>
  </div>
</template>

<script>
import TagList from '@theme/components/TagList'
import FriendLink from '@theme/components/FriendLink'
import NoteAbstract from '@theme/components/NoteAbstract'
import pagination from '@theme/mixins/pagination'
import ModuleTransition from '@theme/components/ModuleTransition'
import PersonalInfo from '@theme/components/PersonalInfo'
import { getOneColor } from '@theme/helpers/other'
import moduleTransitonMixin from '@theme/mixins/moduleTransiton'

export default {
  mixins: [pagination, moduleTransitonMixin],
  components: { NoteAbstract, TagList, FriendLink, ModuleTransition, PersonalInfo },
  data () {
    return {
      recoShow: false,
      currentPage: 1,
      tags: []
    }
  },
  computed: {
    homeBlogCfg () {
      return this.$recoLocales.homeBlog
    },
    actionLink () {
      const {
        actionLink: link,
        actionText: text
      } = this.$frontmatter

      return {
        link,
        text
      }
    },
    heroImageStyle () {
      return this.$frontmatter.heroImageStyle || {}
    },
    bgImageStyle () {
      const initBgImageStyle = {
        textAlign: 'center',
        overflow: 'hidden',
        background: `
          url(${this.$frontmatter.bgImage
    ? this.$withBase(this.$frontmatter.bgImage)
    : require('../images/bg.svg')}) center/cover no-repeat
        `
      }
      const {
        bgImageStyle
      } = this.$frontmatter

      return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle
    },
    heroHeight () {
      return document.querySelector('.hero').clientHeight
    }
  },
  mounted () {
    this.recoShow = true
    this._setPage(this._getStoragePage())
    // this.bgSvg()
    this.bgSvg2()
  },
  methods: {
    random (ary) {
        const rnd = Math.floor(Math.random() * ary.length);
        return ary[rnd];
    },
    // 获取当前页码
    getCurrentPage (page) {
      this._setPage(page)
      setTimeout(() => {
        window.scrollTo(0, this.heroHeight)
      }, 100)
    },
    // 根据分类获取页面数据
    getPages () {
      let pages = this.$site.pages
      pages = pages.filter(item => {
        const { home, date } = item.frontmatter
        return !(home == true || date === undefined)
      })
      // reverse()是为了按时间最近排序排序
      this.pages = pages.length == 0 ? [] : pages
    },
    getPagesByTags (tagInfo) {
      this.$router.push({ path: tagInfo.path })
    },
    _setPage (page) {
      this.currentPage = page
      this.$page.currentPage = page
      this._setStoragePage(page)
    },
    getOneColor,
    bgSvg () {
      (function () {
          const canvas = document.getElementById("lines");
          const ctx = canvas.getContext("2d");
          let width;
          let height;
          class Line {
            constructor(origin, size, length, color, style = "pattern") {
              this.size = size;
              this.origin = origin;
              this.length = length;
              this.color = color;
              this.style = style;
              this.origin = `M${origin.x},${origin.y}`;
              this.offSet = 0;
              this.line = null;
              this.offSetSpeed = length / size;
            }
            getColorString() {
              return `hsla(${this.color.h}deg,${this.color.s}%,${this.color.l}%,${this.color.a})`;
            }
            generators() {
              return [
                {
                  line: `h${this.size}`,
                  mag: this.size
                },
                {
                  line: `h-${this.size}`,
                  mag: this.size
                },
                {
                  line: `v${this.size}`,
                  mag: this.size
                },
                {
                  line: `v-${this.size}`,
                  mag: this.size
                },
                {
                  line: `l${this.size},${this.size}`,
                  mag: Math.hypot(this.size, this.size)
                },
                {
                  line: `l${this.size}-${this.size}`,
                  mag: Math.hypot(this.size, this.size)
                },
                {
                  line: `l-${this.size},${this.size}`,
                  mag: Math.hypot(this.size, this.size)
                },
                {
                  line: `l-${this.size}-${this.size}`,
                  mag: Math.hypot(this.size, this.size)
                }
              ];
            }
            generate() {
              let segments = this.generators(this.size);
              let path = this.origin;
              let mag = 0;
              let fragment;
              let i;
              for (i = 0; i < this.length; i += 1) {
                fragment = segments[(Math.random() * segments.length) | 0];
                path += ` ${fragment.line}`;
                mag += fragment.mag;
              }
              this.line = {
                path,
                mag
              };
              return this;
            }
            renderStyle(style) {
              if (style === "glitches") {
                ctx.lineDashOffset = this.line.mag + this.offSet;
                ctx.setLineDash([
                  this.size ** 1.5,
                  (this.line.mag / this.length) * this.size ** 2
                ]);
                this.offSet += 20;
                // this.size / (this.size ** 2);
                ctx.lineWidth = 2;
                return this;
              }
              if (style === "pattern") {
                ctx.lineDashOffset = this.line.mag - this.offSet;
                ctx.setLineDash([this.line.mag, this.line.mag]);
                this.offSet += 10;
                //this.size / (this.size ** 100);
                ctx.lineWidth = 0.2;
              }
            }
            mutatePath() {
              let lineFragment = this.line.path.split(" ").slice(1);
              let generator = this.generators();
              lineFragment[(Math.random() * lineFragment.length) | 0] =
                generator[(Math.random() * generator.length) | 0].line;
              this.line.path = `${this.line.path.split(" ")[0]} ${lineFragment.join(
                " "
              )}`;
            }
            draw() {
              !this.line && this.generate();

              ctx.strokeStyle = this.getColorString();
              this.renderStyle(this.style);
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.stroke(new Path2D(this.line.path));
              return this;
            }
          }
          function clear() {
            // ctx.fillStyle = `hsla(200deg, 20%, 10%, 0.3)`;
            ctx.fillStyle = `hsla(0deg, 0%, 9.41%, 0.3)`;
            ctx.fillRect(0, 0, width, height);
          }
          function generateLines(amount) {
            let lines = [];
            let styles = [
              // { size: 1.25, style: "pattern", color: { h: 210, s: 100, l: 70, a: 0.5 } },
              // { size: 2.5, style: "pattern", color: { h: 190, s: 90, l: 50, a: 0.3 } },
              // { size: 5, style: "pattern", color: { h: 210, s: 70, l: 60, a: 0.2 } },
              // { size: 10, style: "pattern", color: { h: 310, s: 80, l: 55, a: 0.15 } },
              // { size: 20, style: "pattern", color: { h: 200, s: 25, l: 35, a: 0.12 } },
              // { size: 20, style: "pattern", color: { h: 210, s: 20, l: 40, a: 0.12 } },
              // { size: 40, style: "pattern", color: { h: 190, s: 40, l: 50, a: 0.12 } },
              // { size: 80, style: "pattern", color: { h: 220, s: 50, l: 60, a: 0.12 } },
              // { size: 40, style: "glitches", color: { h: 300, s: 100, l: 50, a: 0.3 } },
              // { size: 20, style: "glitches", color: { h: 210, s: 100, l: 50, a: 0.3 } },
              // { size: 60, style: "glitches", color: { h: 30, s: 100, l: 50, a: 0.3 } }
              
              { size: 1.25, style: "pattern", color: { h: 120, s: 100, l: 70, a: 0.5 } },
              { size: 2.5, style: "pattern", color: { h: 150, s: 100, l: 50, a: 0.3 } },
              { size: 5, style: "pattern", color: { h: 90, s: 100, l: 50, a: 0.5 } },
              { size: 10, style: "pattern", color: { h: 160, s: 100, l: 50, a: 1 } },
              { size: 20, style: "pattern", color: { h: 90, s: 100, l: 50, a: 0.5 } },
              // { size: 20, style: "pattern", color: { h: 210, s: 70, l: 60, a: 0.2 } },
              // { size: 40, style: "pattern", color: { h: 310, s: 80, l: 55, a: 0.15 } },
              // { size: 80, style: "pattern", color: { h: 200, s: 25, l: 35, a: 0.12 } },
              // { size: 20, style: "pattern", color: { h: 210, s: 20, l: 40, a: 0.12 } },
              // { size: 40, style: "pattern", color: { h: 190, s: 40, l: 50, a: 0.12 } },
              // { size: 80, style: "pattern", color: { h: 220, s: 50, l: 60, a: 0.12 } },
              // { size: 40, style: "glitches", color: { h: 300, s: 100, l: 50, a: 0.3 } },
              // { size: 20, style: "glitches", color: { h: 210, s: 100, l: 50, a: 0.3 } },
              // { size: 30, style: "glitches", color: { h: 30, s: 100, l: 50, a: 0.3 } }
            ];
            for (let i = 0; i < amount; i += 1) {
              let style = styles[(Math.random() ** 2 * styles.length) | 0];
              lines.push(
                new Line(
                  { x: width * 0.5, y: height * 0.5 },
                  style.size,
                  500 + Math.random() * 1000,
                  style.color,
                  style.style
                )
              );
            }
            return lines;
          }
          let id;
          function resize() {
            id = cancelAnimationFrame(id);
            width = window.innerWidth;
            height = window.innerHeight;
            if (width <= 719){
              canvas.height = 450;
            } else if (width <= 419){
              canvas.height = 450;
            }else{
              canvas.height = height;
            }
            canvas.width = width;
            //canvas.height = height;
            const lines = generateLines(40);
            function update() {
              if (!(id % 3)) {
                clear();
                lines.forEach((line) => {
                  line.draw();
                  if (!(id % 5) && Math.random() > 0.95) {
                    line.mutatePath();
                  }
                });
              }
              id = requestAnimationFrame(update);
            }
            id = requestAnimationFrame(update);
          }
          window.addEventListener("resize", resize, {
            passive: true
          });
          resize();
        })();
    },
    bgSvg2 () {
(window.onload = function() {
  (function () {
    const canvas = document.getElementById("lines");
    const ctx = canvas.getContext("2d");
    let width;
    let height;
    class Line {
      constructor(origin, size, length, color, style = "pattern") {
        this.size = size;
        this.origin = origin;
        this.length = length;
        this.color = color;
        this.style = style;
        this.origin = `M${origin.x},${origin.y}`;
        this.offSet = 0;
        this.line = null;
        this.offSetSpeed = length / size;
      }
      getColorString() {
        return `hsla(${this.color.h}deg,${this.color.s}%,${this.color.l}%,${this.color.a})`;
      }
      generators() {
        return [
          {
            line: `h${this.size}`,
            mag: this.size
          },
          {
            line: `h-${this.size}`,
            mag: this.size
          },
          {
            line: `v${this.size}`,
            mag: this.size
          },
          {
            line: `v-${this.size}`,
            mag: this.size
          },
          {
            line: `l${this.size},${this.size}`,
            mag: Math.hypot(this.size, this.size)
          },
          {
            line: `l${this.size}-${this.size}`,
            mag: Math.hypot(this.size, this.size)
          },
          {
            line: `l-${this.size},${this.size}`,
            mag: Math.hypot(this.size, this.size)
          },
          {
            line: `l-${this.size}-${this.size}`,
            mag: Math.hypot(this.size, this.size)
          }
        ];
      }
      generate() {
        let segments = this.generators(this.size);
        let path = this.origin;
        let mag = 0;
        let fragment;
        let i;
        for (i = 0; i < this.length; i += 1) {
          fragment = segments[(Math.random() * segments.length) | 0];
          path += ` ${fragment.line}`;
          mag += fragment.mag;
        }
        this.line = {
          path,
          mag
        };
        return this;
      }
      renderStyle(style) {
        if (style === "glitches") {
          ctx.lineDashOffset = this.line.mag + this.offSet;
          ctx.setLineDash([
            this.size ** 1.5,
            (this.line.mag / this.length) * this.size ** 2
          ]);
          this.offSet += 20;
          // this.size / (this.size ** 2);
          ctx.lineWidth = 2;
          return this;
        }
        if (style === "pattern") {
          ctx.lineDashOffset = this.line.mag - this.offSet;
          ctx.setLineDash([this.line.mag, this.line.mag]);
          this.offSet += 10;
          //this.size / (this.size ** 100);
          ctx.lineWidth = 0.2;
        }
      }
      mutatePath() {
        let lineFragment = this.line.path.split(" ").slice(1);
        let generator = this.generators();
        lineFragment[(Math.random() * lineFragment.length) | 0] =
          generator[(Math.random() * generator.length) | 0].line;
        this.line.path = `${this.line.path.split(" ")[0]} ${lineFragment.join(
          " "
        )}`;
      }
      draw() {
        !this.line && this.generate();

        ctx.strokeStyle = this.getColorString();
        this.renderStyle(this.style);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke(new Path2D(this.line.path));
        return this;
      }
    }
    function clear() {
      // ctx.fillStyle = `hsla(200deg, 20%, 10%, 0.3)`;
      ctx.fillStyle = `hsla(0deg, 0%, 9.41%, 0.3)`;
      ctx.fillRect(0, 0, width, height);
    }
    function generateLines(amount) {
      let lines = [];
      let styles = [
        // { size: 1.25, style: "pattern", color: { h: 210, s: 100, l: 70, a: 0.5 } },
        // { size: 2.5, style: "pattern", color: { h: 190, s: 90, l: 50, a: 0.3 } },
        // { size: 5, style: "pattern", color: { h: 210, s: 70, l: 60, a: 0.2 } },
        // { size: 10, style: "pattern", color: { h: 310, s: 80, l: 55, a: 0.15 } },
        // { size: 20, style: "pattern", color: { h: 200, s: 25, l: 35, a: 0.12 } },
        // { size: 20, style: "pattern", color: { h: 210, s: 20, l: 40, a: 0.12 } },
        // { size: 40, style: "pattern", color: { h: 190, s: 40, l: 50, a: 0.12 } },
        // { size: 80, style: "pattern", color: { h: 220, s: 50, l: 60, a: 0.12 } },
        // { size: 40, style: "glitches", color: { h: 300, s: 100, l: 50, a: 0.3 } },
        // { size: 20, style: "glitches", color: { h: 210, s: 100, l: 50, a: 0.3 } },
        // { size: 60, style: "glitches", color: { h: 30, s: 100, l: 50, a: 0.3 } }
        
        { size: 1.25, style: "pattern", color: { h: 120, s: 100, l: 70, a: 0.5 } },
        { size: 2.5, style: "pattern", color: { h: 150, s: 100, l: 50, a: 0.3 } },
        { size: 5, style: "pattern", color: { h: 90, s: 100, l: 50, a: 0.5 } },
        { size: 10, style: "pattern", color: { h: 160, s: 100, l: 50, a: 1 } },
        { size: 20, style: "pattern", color: { h: 90, s: 100, l: 50, a: 0.5 } },
        // { size: 20, style: "pattern", color: { h: 210, s: 70, l: 60, a: 0.2 } },
        // { size: 40, style: "pattern", color: { h: 310, s: 80, l: 55, a: 0.15 } },
        // { size: 80, style: "pattern", color: { h: 200, s: 25, l: 35, a: 0.12 } },
        // { size: 20, style: "pattern", color: { h: 210, s: 20, l: 40, a: 0.12 } },
        // { size: 40, style: "pattern", color: { h: 190, s: 40, l: 50, a: 0.12 } },
        // { size: 80, style: "pattern", color: { h: 220, s: 50, l: 60, a: 0.12 } },
        // { size: 40, style: "glitches", color: { h: 300, s: 100, l: 50, a: 0.3 } },
        // { size: 20, style: "glitches", color: { h: 210, s: 100, l: 50, a: 0.3 } },
        // { size: 30, style: "glitches", color: { h: 30, s: 100, l: 50, a: 0.3 } }
      ];
      for (let i = 0; i < amount; i += 1) {
        let style = styles[(Math.random() ** 2 * styles.length) | 0];
        lines.push(
          new Line(
            { x: width * 0.5, y: height * 0.5 },
            style.size,
            500 + Math.random() * 1000,
            style.color,
            style.style
          )
        );
      }
      return lines;
    }
    let id;
    function resize() {
      id = cancelAnimationFrame(id);
      width = window.innerWidth;
      height = window.innerHeight;
      if (width <= 719){
        canvas.height = 450;
      } else if (width <= 419){
        canvas.height = 450;
      }else{
        canvas.height = height;
      }
      canvas.width = width;
      //canvas.height = height;
      const lines = generateLines(40);
      function update() {
        if (!(id % 3)) {
          clear();
          lines.forEach((line) => {
            line.draw();
            if (!(id % 5) && Math.random() > 0.95) {
              line.mutatePath();
            }
          });
        }
        id = requestAnimationFrame(update);
      }
      id = requestAnimationFrame(update);
    }
    window.addEventListener("resize", resize, {
      passive: true
    });
    resize();
  })();
})();
    }
  }
}
</script>

<style lang="stylus">
.home-blog {
  padding: 0;
  margin: 0px auto;
  .hero {
    margin $navbarHeight auto 0
    position relative
    box-sizing border-box
    padding 0 20px
    height 100vh
    display flex
    align-items center
    justify-content center
    .hero-img {
      max-width: 300px;
      margin: 0 auto 1.5rem
    }

    h1 {
      display: block;
      margin:0 auto 1.8rem;
      font-size: 2.5rem;
    }

    .description {
      margin: 1.8rem auto;
      font-size: 1.6rem;
      line-height: 1.3;
    }
  }
  .home-blog-wrapper {
    display flex
    align-items: flex-start;
    margin 20px auto 0
    padding 0 20px
    max-width $homePageWidth
    .blog-list {
      flex auto
      width 0
      .abstract-wrapper {
        .abstract-item:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .info-wrapper {
      position -webkit-sticky;
      position sticky;
      top 70px
      overflow hidden
      transition all .3s
      margin-left 15px
      flex 0 0 300px
      height auto
      box-shadow var(--box-shadow)
      border-radius $borderRadius
      box-sizing border-box
      padding 0 15px
      background var(--background-color)
      &:hover {
        box-shadow var(--box-shadow-hover)
      }
      h4 {
        color var(--text-color)
      }
      .category-wrapper {
        list-style none
        padding-left 0
        .category-item {
          margin-bottom .4rem
          padding: .4rem .8rem;
          transition: all .5s
          border-radius $borderRadius
          box-shadow var(--box-shadow)
          background-color var(--background-color)
          &:hover {
            transform scale(1.04)
            a {
              color $accentColor
            }
          }
          a {
            display flex
            justify-content: space-between
            color var(--text-color)
            .post-num {
              width 1.6rem;
              height 1.6rem
              text-align center
              line-height 1.6rem
              border-radius $borderRadius
              background #eee
              font-size 13px
              color #fff
            }
          }
        }
      }
    }
  }
}

@media (max-width: $MQMobile) {
  .home-blog {
    .hero {
      height 450px
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        margin: 0 auto 1.8rem ;
        font-size: 2rem;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }
    .home-blog-wrapper {
      display block!important
      .blog-list {
        width auto
      }
      .info-wrapper {
        // display none!important
        margin-left 0
        .personal-info-wrapper {
          display none
        }
      }
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home-blog {
    .hero {
      height 450px
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        margin: 0 auto 1.8rem ;
        font-size: 2rem;
      }

      h1, .description, .action {
        // margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .home-blog-wrapper {
      display block!important
      .blog-list {
        width auto
      }
      .info-wrapper {
        // display none!important
        margin-left 0
        .personal-info-wrapper {
          display none
        }
      }
    }
  }
}
</style>
