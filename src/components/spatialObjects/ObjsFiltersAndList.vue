<template>
<!--  filtersValues: {{filtersValues}}<br/>-->
<!--  filters: {{filters}}<br/>-->
  <div class="ObjsFiltersAndList" :class="{directionColumn: modeShort}">
<!--    sortingValues: {{sortingValues}}<br/>-->
    <div class="filters-and-list">
      <div>
        <button
          @click="toogleFiltersShow"
        >
          Фильтры
        </button>
      </div>
      <ObjsFilters
          v-if="!!filters && filters.length>0 && filtersIsShown"
          :filters="filters"
          :filtersValues="filtersValues"
          @onChangeFiltersValues="onChangeFiltersValues"
      />
      <ObjsSorting
          :sortingValues="sortingValues"
          :scheme="scheme"
          @onChangeSortingValues="onChangeSortingValues"
      />
      <ObjsViewModePanel
                      v-if="modeShort"
                      :allViewModes="viewModes"
                      :currentViewMode="currentViewMode"
                      @setViewMode="setViewMode"
      />
      <ObjsList
          v-if="!modeShort || currentViewMode === 'list'"
          :rows="rows"
          :cols="cols"
          :currentID="currentID"
          :modeList="modeList"
          @clickRow="onSetCurrentIDFromObjsList"
      />
      <div/>
    </div>
    <div class="map">
      <ObjsMap
          v-if="!modeShort || currentViewMode === 'map'"
          :collectionFeatures="collectionFeaturesForMaps"
          :oneFeature="oneFeatureForMaps"
          :scheme="scheme"
          @clickPoint="onSetCurrentIDFromObjsMap"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import {useScreen} from '@/composables/useScreen.js'
import ObjsList from "@/components/spatialObjects/ObjsList";
import ObjsFilters from "@/components/spatialObjects/ObjsFilters";
import ObjsMap from "@/components/spatialObjects/ObjsMap";
import ObjsViewModePanel from "@/components/spatialObjects/ObjsViewModePanel";
import ObjsSorting from "@/components/spatialObjects/ObjsSorting";

export default {
  name: 'ObjsFiltersAndList',
  components: {ObjsViewModePanel, ObjsList, ObjsFilters, ObjsSorting, ObjsMap},
  props: [],
  data() {
    return {
      viewModes: ['list', 'map'],
      currentViewMode: 'list',
      filtersIsShown: true,
    }
  },
  setup() {
    const {screen, screenBreakpoints} = useScreen();
    return {
      screen,
      screenBreakpoints
    }
  },
  computed: {
    ...mapState(['filtersValues', 'sortingValues', 'currentID', 'scheme']),
    ...mapGetters(['filteredGeojson', 'filteredImagesCards', 'filters', 'URLQuery', 'oneFeatureForMaps', 'collectionFeaturesForMaps']),
    ...mapMutations(['setCurrentID', 'setFiltersValues', 'setSortingValues', 'setFromURLQuery']),
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
      if (!this.filteredGeojson || this.filteredGeojson.length > 0) return null;
      let tempRows = this.filteredGeojson.features.map((feature) => {
        let tempProperties = {};
        this.scheme.forEach((item) => {
          if (item.inTable === 1) {
            tempProperties[item.attrName] = feature.properties[item.attrName];
          }
        });
        tempProperties['imgs'] = this.filteredImagesCards.filter((v) => '' + v['id'] === '' + feature.properties['id'])[0]?.img
        return tempProperties
      });
      return tempRows;
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
    onSetCurrentIDFromObjsList(v) {
      this.$store.commit('setCurrentID', v);
      this.$router.push({name: 'ObjDetails', params: {id: this.currentID}});
    },
    onSetCurrentIDFromObjsMap(v) {
      this.$store.commit('setCurrentID', v);
      this.$router.push({name: 'ObjDetails', params: {id: this.currentID}});
    },
    onChangeFiltersValues() {
      this.$store.commit('setFiltersValues', this.filtersValues);
      let query=this.URLQuery;
      this.$router.push({query});
    },
    onChangeSortingValues() {
      this.$store.commit('setSortingValues', this.sortingValues);
      let query=this.URLQuery;
      this.$router.push({query});
    },
    setViewMode(v) {
      this.currentViewMode = v;
    },
    toogleFiltersShow() {
      this.filtersIsShown = !this.filtersIsShown;
    },
  },
  mounted() {
    //извлекаем значения фильтров из адресной строки
    if (!!this.$route.query) this.$store.commit('setFromURLQuery', this.$route.query);
  },
}
</script>

<style lang="scss">
.ObjsFiltersAndList {
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 5px;
  &.directionColumn {
    flex-direction: column;
  }

  .filters-and-list {
    width: auto;
    min-width: 384px;
    flex: 1;
  }

  .map {
    position: relative;
    width: auto;
    height: 90dvh;
    min-width: 384px;
    flex: 1;
  }
}
</style>
