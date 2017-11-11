<template>
<div class="rating-wrapper" :title="'Rating: ' + business.rating">
  <div class="star-layers">
    <span
        v-for="el in [1,2,3,4,5]"
        :key="el.id"
        class="star-cell"
    >
      <i
        class="fa fa-star"
        aria-hidden="true"
        :class="{'filled-star': el - +business.rating <= 0}"
      >
      </i>
      <i
        v-if="el - +business.rating == 0.5"
        class="fa fa-star-half filled-star"
        aria-hidden="true"
      >
      </i>
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: 'ratingbar',
  props: ['business']
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"
.rating-wrapper, .participants-counter
  text-align center
  position absolute
  right 5px
  padding 2px 0

.star-layers
  position relative

.star-cell
  color #c9c9c9
  position relative
  display inline-block
  width 20px
  height 20px
  i
    position absolute
    top 5px
    left 0

.filled-star
  color #e2f442

@media screen and (max-width: 800px)
  .rating-wrapper, .participants-counter
    background-color black
    height 25px
    opacity 0.8
    width 150px

  .rating-wrapper
    position absolute
    left 0

  .participants-counter
    top 121px
    left 0
    text-align center
</style>
