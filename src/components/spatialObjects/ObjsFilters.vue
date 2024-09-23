<template>
  <div class="ObjsFilters" v-if="filtersValues.length>0" :class="{heightLimited: this.screen.type === 'xl'}">
    <div v-for="(filter, f) of filters" :key="f" class="filter-block">
      <div class="label-placeholder">
        <label for="filter_`${f}`">{{ filter.title }}: </label>
      </div>
      <div class="filter-placeholder">
        <template v-if="filter.type === 'input'">
          <el-input id="filter_`${f}`"
              v-model="filtersValues[f].value"
              style="width: 160px"
              size="small"
              @change="onChangeFiltersValues"
              @input="onChangeFiltersValues"
          />
        </template>
        <template v-if="filter.type === 'select'">
          <el-select id="filter_`${f}`"
              v-model="filtersValues[f].value"
              placeholder="Select"
              size="small"
              style="width: 160px"
              @change="onChangeFiltersValues"
          >
            <el-option
                key="all"
                label="(все)"
                value="all"
            >
              (все)
            </el-option>
            <el-option
                v-for="(item, i) of valuesDependentOnParent(filter)"
                :key="i"
                :label="item.value"
                :value="item.value"
            />
          </el-select>
        </template>
        <template v-if="filter.type === 'range'">
<!--          {{filter.listValues[0]}}-{{filter.listValues[1]}} : {{filtersValues[f].value.notNull}} {{filtersValues[f].value.range}}-->
            <el-checkbox v-model="filtersValues[f].value.notNull" label="учитывать" size="small" @change="onChangeFiltersValues"/>
          <div class="input-items">
              <div>
                <el-input-number
                    v-model="filtersValues[f].value.range[0]"
                    style="width: 80px"
                    size="small"
                    controls-position="right"
                    :min="filter.listValues[0]"
                    :max="filter.listValues[1]"
                    :disabled="!filtersValues[f].value.notNull"
                    @change="onChangeFiltersValues"
                />
                <el-input-number
                    v-model="filtersValues[f].value.range[1]"
                    style="width: 80px"
                    size="small"
                    controls-position="right"
                    :min="filter.listValues[0]"
                    :max="filter.listValues[1]"
                    :disabled="!filtersValues[f].value.notNull"
                    @change="onChangeFiltersValues"
                />
              </div>
          <el-slider
              v-model="filtersValues[f].value.range"
              range
              size="small"
              :min="filter.listValues[0]"
              :max="filter.listValues[1]"
              :disabled="!filtersValues[f].value.notNull"
              @change="onChangeFiltersValues"
          />
          </div>
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
      if (f.attrParent != null || this.filtersValues.filter((fV) => {if (fV.attrName === f.attrParent) {return fV} })?.[0]?.value === 'all') {
        let newListValues = f.listValues.filter((v) => {if (this.filtersValues.filter((fV) => { if (fV.attrName === f.attrParent) {return fV } })[0].value === v.parentValue) {return v}});
        let filterValue = this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })?.[0]?.value;
        //если текущее значение фильтра не null, но не попадает в диапазон допустимых значений из parent, то установить значение null
        if (filterValue != 'all') {
          if  (!newListValues.map((v)=>{return v.value}).includes(filterValue)) {this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })[0].value = 'all'}
        }
        return newListValues != [] ? newListValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : 'all';
      } else {
        return f.listValues != [] ? f.listValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : 'all';
      }
    },
    // valuesDependentOnParent(f) {
    //   if (f.attrParent != null || this.filtersValues.filter((fV) => {if (fV.attrName === f.attrParent) {return fV} })?.[0]?.value === null) {
    //     let newListValues = f.listValues.filter((v) => {if (this.filtersValues.filter((fV) => { if (fV.attrName === f.attrParent) {return fV } })[0].value === v.parentValue) {return v}});
    //     let filterValue = this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })?.[0]?.value;
    //     //если текущее значение фильтра не null, но не попадает в диапазон допустимых значений из parent, то установить значение null
    //     if (filterValue != null) {
    //       if  (!newListValues.map((v)=>{return v.value}).includes(filterValue)) {this.filtersValues.filter((fV) => {if (fV.attrName === f.attrName) {return fV} })[0].value = null}
    //     }
    //     return newListValues != [] ? newListValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : null;
    //   } else {
    //     return f.listValues != [] ? f.listValues.sort((a, b) => a['value'] > b['value'] ? 1 : -1) : null;
    //   }
    // },

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
  padding: 5px;
  display: flex;
  flex-flow: column wrap;
  justify-content: start;

  &.heightLimited {
    height: 280px;
  };

  .filter-block {
    width: 270px;
    display: flex;
    flex-flow: row wrap;
    justify-content: left;
    gap: 5px;
    padding: 3px;

    .label-placeholder {
      width: 90px;
      height: auto;
      text-align: left;
      //margin-right: 10px;
    }

    .filter-placeholder {
      width: 160px;
      height: auto;
    }
  }

  //input, select {
  //  //width: 150px;
  //  background-color: hsl(180, 100%, 25%, 0.08);
  //  width: 100%;
  //  cursor: pointer;
  //}

}

</style>
