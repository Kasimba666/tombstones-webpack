<template>
  <div class="PageTombstones">
<!--    <router-view/>-->
    <ObjsMain v-if="!!filteredGeojson"
    ></ObjsMain>
  </div>
</template>

<script>
import ObjsMain from "@/components/spatialObjects/ObjsMain"

import {mapState, mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: 'PgStones',
  components: {ObjsMain},
  props: [

  ],
  data() {
    return {
      schemeName: 'stones',
    }
  },
  computed: {
    ...mapState(['scheme', 'imgs', 'currentID', 'filtersValues']),
    ...mapGetters(['filters', 'filteredGeojson', 'filteredImgsByCategories','filteredImgs' , 'filteredImagesCards']),
    ...mapMutations(['setCurrentID', 'setFiltersValues']),
    ...mapActions(['loadObjsStore', 'loadImagesCSV', 'initFiltersValues']),

  },
  methods: {


  },
  mounted() {
    this.$store.dispatch('loadObjsStore');
    this.$store.dispatch('loadImagesCSV');
    this.$store.dispatch('initFiltersValues');

  },
}
</script>

<style lang="scss">
.PageTombstones {

}

</style>

