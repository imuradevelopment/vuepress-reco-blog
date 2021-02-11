<template>
  <html>
    <head>
      <title>testvue</title>
    </head>
    <h2>-------- docs --------</h2>
    <section>
      <article v-for="doc in docs">
        <h3>{{doc.title}}</h3>
        <pre>{{JSON.stringify(doc.frontmatter, null, 2)}}</pre>
      </article>
    </section>
    <h2>-------- blogs --------</h2>
    <section>
      <article v-for="blog in blogs">
        <h3>{{blog.title}}</h3>
        <pre>{{JSON.stringify(blog.frontmatter, null, 2)}}</pre>
      </article>
    </section>
  </html>
</template>

<script>
module.exports = {
  computed: {
    docs() {
      return this.$site.pages.filter(d => d.path.startsWith('/docs/'))
    },
    blogs() {
      return this.$site.pages.filter(d => d.path.startsWith("/blogs/"))
    }
  },
}
</script>

<style module>

</style>
