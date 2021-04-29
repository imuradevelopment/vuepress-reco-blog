<template>
  <p class="demo" :class="$style.example"></p>
</template>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ["slot-key"],
  data () {
    return {
      index : 7
    }
  },
  mounted() {
    console.log(this.$data.index);
    document.querySelector(`.${this.$style.example}`).textContent = $root
  },
};
</script>
