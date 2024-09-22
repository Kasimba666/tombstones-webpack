<template>
  <div class="ObjsMap" v-if="!!collectionFeatures && collectionFeatures?.features?.length>0">
    <div id="map" class="map">
      <div id="info"></div>
    </div>
  </div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import Overlay from 'ol/Overlay.js';
import {ElPopover} from "element-plus";

export default {
  name: 'ObjsMap',
  components: {'el-popover': ElPopover},
  props: ['collectionFeatures', 'currentID'],
  emits: ['clickPoint'],
  data() {
    return {
      map: null,
    }
  },
  setup() {
    const styles = {
      'PointCollection': new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: [255, 0, 0, 0.2]}),
          stroke: new Stroke({color: 'red', width: 2}),
        }),
      }),
      'PointOne': new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({color: 'red'}),
          stroke: new Stroke({color: 'black', width: 2}),
        }),
      }),
    };
    const styleFunctionOne = () => {
      return styles['PointOne'];
    };
    const styleFunctionCollection = () => {
      return styles['PointCollection'];
    };
    return {
      styleFunctionOne,
      styleFunctionCollection
    }
  },
  computed: {
    bounds() {
      if (!!this.collectionFeatures && this.collectionFeatures['features'].length > 0) {
        let coordinates = this.collectionFeatures['features'].map(v => {
          return v['geometry']['coordinates'];
        });
        let coordinatesX = coordinates.map(v => +v[0].toFixed(0)).sort((a, b) => {
          return a > b ? 1 : -1
        });
        let coordinatesY = coordinates.map(v => +v[1].toFixed(0)).sort((a, b) => {
          return a > b ? 1 : -1
        });
        return [coordinatesX[0], coordinatesY[0], coordinatesX[coordinatesX.length - 1], coordinatesY[coordinatesY.length - 1]];
      } else return null
    },
    centerCollection() {
      if (this.bounds === null) return null;
      return [(this.bounds[2] + this.bounds[0]) / 2, (this.bounds[1] + this.bounds[3]) / 2];
    },
    centerOne() {
      if (this.oneFeature === null || this.oneFeature.features[0] === null) return null;
      return [this.oneFeature.features[0]['geometry']['coordinates'][0], this.oneFeature.features[0]['geometry']['coordinates'][1]];
    },
    vectorLayerOne() {
      if (!!this.oneFeature) {
        return new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(this.oneFeature, {
            })
          }),
          name: 'one',
          style: this.styleFunctionOne,
        });
      }
    },
    vectorLayerCollection() {
      if (!!this.collectionFeatures) {
        return new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(this.collectionFeatures, {
            })
          }),
          name: 'collection',
          style: this.styleFunctionCollection
        });
      }
    },
    oneFeature() {
      if (!this.currentID || !this.collectionFeatures) return null;
      let newFeature = this.collectionFeatures.features.find(v=>v.properties.id===this.currentID);
      return !!newFeature ? {
        type: this.collectionFeatures.type,
        name: this.collectionFeatures.name,
        crs: this.collectionFeatures.crs,
        features: [newFeature]
      } : null;
    }
  },
  methods: {
    // getFeatureColor(feature) {// Возвращаем цвет объекта: красный — если не выбран, чёрный — если выбран
    //   return feature.get('id') === this.selectedFeatureId ? 'black' : 'red';
    // },
    initMap() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: 'map',
        view: new View({
          center: this.centerCollection,
          zoom: 9,
        }),
      });
      this.addOneFeatureLayer();
      this.addCollectionFeatures();
    },
    removeFeaturesByName(name) {
      let lays = [];
      this.map.getLayers().forEach(layer=>{
        if (layer.get('name') === name) {
          lays.push(layer);
        }
      });
      lays.forEach(lay=> {
        this.map.removeLayer(lay);
      });
    },
    addCollectionFeatures() {
      if (!!this.map && !!this.collectionFeatures) {
        this.removeFeaturesByName('collection');
        //если текущий объект не входит в новую выборку, то удаляем
        if (!this.collectionFeatures.features.map(v=>v.properties.id).includes(this.currentID)) this.removeFeaturesByName('one');
        if (this.collectionFeatures != null) {
          this.map.addLayer(this.vectorLayerCollection);
          this.map.getView().setCenter(this.centerCollection);
        }
      }
    },
    addOneFeatureLayer() {
      if (!!this.map && !!this.oneFeature) {
        this.removeFeaturesByName('one');
        if (!!this.oneFeature) {
          this.map.addLayer(this.vectorLayerOne);
          this.map.getView().setCenter(this.centerOne);
        }

      }
    },
  },
  mounted() {
    this.initMap();
  },
  watch: {
    collectionFeatures: function () {
      this.addCollectionFeatures();
    },
    oneFeature: function () {this.addOneFeatureLayer()},
  },
}
</script>

<style lang="scss">
.ObjsMap {
  position: relative;
  width: 100%;
  height: 100%;

  .map {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid gray;
  }

  #map {
    position: relative;
  }
}
</style>
