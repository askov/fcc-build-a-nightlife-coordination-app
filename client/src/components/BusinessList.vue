<template>
<div class="center-col">
  <h2><i class="fa fa-beer" aria-hidden="true"></i> Bars in my area</h2>
  <Loader :isPending="isPending" />
  <button
    v-if="isLoggedIn && !isPending"
    @click="cancelAllMeetings()"
    class="cancel-all"
    tabindex="-1"
    title="Cancel all my meetings!"
  >
    Cancel all my meetings
  </button>
  <ul>
    <li
      v-for="(business, index) in barsInArea"
      :key="business.id"
      class="business-item animated fadeIn"
    >
      <div>
        <div
          class="li-header"
          v-if="isLoggedIn"
        >
          <div
            v-if="placesToVisit.indexOf(business.id) !== -1"
          >
            You are going to visit {{business.name}} tonight
            <button
              @click="cancelVenue(business.id)"
              class="decline-button"
              tabindex="-1"
              title="I won't go!"
            >
              Won't go
            </button>
          </div>
          <button
            v-else
            @click="addVenue(business.id)"
            class="participate-button"
            tabindex="-1"
            title="I will go!"
          >
            I will go
          </button>
        </div>
        <div
          class="li-body-container"
        >
          <div class="left-col">
            <a
              :href="business.url" target="_blank"
              :title="business.name + ' on Yelp!'"
            >
              <img :src="business.image_url" :alt="business.id">
            </a>
          </div>

          <div class="right-col">
            <div class="business-name">
              <h1>{{business.name}}</h1>
            </div>
            <div class="address-block">
              <p
                v-for="(el, index) in business.location['display_address'].filter(el => el)"
                :key="el.id"
              >
                {{el}}
              </p>
            </div>
          </div>
          <RatingBar :business="business" />
          <div class="participants-counter" title="Participants">
            <i class="fa fa-users" aria-hidden="true"></i>
            <span>{{visitors[business.id] || 0}}</span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
import axios from 'axios';
import Loader from './Loader';
import RatingBar from './RatingBar';

export default {
  name: 'businesslist',
  components: {
    Loader,
    RatingBar
  },
  data: function() {
    return {
      isPending: false,
      barsInArea: [],
      placesToVisit: [],
      visitors: {}
    };
  },
  mounted: function() {
    const coords = JSON.parse(localStorage.getItem('lastSearch'));
    this.isPending = true;
    axios({
      method: 'get',
      headers: {
        Authorization: this.token
      },
      /* eslint-disable no-undef */
      url: API_URL + `nearest-venues?lat=${coords.lat}&lon=${coords.lon}`
    })
      .then(response => {
        this.isPending = false;
        this.placesToVisit = response.data['my_venues'] || [];
        this.barsInArea = response.data.businesses;
        this.visitors = response.data.visitors;
      })
      .catch(err => {
        this.isPending = false;
        return alert('Error getting nearest bars. Try again later. ' + err);
      });
  },
  methods: {
    addVenue(business) {
      // console.log(business);
      axios({
        method: 'post',
        headers: {
          Authorization: this.token
        },
        data: {
          business_id: business
        },
        /* eslint-disable no-undef */
        url: API_URL + 'add-venue'
      })
        .then(response => {
          this.placesToVisit = response.data;
          const visitorCounter = this.visitors[business] ? this.visitors[business] + 1 : 1;
          this.visitors = Object.assign({}, this.visitors, {[business]: visitorCounter});
        })
        .catch(err => {
          return alert('Sorry, ' + err);
        });
    },
    cancelVenue(business) {
      axios({
        method: 'post',
        headers: {
          Authorization: this.token
        },
        data: {
          business_id: business
        },
        /* eslint-disable no-undef */
        url: API_URL + 'cancel-venue'
      })
        .then(response => {
          this.placesToVisit = response.data;
          const visitorCounter = this.visitors[business] - 1;
          this.visitors = Object.assign({}, this.visitors, {[business]: visitorCounter});
        })
        .catch(err => {
          return alert('Sorry, ' + err);
        });
    },
    cancelAllMeetings() {
      console.log('cancel');
      axios({
        method: 'post',
        headers: {
          Authorization: this.token
        },
        /* eslint-disable no-undef */
        url: API_URL + 'cancel-all'
      })
        .then(response => {
          const visitors = this.placesToVisit.map(el => {
            return {[el]: this.visitors[el] - 1};
          });
          this.visitors = Object.assign({}, this.visitors, ...visitors);
          this.placesToVisit = [];
        })
        .catch(err => {
          return alert('Sorry, ' + err);
        });
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    token() {
      return this.$store.getters.token;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/theme';

h2
  margin-bottom 1em

img
  width 150px
  height 150px
  object-fit cover

ul
  list-style none

li
  text-align left

a
  color $light-text-color

.cancel-all
  margin-bottom 1em
  border 1px solid #bc3636
  background-color rgba(100, 0, 0, 0.3)
  border-radius 6px
  width 100%
  color white

.participate-button, .decline-button
  color white
  height 30px
  width 100px
  border 1px solid #42f480
  border-radius 6px
  background-color rgba(0, 0, 0, 0.3)
  margin 5px 0

.decline-button
  border-color orange
  margin-left 5px

.li-header
  text-align right
  width 100%

.li-body-container
  background-color rgba(0, 0, 0, 0.3)
  position relative
  display flex

.center-col
  width 90%
  max-width 800px
  margin 1em auto

.left-col
  flex 0 0 150px
  width 150px
  height 150px

.right-col
  padding-left 10px
  padding-top 5px

.business-item
  color $light-text-color
  margin-bottom 1em

.participants-counter
  text-align center
  position absolute
  right 5px
  padding 2px 0
  bottom 0
  height 24px

@media screen and (max-width: 800px)
  .participants-counter
    background-color black
    height 25px
    opacity 0.8
    width 150px
  .participants-counter
    top 121px
    left 0
    text-align center
</style>
