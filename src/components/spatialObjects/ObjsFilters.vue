<template>
  <div v-if="filtersValues.length>0" class="ObjsFilters" :class="{heightLimited: this.screen.type === 'xl'}">
    <div v-for="(filter, f) of filters" :key="f" class="filter-block">
      <div class="label-placeholder">
        <label for="filter_`${f}`">{{ filter.title }}: </label>
      </div>
      <div class="filter-placeholder">
        <template v-if="filter.type === 'input'">
          <input id="filter_`${f}`"
                 v-model="filtersValues[f].value"
                 :placeholder=filter.title.toLowerCase()
                 @change="onChangeFiltersValues"
                 @click="onChangeFiltersValues"
          >
        </template>
        <template v-if="filter.type === 'select'">
          <select id="filter_`${f}`"
                  v-model="filtersValues[f].value"
                  @change="onChangeFiltersValues">
            <option :value="null">
              (все)
            </option>
            <option v-for="(item, i) of valuesDependentOnParent(filter)" :value="item.value" :key="i">
              <template v-if="true">
                {{ item.value }}
              </template>
            </option>
          </select>
        </template>
      </div>
    </div>
  </div>

</template>

<script>

import {useScreen} from "@/composables/useScreen";
import {mapMutations, mapState} from "vuex";

export default {
  name: 'ObjsFilters',
  components: {},
  props: {
    filtersValues: Array,
    filters: Array,
  },
  emits: ['update:filtersValues', 'onChangeFiltersValues'],
  data() {
    return {
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
  },
  methods: {

    valuesDependentOnParent(f) {
      if (f.attrParent != null || this.filtersValues.filter((fV) => {if (fV.attrName === f.attrParent) {return fV} })?.[0]?.value === null) {
        let newListValues = f.listValues.filter((v) => {if (this.filtersValues.filter((fV) => { if (fV.attrName === f.attrParent) {return fV } })[0].value === v.parentValue) {return v}});
        let filterValue = this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })?.[0]?.value;
        //если текущее значение фильтра не null, но не попадает в диапазон допустимых значений из parent, то установить значение null
        if (filterValue != null) {
          if  (!newListValues.map((v)=>{return v.value}).includes(filterValue)) {this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })[0].value = null}
        }
        return newListValues != [] ? newListValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : null;
      } else {
        return f.listValues != [] ? f.listValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : null;
      }
    },

    onChangeFiltersValues() {
      this.$emit('update:filtersValues');
      this.$emit('onChangeFiltersValues');
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ObjsFilters {
  width: 100%;
  height: auto;
  padding: 10px;
  display: flex;
  flex-flow: column wrap;
  justify-content: start;
  &.heightLimited {
    height: 200px;
  };

  .filter-block {
    width: 270px;
    display: flex;
    flex-flow: row wrap;
    justify-content: left;
    padding: 3px;

    .label-placeholder {
      width: 100px;
      height: auto;
    }

    .filter-placeholder {
      width: 160px;
      height: auto;
    }
  }

  input, select {
    //width: 150px;
    background-color: hsl(180, 100%, 25%, 0.08);
    width: 100%;
    cursor: pointer;
  }

}

</style>
