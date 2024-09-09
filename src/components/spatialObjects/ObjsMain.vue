<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="objs-main">
          <router-view/>
          <div :style="{display: visibleFiltersAndList ?'block':'none'}">
            <objs-filters
                v-if="!!this.filters"
                :filtersValues="filtersValues"
                :filters="filters"
                @onChangeFiltersValues="onChangeFiltersValues"
            >
            </objs-filters>
            <objs-view-mode-panel
                v-if="modeShort"
                :allViewModes="viewModes"
                :currentViewMode="currentViewMode"
                @setViewMode="setViewMode"
            />

            <objs-list v-if="!modeShort || currentViewMode === 'list'"
                       :rows="rows"
                       :cols="cols"
                       :currentID="currentID"
                       :modeList="modeList"
                       @clickRow="setCurrentIDFromObjsList"
            >
              <!--                       :currentRow="currentRow"-->
            </objs-list>

          </div>
        </div>
      </div>
     <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="objs-map" v-if="!modeShort || currentViewMode === 'map' || visibleDetails">
          <objs-map v-if="!!collectionFeaturesForMaps"
                    :collectionFeatures="collectionFeaturesForMaps"
                    :oneFeature="oneFeatureForMaps"
                    :scheme="scheme"
                    @clickPoint="setCurrentIDFromObjsMap"
          >
          </objs-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ObjsList from "@/components/spatialObjects/ObjsList";
import ObjsFilters from "@/components/spatialObjects/ObjsFilters";
import ObjsMap from "@/components/spatialObjects/ObjsMap";
import ObjsViewModePanel from "@/components/spatialObjects/ObjsViewModePanel";
import {useScreen} from '@/composables/useScreen.js'

export default {
  components: {ObjsViewModePanel, ObjsList, ObjsFilters, ObjsMap},
  props: {
    geojson: Object, //выборка объектов
    imgsOld: Array, //выборка изображений для ObjsDetails
    imgs: Array, //выборка изображений для ObjsList
    scheme: Array, //конфиг, отправляется в ObjsMap
    filters: Array, //набор фильтров
    filtersValues: Array, //значения фильтров
    currentID: Number,
  },
  emits: ['onChangeFiltersValues', 'onSetCurrentID'],
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
      if (this.geojson === null) return null;
      let tempRows = this.geojson.features.map((feature) => {
        let tempProperties = {};
        this.scheme.forEach((item) => {
          if (item.inTable === 1) {
            tempProperties[item.attrName] = feature.properties[item.attrName];
          }
        });
        tempProperties['imgs'] = this.imgs.filter((v) => v['id'].toString() === feature.properties['id'].toString())[0]?.img
        return tempProperties
      });
      return tempRows.sort((a, b) => a['name'].localeCompare(b['name']));

    },


    currentFeature() {
      if (!this.currentID || !this.geojson.features || this.geojson.features.length === 0 || !this.geojson.features[0]) return null;
      let newFeature = this.geojson.features.find(v => v.properties.id.toString() === this.currentID.toString());
      if (!!newFeature) {
        return {
          type: this.geojson.type,
          name: this.geojson.name,
          crs: this.geojson.crs,
          features: [this.geojson.features.find(v => v.properties.id.toString() === this.currentID.toString())],
        }
      } else {
        // console.log('currentFeature newFeature:', newFeature);
        return null
      };
    },
    oneFeatureForMaps() {

      if (!!this.currentFeature) {
        let newProperties = {};
        this.scheme.forEach((item) => {
          if (item.inMap === 1) {
            newProperties[item.attrName] = this.currentFeature.features[0].properties[item.attrName];
          }
        });
        return {
          type: this.currentFeature.type,
          name: this.currentFeature.name,
          crs: this.currentFeature.crs,
          features: [{
            type: this.currentFeature.features[0].type,
            properties: newProperties,
            geometry: this.currentFeature.features[0].geometry,
          }],
        }
      } else return null
    },
    collectionFeaturesForMaps() {
      if (!!this.geojson) {
        let newFeatures = this.geojson.features.map((feature) => {
          let newProperties = {};
          this.scheme.forEach((item) => {
            if (item.inMap === 1) {
              newProperties[item.attrName] = feature.properties[item.attrName];
            }
          });
          return {
            type: feature.type,
            properties: newProperties,
            geometry: feature.geometry,
          }
        });
        return {
          type: this.geojson.type,
          name: this.geojson.name,
          crs: this.geojson.crs,
          features: newFeatures,
        }
      }
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
      this.$emit('onSetCurrentID', id);
      this.$router.push({name: 'ObjDetails', params: {id: id}});
    },
    setCurrentIDFromObjsList(id) {
      this.visibleDetails = true
      // this.visibleFiltersAndList = false;
      this.$emit('onSetCurrentID', id);
      this.$router.push({name: 'ObjDetails', params: {id: id}});
    },

    // closeDetails() {
    //   // this.visibleDetails = false;
    //   this.visibleFiltersAndList = true;
    // },

    onChangeFiltersValues(v) {
      this.$emit('onChangeFiltersValues', v);
    },

    setViewMode(v) {
      this.currentViewMode = v;
    },

  },
  mounted() {
    // this.initFiltersValues();
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
