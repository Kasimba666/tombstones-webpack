<template>
  <div class="ObjsMap" v-if="!!olFeatures">
<!--      olFeatures: {{olFeatures}}-->
<!--    <ol-map :view="view" style="height: 400px; width: 100%" @click="onMapClick">-->
<!--      <ol-view :zoom="zoom" :center="center" />-->

<!--      &lt;!&ndash; Слой с базовой картой &ndash;&gt;-->
<!--      <ol-layer-tile>-->
<!--        <ol-source-osm />-->
<!--      </ol-layer-tile>-->

<!--      &lt;!&ndash; Слой с объектами &ndash;&gt;-->
<!--      <ol-layer-vector>-->
<!--        <ol-source-vector :features="olFeatures" />-->
<!--        <ol-style-func>-->
<!--          <template v-for="{ feature }">-->
<!--            <ol-style-circle :radius="10">-->
<!--              <ol-style-fill :color="getFeatureColor(feature)" />-->
<!--            </ol-style-circle>-->
<!--          </template>-->
<!--        </ol-style-func>-->
<!--      </ol-layer-vector>-->
<!--    </ol-map>-->
  </div>
</template>

<script>
import 'vue3-openlayers/dist/vue3-openlayers.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { ElPopover } from 'element-plus';

export default {
  name: 'ObjsMap',
  components: {'el-popover': ElPopover},
  props: {
    features: {
      type: Array,
      required: true,
    },
    selectedFeatureId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      zoom: 9, // Начальный зум
      center: [5523488.3428, 7560538.0533], // Начальные координаты
    }
  },
  computed: {
    olFeatures() {
      return this.features.map(
          (feature) =>
              new Feature({
                geometry: new Point(feature.geometry.coordinates),
                id: feature.properties.id,
                data: feature.properties, // Добавляем данные объекта в feature
              })
      );
    },
  },
  methods: {
    // Возвращаем цвет объекта: красный — если не выбран, чёрный — если выбран
    getFeatureColor(feature) {
      return feature.get('id') === this.selectedFeatureId ? 'black' : 'red';
    },
    // Обрабатываем клик на карте
    onMapClick(event) {
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ObjsMap {

}
</style>
