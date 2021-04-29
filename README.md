---
home: true
bgImage: /images/jpg/6.jpg
heroText: VANILLA NOTE
tagline:
---

<style>
.hero {
  padding: 0 0 !important;
}
.overlay {
  align-items: center;
  justify-content: center;
  height:100%;
  width:100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 0 20px;
}
</style>

<script>
export default {
  props: ['slot-key'],
  data () {
    return {
      index : 7
    }
  },
  mounted () {
    function getRandomBgImage() {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }
      let index = getRandomInt(1, 7);
      return "url(/images/jpg/" + index + ".jpg)";
    };
    document.getElementsByClassName("hero")[0].style.backgroundImage = getRandomBgImage()
  }
}
</script>
