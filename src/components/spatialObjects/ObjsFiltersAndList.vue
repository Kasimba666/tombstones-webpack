<template>
<!--  filteredGeojson: {{filteredGeojson}}-->
<!--  filteredGeojson length: {{filteredGeojson?.features?.length}}-->
<!--  filtersValues: {{filtersValues}}<br/>-->
<!--  filters: {{filters}}<br/>-->
<!--  currentID: {{currentID}}<br/>-->
<!--  currentFeature: {{currentFeature}}<br/>-->
<!--  oneFeatureForMaps: {{oneFeatureForMaps}}<br/>-->
<!--  collectionFeaturesForMaps length: {{collectionFeaturesForMaps?.features?.length}}<br/>-->
<!--    sortingValues: {{sortingValues}}<br/>-->

  <div class="ObjsFiltersAndList" :class="{directionColumn: modeShort}">
    <div class="filters-and-list">
      <div>
        <el-button style="margin-top: 5px"
            size="small"
            @click="toogleFiltersShow"
        >
          <div style="display: flex; justify-content: space-between; gap: 5px">
            <el-icon><Operation /></el-icon>
            <div>Фильтры</div>
            <el-icon>
              <CaretBottom v-if="!filtersIsShown" style="font-size: 1em"/>
              <CaretTop v-else/>
            </el-icon>
          </div>
        </el-button>

        <el-button v-if="filtersIsShown"
            style="margin-top: 5px"
            size="small"
            @click="onResetFiltersValues"
        >
          Сбросить значения
        </el-button>
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
      <el-radio-group style="margin-bottom: 5px"
          v-if="modeShort"
          v-model="currentViewMode"
          size="small"
      >
        <el-radio-button label="Список" value="list" />
        <el-radio-button label="Карта" value="map" />
      </el-radio-group>
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
      <ObjsMapPrevious
          v-show="!!collectionFeaturesForMaps && (!modeShort || currentViewMode === 'map')"
          :collectionFeatures="collectionFeaturesForMaps"
          :currentID="currentID"
          :scheme="scheme"
          @clickPoint="onSetCurrentIDFromObjsMap"
      />
<!--      <ObjsMap-->
<!--          v-show="!!collectionFeaturesForMaps && (!modeShort || currentViewMode === 'map')"-->
<!--          :collectionFeatures="collectionFeaturesForMaps"-->
<!--          :currentID="currentID"-->
<!--      />-->
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {useScreen} from '@/composables/useScreen.js'
import ObjsList from "@/components/spatialObjects/ObjsList";
import ObjsFilters from "@/components/spatialObjects/ObjsFilters";
import ObjsSorting from "@/components/spatialObjects/ObjsSorting";
import ObjsMapPrevious from "@/components/spatialObjects/ObjsMapPrevious";
import ObjsMap from "@/components/spatialObjects/ObjsMap";

export default {
  name: 'ObjsFiltersAndList',
  components: {ObjsList, ObjsFilters, ObjsSorting, ObjsMapPrevious, ObjsMap},
  props: [],
  data() {
    return {
      currentViewMode: 'list',
      filtersIsShown: false,
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
    ...mapGetters(['filteredGeojson', 'filteredImagesCards', 'filters', 'URLQuery', 'currentFeature', 'oneFeatureForMaps', 'collectionFeaturesForMaps']),
    ...mapMutations(['setCurrentID', 'setFiltersValues', 'setSortingValues', 'setFromURLQuery']),
    ...mapActions(['clearFiltersValues']),
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
            if (item.hasOwnProperty('composite')) {
              let result = [];
              item.composite.children.forEach(v => {
                if (!!feature.properties[v]) result.push(feature.properties[v]);
              });
              tempProperties[item.attrName] = result.join(item.composite.delimiter);
            } else {
              tempProperties[item.attrName] = feature.properties[item.attrName];
            }
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

    toogleFiltersShow() {
      this.filtersIsShown = !this.filtersIsShown;
    },
    onResetFiltersValues() {
      this.$store.dispatch('clearFiltersValues');
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
