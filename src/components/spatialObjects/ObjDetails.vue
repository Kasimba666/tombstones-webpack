<template>
  <div class="ObjDetails">
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
            {{v.label}}
          </div>
        </div>
      </div>
      <div class="sketchfab-embed-wrapper"
           v-if="!!details && sketchfabLink != null">
<!--        sketchfab: {{ sketchfab }}-->
        <iframe allowfullscreen mozallowfullscreen="true"
                webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking
                execution-while-out-of-viewport execution-while-not-rendered web-share
                :src="sketchfabLink">
        </iframe>
      </div>
    </div>
    <div>
      <div v-if="!!imgsOther">
        <div class="collection-images" v-for="w of imgsOther">
          <!--          <div>{{w['categoryTitle']}}</div>-->
          <div v-for="(v,i) of w.imgs" :key="i">
            <div v-if="v != null">
              <a :href="v.large" target="_blank">
                <div class="my-image" :style="{backgroundImage: `url(${v.small})`}"></div>
              </a>
              <div class="my-image-label">
                {{v.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: 'ObjDetails',
  components: {},
  props: [],
  data() {
    return {
      // details: null,
      // imgs: null,
    }
  },
  computed: {
    ...mapGetters(['detailsGeojsonByID', 'detailsImgsByCategoriesByID']),
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
      if (!this.details || this.details.filter(v => v.titleName === '3d' && v.value != '' && v.value != null).length === 0)  return null
      return this.details.filter(v => v.titleName === '3d')[0].value + '/embed';
    },
  },
  methods: {
    goBack() {
      //извлечь предыдущий маршрут
      let parentRoute = this.$route.matched[this.$route.matched.length - 2];
      // this.$router.push({name: parentRoute.name});
      this.$router.push({name: parentRoute.name, query: {id: this.$route.params.id}});
    },
  },
  mounted() {
    //получить детали из стора
    // this.details = this.detailsGeojsonByID(this.$route.params.id);
    if (this.details === null) {
      alert('Указан неверный адрес: ' + this.$route.path);
      this.goBack();
    } else {
      this.$store.commit('setCurrentID', +this.$route.params.id);
      //получить изображения из стора
      // this.imgs = this.detailsImgsByCategoriesByID(this.$route.params.id);

    }
  },
}
</script>

<style lang="scss">
.ObjDetails {
  position: relative;
  padding: 30px 5px 5px 5px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

  .btn-close {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .details-properties {
    padding: 5px;
    border: 2px solid hsla(0, 0%, 50%, 0.2);
    border-radius: 5px;
  }

  .my-image {
    flex: 1 1 auto;
    width: 150px;
    height: 200px;
    min-width: 30px;
    min-height: 60px;
    background-color: white;
    border-radius: 2px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    &:hover {
      box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
    }
    .my-image-label {
      text-align: center;
      background-color: #c6acae;
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
    .my-image-label {
      text-align: center;
    }
  }

  .sketchfab-embed-wrapper {
    align-self: center;
    padding: 5px;
  }
}
</style>
