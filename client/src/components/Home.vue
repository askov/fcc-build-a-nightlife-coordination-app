<template>
<div>
  <div class="center-col welcome-block">
    <h1>
      <span>Color your night with</span><br>
      <span
        v-for="(el,index) in ['B', 'a', 'r', 'P', 'o', 'i', 'n', 't']"
        :key="el.id"
        v-show="cnt>index"
        :style="{'color': titleColors[index]}"
      >{{el}}</span>
    </h1>
  </div>
  <form
    v-show="cnt>8"
    class="location-bar"
  >
    <i
      class="fa fa-map-marker location-icon animated flash"
      aria-hidden="true"
    ></i>
    <input
      readonly
      type="text"
      v-model="location"
      placeholder="Enter your location"
      title="We found you here!"
    >
    <button
      type="button"
      title="Search bars around."
      @click="searchBarsInArea"
    >
      <i class="fa fa-search" aria-hidden="true"></i>
    </button>
  </form>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'home',
  data: function() {
    return {
      cnt: 0,
      location: '',
      lat: '',
      lon: '',
      /* eslint-disable no-undef */
      titleColors: [
        '#898cff', '#ff89b5', '#ffdc89',
        '#90d4f7', '#71e096', '#f5a26f',
        '#668de5', '#ed6d79', '#5ad0e5',
        '#da97e0', '#cff381', '#ff96e3'
      ]
    };
  },
  mounted: function() {
    this.interval = setInterval(this.incCounter, 120);
    this.getCurrentLocation();
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },
  methods: {
    incCounter() {
      this.cnt += 1;
    },
    getCurrentLocation() {
      axios.get('https://freegeoip.net/json/')
        .then(response => {
          this.location = `${response.data.city}, ${response.data.zip_code}`;
          this.location = 'New York, 10453';
          this.lat = response.data.latitude;
          this.lon = response.data.longitude;
          this.lat = '40.730610';
          this.lon = '-73.935242';
        })
        .catch(err => {
          return alert('Sorry, we can not find you: ' + err);
        });
    },
    searchBarsInArea() {
      localStorage.setItem('lastSearch',
        JSON.stringify({
          lat: this.lat,
          lon: this.lon
        })
      );
      this.$router.push('/bars');
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"
h1
  span
    font-size 65px
    font-weight normal
    font-family 'Fredericka the Great', cursive

.center-col
  width 90%
  max-width 700px
  margin 1em auto

.welcome-block
  margin-top 3em 0

.location-bar
  display flex
  width 90%
  max-width 500px
  margin 5em auto
  input[type="text"]
    display block
    font-size 24px
    letter-spacing 1px
    text-align center
    width 100%
    border none
    background-color $light-text-color
    height 40px
    line-height 40px
  button
    background-color #b23117
    color white
    width 70px

.location-icon, button
  font-size 24px
  height 40px
  line-height 40px
  width 50px

@media screen and (max-width: 500px)
  .location-bar
    display block
    button
      margin-top 0.5em
      width 100%
</style>
