<template>
<!--  {{ sortingValues }}-->
  <div class="ObjsSorting">
    <div class="sorting-block">
      <label for="sorting" class="label-placeholder">Сортировка: </label>
      <el-select id="sorting"
                 v-model="sortingValues.attrName"
                 placeholder="Select"
                 size="small"
                 style="width: 160px"
                 @change="onChangeSortingValues"
      >
        <el-option
            v-for="item of scheme.filter(v=>v.sortable === 1)"
            :value="item.attrName"
            :label="item.title"
        />
      </el-select>
    <el-radio-group
        v-model="sortingValues.direction"
        size="small"
    >
      <el-radio-button label="по возрастанию" value="asc" />
      <el-radio-button label="по убыванию" value="desc" />
    </el-radio-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ObjsSorting',
  components: {},
  props: {
    sortingValues: Object,
    scheme: Array,
  },
  emits: ['update:sortingValues', 'onChangeSortingValues'],
  data() {
    return {}
  },
  computed: {

  },
  methods: {
    onChangeSortingValues() {
      this.$emit('update:sortingValues');
      this.$emit('onChangeSortingValues');
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ObjsSorting {
  width: 100%;
  height: auto;
  padding: 10px;

  .sorting-block {
    width: 100%;
    //width: 270px;
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    gap: 5px;
    padding: 3px;

    .label-placeholder {
      width: 100px;
      height: auto;
    }

    .sorting-placeholder {
      width: 160px;
      height: auto;
    }
  }

  select {
    background-color: hsl(180, 100%, 25%, 0.08);
    width: 100%;
    cursor: pointer;
  }

}
</style>
