<template>
<footer>
  <div class="author">
    Designed and coded by Aleksandr Askov &copy; 2017
  </div>
  <div>
    <a href="https://www.yelp.com" target="_blank">
      Businesses search is powered by Yelp
      <i class="fa fa-yelp" aria-hidden="true"></i>
    </a>
  </div>
  <div>
    <a
      href="https://github.com/askov"
      target="_blank"
      rel="author"
    >
      <i class="fa fa-github fa-2x social-button"></i>
    </a>
    <a
      href="https://www.freecodecamp.com/aleks-askov"
      target="_blanket"
      rel="author"
    >
      <i class="fa fa-free-code-camp fa-2x social-button"></i>
    </a>
    <a
      href="https://twitter.com/AleksandrAskov"
      target="_blanket"
      rel="author"
    >
      <i class="fa fa-twitter fa-2x social-button"></i>
    </a>
  </div>
</footer>
</template>

<script>
export default {
  name: 'appfooter'
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"
.author
  padding 20px
  padding-bottom 0

a
  display inline-block
  color white
  padding 10px

footer
  margin-top 2em
  background none
  background-color rgba(0, 0, 0, 0.4)
  color white
</style>
