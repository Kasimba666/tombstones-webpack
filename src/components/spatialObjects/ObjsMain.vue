<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="objs-main">
          <router-view/>
<!--          <div :style="{display: visibleFiltersAndList ?'block':'none'}">-->
<!--            <objs-filters-->
<!--                v-if="!!this.filters"-->
<!--                :filtersValues="filtersValues"-->
<!--                :filters="filters"-->
<!--                @onChangeFiltersValues="onChangeFiltersValues"-->
<!--            >-->
<!--            </objs-filters>-->
<!--            <objs-view-mode-panel-->
<!--                v-if="modeShort"-->
<!--                :allViewModes="viewModes"-->
<!--                :currentViewMode="currentViewMode"-->
<!--                @setViewMode="setViewMode"-->
<!--            />-->

<!--            <objs-list v-if="!modeShort || currentViewMode === 'list'"-->
<!--                       :rows="rows"-->
<!--                       :cols="cols"-->
<!--                       :currentID="currentID"-->
<!--                       :modeList="modeList"-->
<!--                       @clickRow="setCurrentIDFromObjsList"-->
<!--            >-->
<!--            </objs-list>-->

<!--          </div>-->
        </div>
      </div>
<!--      <ObjsFiltersAndList/>-->
<!--      <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">-->
<!--        <div class="objs-map" v-if="!modeShort || currentViewMode === 'map' || visibleDetails">-->
<!--            <ObjsMap-->
<!--                style="height: 90dvh"-->
<!--                :collectionFeatures="collectionFeaturesForMaps"-->
<!--                :oneFeature="oneFeatureForMaps"-->
<!--                :scheme="scheme"-->
<!--                @clickPoint="setCurrentIDFromObjsMap"-->
<!--            />-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import ObjsList from "@/components/spatialObjects/ObjsList";
import ObjsFilters from "@/components/spatialObjects/ObjsFilters";
import ObjsMap from "@/components/spatialObjects/ObjsMap";
import ObjsViewModePanel from "@/components/spatialObjects/ObjsViewModePanel";
import ObjsFiltersAndList from "@/components/spatialObjects/ObjsFiltersAndList";
import {useScreen} from '@/composables/useScreen.js'
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  components: {ObjsViewModePanel, ObjsFiltersAndList, ObjsList, ObjsFilters, ObjsMap},
  props: {
  },
  data() {
    return {
      json: null,//набор объектов
      visibleFiltersAndList: true,
      visibleDetails: false,
      viewModes: ['list', 'map'],
      currentViewMode: 'list',

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
    ...mapState(['scheme', 'currentID', 'filtersValues']),
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
      if (this.filteredGeojson === null) return null;
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

    },


    modeList() {
      return this.modeShort ? 'cards' : 'table'
    },
    modeShort() {
      return this.screen.type === 'xs' || this.screen.type === 'sm'
    },
  },
  methods: {
    setCurrentIDFromObjsMap(id) {
      this.visibleDetails = true
      // this.visibleFiltersAndList = false;
      this.onSetCurrentID(id);
      this.$router.push({name: 'ObjDetails', params: {id: id}});
    },
    setCurrentIDFromObjsList(id) {
      this.visibleDetails = true
      // this.visibleFiltersAndList = false;
      this.onSetCurrentID(id);
      this.$router.push({name: 'ObjDetails', params: {id: id}});
    },

    // closeDetails() {
    //   // this.visibleDetails = false;
    //   this.visibleFiltersAndList = true;
    // },
    onChangeFiltersValues(v) {
      this.$store.commit('setFiltersValues', v);
    },
    onSetCurrentID(v) {
      this.$store.commit('setCurrentID', v)
    },
    setViewMode(v) {
      this.currentViewMode = v;
    },

  },
  mounted() {
  },
}
</script>

<style lang="scss">

.objs-main {
  //border: 1px solid black;
  width: 100%;
  height: auto;

  .filters-and-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    background-color: transparent;

    .filters {
      background-color: transparent;
      padding: 5px;
      border: 1px solid red;
    }

    .list {
      background-color: transparent;
      padding: 5px;

    }
  }

  .ObjsDetails {
    width: 100%;
    height: auto;
  }
}

.objs-map {
  width: 100%;
  height: 80vh;
  //background-color: lightgrey;
}

</style>
