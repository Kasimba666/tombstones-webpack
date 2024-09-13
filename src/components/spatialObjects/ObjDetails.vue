<template>
  <div class="ObjDetails" :class="{directionColumn: modeShort}">
    <div class="details">
      <button
          class="btn-close"
          @click="goBack"
      >
      </button>
      <div class="details-properties">
        <div v-for="(detail, i) of details" :key="i">
          <div v-if="!!detail.value && detail.titleName != '3d'">
            <b> {{ detail.titleName }}: </b> {{ detail.value }}
          </div>
        </div>
      </div>
      <div class="main-images-and-3d">
        <div class="collection-images" v-if="!!imgsCard">
          <div v-for="(v, i) of imgsCard.imgs" :key="i">
            <a :href="v.large" target="_blank">
              <div class="my-image"
                   :style="{backgroundImage: `url(${v.small})`}">
              </div>
            </a>
            <div class="my-image-label">
              {{ v.label }}
            </div>
          </div>
        </div>
        <div class="sketchfab-embed-wrapper"
             v-if="!!details && sketchfabLink != null">
          <iframe allowfullscreen mozallowfullscreen="true"
                  webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking
                  execution-while-out-of-viewport execution-while-not-rendered web-share
                  :src="sketchfabLink">
          </iframe>
        </div>
      </div>
      <div class="other-images">
        <div class="collection-images"
             v-if="!!imgsOther"
             v-for="w of imgsOther">
          <!--                <div>{{w['categoryTitle']}}</div>-->
          <div v-for="(v,i) of w.imgs" :key="i">
            <div v-if="v != null">
              <a :href="v.large" target="_blank">
                <div class="my-image" :style="{backgroundImage: `url(${v.small})`}"></div>
              </a>
              <div class="my-image-label">
                {{ v.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map">
      <ObjsMap
          :collectionFeatures="collectionFeaturesForMaps"
          :oneFeature="oneFeatureForMaps"
          :scheme="scheme"
          @clickPoint="setCurrentIDFromObjsMap"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import ObjsMap from "@/components/spatialObjects/ObjsMap";
import {useScreen} from "@/composables/useScreen";

export default {
  name: 'ObjDetails',
  components: {ObjsMap},
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
    ...mapState(['currentID', 'scheme']),
    ...mapGetters(['detailsGeojsonByID', 'detailsImgsByCategoriesByID', 'oneFeatureForMaps', 'collectionFeaturesForMaps']),
    ...mapMutations(['setCurrentID']),
    details() {//получить из стора
      return this.detailsGeojsonByID(this.$route.params.id);
    },
    imgs() {//получить из стора
      return this.detailsImgsByCategoriesByID(this.$route.params.id);
    },

    imgsCard() {
      if (!!this.imgs && this.imgs.length > 0) {
        return this.imgs.filter(v => v['category'] === 'cards')[0];

      }
    },
    imgsOther() {
      if (!!this.imgs && this.imgs.length > 0) {
        return this.imgs.filter((v) => {
          if (v['category'] != 'cards') {
            return v
          }
        });
      }
    },
    sketchfabLink() {
      if (!this.details || this.details.filter(v => v.titleName === '3d' && v.value != '' && v.value != null).length === 0) return null
      return this.details.filter(v => v.titleName === '3d')[0].value + '/embed';
    },
    modeShort() {
      return this.screen.type === 'xs' || this.screen.type === 'sm'
    },
  },
  methods: {
    setCurrentIDFromObjsMap(v) {
      this.$store.commit('setCurrentID', v);
      this.$router.push({name: 'ObjDetails', params: {id: this.currentID}});
    },
    goBack() {
      this.$router.push({name: 'ObjsFiltersAndList'});
    },
  },
  mounted() {
    if (this.details === null) {
      alert('Указан неверный адрес: ' + this.$route.path);
      this.goBack();
    } else {
      this.$store.commit('setCurrentID', +this.$route.params.id);

    }
  },
}
</script>

<style lang="scss">
.ObjDetails {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
  &.directionColumn {
    flex-direction: column;
  }

  .btn-close {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
    border: 1px solid grey;
    background-color: white;
    z-index: 10;
  }

  .details {
    position: relative;
    width: auto;
    min-width: 384px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    flex: 1;

    .details-properties {
      padding: 5px;
      border: 2px solid hsla(0, 0%, 50%, 0.2);
      border-radius: 5px;
    }

    .collection-images {
      position: relative;
      height: auto;
      width: auto;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
      padding: 5px;

      .my-image {
        flex: 1 1 auto;
        width: 150px;
        height: 200px;
        min-width: 30px;
        min-height: 60px;
        background-color: white;
        border-radius: 10px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        &:hover {
          box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
        }
      }

      .my-image-label {
        text-align: center;
      }
    }

    .main-images-and-3d {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: row wrap;
      gap: 5px;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .sketchfab-embed-wrapper {
      align-self: center;
      padding: 5px;
    }

    .other-images {

    }
  }

  .map {
    width: auto;
    height: 90dvh;
    min-width: 384px;
    flex: 1;
  }
}
</style>
