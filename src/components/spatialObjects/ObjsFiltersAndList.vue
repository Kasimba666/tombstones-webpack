<template>
  <div class="ObjsFiltersAndList">
    <ObjsFilters
        v-if="!!filters && filters.length>0"
        :filtersValues="filtersValues"
        :filters="filters"
        @onChangeFiltersValues="onChangeFiltersValues"
    >
    </ObjsFilters>
    <ObjsList
        :rows="rows"
        :cols="cols"
        :currentID="currentID"
        :modeList="modeList"
        @clickRow="setCurrentIDFromObjsList"
    />
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import ObjsList from "@/components/spatialObjects/ObjsList";
import {useScreen} from '@/composables/useScreen.js'
import ObjsFilters from "@/components/spatialObjects/ObjsFilters";

export default {
  name: 'ObjsFiltersAndList',
  components: {ObjsList, ObjsFilters},
  props: [],
  data() {
    return {}
  },
  setup() {
    const {screen, screenBreakpoints} = useScreen();
    return {
      screen,
      screenBreakpoints
    }
  },
  computed: {
    ...mapState(['filtersValues', 'currentID', 'scheme']),
    ...mapGetters(['filteredGeojson', 'filteredImagesCards', 'filters', 'oneFeatureForMaps' ,'collectionFeaturesForMaps']),
    ...mapMutations(['setCurrentID', 'setFiltersValues']),
    cols() {
      let tempCols = [];
      this.scheme.forEach((item) => {
        if (item.inTable === 1) {
          tempCols.push({attrName: item.attrName, titleName: item.title, colSize: item.colSize})
        }
      });
      return tempCols;
    },
    rows() {
      if (this.filteredGeojson.length>0) return null;
      let tempRows = this.filteredGeojson.features.map((feature) => {
        let tempProperties = {};
        this.scheme.forEach((item) => {
          if (item.inTable === 1) {
            tempProperties[item.attrName] = feature.properties[item.attrName];
          }
        });
        tempProperties['imgs'] = this.filteredImagesCards.filter((v) => v['id'].toString() === feature.properties['id'].toString())[0]?.img
        return tempProperties
      });
      return tempRows.sort((a, b) => a['name'].localeCompare(b['name']));
      // return tempRows.sort((a, b) => a['name'].localeCompare(b['name']));

    },
    modeList() {
      return this.modeShort ? 'cards' : 'table'
    },
    modeShort() {
      return this.screen.type === 'xs' || this.screen.type === 'sm'
    },
  },
  methods: {
    setCurrentIDFromObjsList(v) {
      this.$store.commit('setCurrentID', v);
      this.$router.push({name: 'ObjDetails', params: {id: this.currentID}});
    },
    onChangeFiltersValues(v) {
      this.$store.commit('setFiltersValues', v);
      //формируем адресную строку
      this.$router.push({query: this.filtersValues.reduce((s,v) => {
          s[v['attrName']] = v['value'];
          return s;
        }, {})});
    },
  },
  mounted() {
    //извлекаем значения фильтров из адресной строки
    let filtersValuesFromURL = Object.entries(this.$route.query).map(([key, value]) => {
      return {attrName: key, value: value}
    });
    if (filtersValuesFromURL.length>0) this.$store.commit('setFiltersValues', filtersValuesFromURL);
  },
}
</script>

<style lang="scss">
.ObjsFiltersAndList {

}
</style>
