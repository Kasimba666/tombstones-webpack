<template>
  <div class="ObjsFiltersAndList">

  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

export default {
  name: 'ObjsFiltersAndList',
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {
...mapState(['filtersValues']),
    ...mapGetters(['filteredGeojson', 'filters'])
  },
  methods: {},
  mounted() {
  },
}
</script>

<style lang="scss">
.ObjsFiltersAndList {

}
</style>
