<template>
  <div class="ObjsMapPrevious" v-show="!!collectionFeatures">
    ObjsMapPrevious<br/>
<!--    overlay {{overlay}}<br/>-->
<!--    currentID: {{currentID}}<br/>-->
<!--    oneFeature: {{oneFeature}}<br/>-->
<!--    collectionFeatures: {{collectionFeatures}}<br/>-->
<!--    collectionFeatures length: {{collectionFeatures.features.length}}<br/>-->
    <el-button @click="closePopup">Close Popup</el-button>
    <div id="map" class="map">
      <div id="info"></div>
    </div>
    <div id="popup" class="ol-popup">
      <div class="btns-control-popup">
        <button class="btn-popup-main" @click="onSetCurrentPoint">{{ popupTitle }}</button>
<!--        <div class="ol-popup-closer" @click="closePopup"></div>-->
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      </div>
      <div id="popup-content"></div>
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
import {ScaleLine} from 'ol/control.js';

// let currentPointFeature = null;

export default {
  name: 'ObjsMapPrevious',
  components: {},
  props: ['scheme',
    'collectionFeatures',
    'currentID'],
  emits: ['clickPoint'],
  data() {
    return {
      map: null,
      contentPopup: '',
      closer: null,
      popupTitle: '',
      overlay: null,
      currentPointFeature: null,
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
    const styleFunctionOne = (feature) => {
      return styles['PointOne'];
    };
    const styleFunctionCollection = function (feature) {
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
          zIndex: 1,
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
          style: this.styleFunctionCollection,
          zIndex: 0,
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
//ScaleLine
      this.map.addControl( new ScaleLine({units: 'metric', bar: true}));
    },
    initPointer() {
      //Pointer on hover
      this.map.on("pointermove", function (evt) {
        let hit = this.forEachFeatureAtPixel(evt.pixel, function () {
          return true;
        });
        if (hit) {
          this.getTargetElement().style.cursor = 'pointer';
        } else {
          this.getTargetElement().style.cursor = '';
        }
      });
    },
    initTooltip() {
//Tooltip
      const info = document.getElementById('info');
      let currentFeature;
      this.map.on('pointermove', function (evt) {
        if (evt.dragging) {
          info.style.visibility = 'hidden';
          currentFeature = undefined;
          return;
        }
        const pixel = this.getEventPixel(evt.originalEvent);
        const feature = evt.originalEvent.target.closest('.ol-control')
            ? undefined
            : this.forEachFeatureAtPixel(pixel, function (feature) {
              return feature;
            });
        if (feature) {
          info.style.left = 10 + pixel[0] + 'px';
          info.style.top = pixel[1] + 'px';
          if (feature !== currentFeature) {
            info.style.visibility = 'visible';
            info.innerText = feature.get('name');
          }
        } else {
          info.style.visibility = 'hidden';
        }
        currentFeature = feature;
      });
      this.map.getTargetElement().addEventListener('pointerleave', function () {
        currentFeature = undefined;
        info.style.visibility = 'hidden';
      });
    },
    initPopup() {
      /* Elements that make up the popup.*/
      const content_element = document.getElementById('popup-content');
      // const closer = document.getElementById('popup-closer');
      this.closer = document.getElementById('popup-closer');
      let overlay = new Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        offset: [0, -10]
      });
      this.map.addOverlay(overlay);
      this.closer.onclick = function () {
        overlay.setPosition(undefined);
        this.blur();
        return false;
      };
//Popup
      this.map.on('click', event => {
        let feature = this.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
          return feature;
        });
        if (feature != null && feature != undefined) {
          let coord = this.map.getCoordinateFromPixel(event.pixel);//Координаты точки как места на карте
          //найти в collectionFeatures сооветствие для feature
          this.currentPointFeature = {
            type: this.collectionFeatures.type,
            name: this.collectionFeatures.name,
            crs: this.collectionFeatures.crs,
            features: [],
          }

          this.currentPointFeature.features.push(this.collectionFeatures.features.filter((v) => ''+feature.get('id') === ''+v.properties.id)[0]);

          this.popupTitle = feature.get('name');
          let content = '';
          Object.entries(this.currentPointFeature.features[0].properties).forEach(([key, value]) => {
            if (key != 'id' && key != 'name' && value != null && value != '') {
              content += '<h8>' + this.scheme.filter(v => {
                if (v['attrName'] === key) return v
              })[0].title + ': ' + value + '</h8>' + '<br>'
            }
          });

          if (content != '') {
            this.contentPopup = content;
            content_element.innerHTML = content;
            overlay.setPosition(coord);
          }
        }
      });//onclick

    },
    onSetCurrentPoint() {
      this.$emit('clickPoint', this.currentPointFeature.features[0].properties.id);
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
    addCollectionFeaturesLayer() {
      this.closePopup();
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
      this.closePopup();
      if (!!this.map && !!this.oneFeature) {
        this.removeFeaturesByName('one');
        if (!!this.oneFeature) {
          this.map.addLayer(this.vectorLayerOne);
          this.map.getView().setCenter(this.centerOne);
        }

      }
    },
    closePopup() {
      console.log('close Popup');
      // overlay.setPosition(undefined);
      this.closer.onclick();
    },

  },

  mounted() {
    console.log('on mount');
    this.initMap();
    this.initPointer();
    this.initTooltip();
    this.initPopup();
    this.addOneFeatureLayer();
    this.addCollectionFeaturesLayer();
  },

  watch: {
    collectionFeatures: function () {this.addCollectionFeaturesLayer();},
    currentID: function () {this.addOneFeatureLayer()},
  },

}
</script>

<style lang="scss">

.ObjsMapPrevious {
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

  #info {
    position: absolute;
    display: inline-block;
    height: auto;
    width: auto;
    z-index: 100;
    background-color: hsl(0, 0%, 100%, 0.8);
    color: #333;
    text-align: left;
    border-radius: 4px;
    padding: 5px;
    left: 50%;
    transform: translateX(3%);
    visibility: hidden;
    pointer-events: none;
  }

  .ol-popup {
    position: absolute;
    background-color: hsl(0, 0%, 100%, 0.8);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 5px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    width: auto;
    min-width: 100px;

  }

  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }

  .ol-popup-closer:after {
    content: "✖";
  }

  .ol-popup-closer {
    position: relative;
    text-decoration: none;
  }

  .btns-control-popup {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;

    .btn-popup-main {
      height: auto;
      width: auto;
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 5px;
      text-align: left;
      word-break: normal;
      padding-left: 3px;
      padding-right: 3px;

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      }
    }


  }

}
</style>
