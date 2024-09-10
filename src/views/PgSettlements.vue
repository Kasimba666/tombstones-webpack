<template>
  <ObjsMain v-if="!!filtered"
            :geojson="filtered"
            :imgs="imgs"
            :filters="filters"
            :scheme="scheme"
            @onSetFiltersValues="setFiltersValues"
  ></ObjsMain>
</template>

<script>
import ObjsMain from "@/components/spatialObjects/ObjsMain"
import Objs from "@/components/ObjsMixins"
import fromFile from "@/data/bolgar_settlements_3857.json";


export default {
  components: {ObjsMain},
  props: [],
  mixins: [Objs],
  data() {
    return {
      filtersValues: [],
      imgs: [],
      inputGeojson: null,

      schemeObjs: [
        {attrName: 'id', title: 'id', inTable: 0, colSize: 1, inCards: 0, inDetails: 0, inMap: 1, filterType: 'none', parentValueFrom: null,},
        {attrName: 'name', title: 'Наименование', inTable: 1, colSize: 3, inCards: 1, inDetails: 1, inMap: 1, filterType: 'input', parentValueFrom: null,},
        {attrName: 'region', title: 'Регион', inTable: 1, colSize: 1, inCards: 1, inDetails: 1, inMap: 0, filterType: 'dropdown', parentValueFrom: null,},
        {attrName: 'dating', title: 'Датировка', inTable: 1, colSize: 2, inCards: 1, inDetails: 1, inMap: 1, filterType: 'dropdown', parentValueFrom: null,},
        {attrName: 'location', title: 'Местоположение', inTable: 0, colSize: 1, inCards: 0, inDetails: 1, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'area', title: 'Площадь', inTable: 1, colSize: 1, inCards: 0, inDetails: 1, inMap: 0, filterType: 'range', parentValueFrom: null,},
        {attrName: 'typesettlement', title: 'Тип', inTable: 1, colSize: 1, inCards: 0, inDetails: 1, inMap: 0, filterType: 'dropdown', parentValueFrom: null,},
        {attrName: 'form', title: 'Форма', inTable: 0, colSize: 1, inDetails: 1, inCards: 0, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'literature', title: 'Литература', inTable: 0, colSize: 1, inCards: 0, inDetails: 1, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'description', title: 'Описание', inTable: 0, colSize: 1, inCards: 0, inDetails: 0, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'type', title: 'Тип', inTable: 0, colSize: 1, inCards: 0, inDetails: 0, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'sketchfab', title: '3d', inTable: 0, colSize: 1, inCards: 0, inDetails: 1, inMap: 0, filterType: 'none', parentValueFrom: null,},
        {attrName: 'coordinates', title: 'Координаты', inTable: 0, colSize: 1, inCards: 0, inDetails: 0, inMap: 0, filterType: 'none', parentValueFrom: null,},
      ],
    }
  },
  computed: {

  },
  methods: {
    loadObjs() {
      try {
        this.inputGeojson = fromFile;
      } catch (e) {
        alert('Ошибка загрузки файла');
      }
      //привести все имена атрибутов к lower case
      this.inputGeojson.features = this.inputGeojson.features.map((v) => {
        return {
          type: v.type,
          properties: Object.fromEntries(Object.entries(v.properties).map(([key, value]) => {
            return [key.toLowerCase(), value]
          })),
          geometry: v.geometry,
        }
      });
    },
    initFiltersValues() {
      this.filtersValues = this.filters.map((item) => {
        return {attrName: item.attrName, type: item.type, value: null}
      });
    },
    setFiltersValues(v) {
      this.filtersValues = v;
    },
  },
  mounted() {
    this.loadObjs();
    this.initFiltersValues();
  },
}
</script>

<style lang="scss">

</style>
