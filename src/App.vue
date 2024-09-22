<template>
  <div class="app">
    <div class="screen-monitor" v-if="DEBUG">
      {{ screen.type }}<br/>
      {{ screen.width }}px
    </div>
    <AppHeader/>
    <AppBody/>
    <AppFooter/>
  </div>
</template>

<script>
import {useScreen} from "@/composables/useScreen";
import AppHeader from "@/components/layout/AppHeader";
import AppBody from "@/components/layout/AppBody";
import AppFooter from "@/components/layout/AppFooter";
import {mapActions, mapGetters} from "vuex";
export default {
  components: {AppFooter, AppHeader, AppBody},
  data() {
    return {
      DEBUG: process.env.NODE_ENV === 'development',
    }
  },
  setup() {
    const {screen, screenBreakPoints, setScreenListener, removeScreenListener} = useScreen();
    return {
      screen,
      screenBreakPoints,
      setScreenListener,
      removeScreenListener
    }
  },
  computed: {
    ...mapGetters(['URLQuery']),
    ...mapActions(['loadObjsStore', 'loadImagesCSV', 'initFiltersValues', 'initSortingValues']),
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('loadObjsStore');
    this.$store.dispatch('loadImagesCSV');
    this.$store.dispatch('initFiltersValues');
    this.$store.dispatch('initSortingValues');
    // let query= {filters: JSON.stringify(this.URLQuery)};
    // this.$router.push({query});
    this.setScreenListener();
  },
  unmounted() {
    this.removeScreenListener();
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 0.9rem;
}

.app {
  padding: 20px;
}
.screen-monitor {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 12px;
  color: black;
  z-index: 10;
}
</style>
