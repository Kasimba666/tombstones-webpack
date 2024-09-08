<template>
  <div class="screen-monitor" v-if="DEBUG">
    {{ screen.type }}<br/>
    {{ screen.width }}px
  </div>
    <ObjsNavbar></ObjsNavbar>
    <div class="app">
      <router-view/>
    </div>
</template>

<script>
import ObjsNavbar from "@/components/spatialObjects/ObjsNavBar";
import {mapGetters, mapMutations} from "vuex";
import {useScreen} from "@/composables/useScreen";
export default {
  components: {ObjsNavbar},
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

  },
  methods: {

  },
  mounted() {

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
