<template>
<!--  {{ sortingValues }}-->
  <div class="ObjsSorting">
    <div class="sorting-block">
      <label for="sorting" class="label-placeholder">Сортировка: </label>
      <select
        id="sorting"
        class="sorting-placeholder"
        v-model="sortingValues.attrName"
        @change="onChangeSortingValues"
      >
        <option
            v-for="item of scheme.filter(v=>v.sortable === 1)"
            :value="item.attrName"
        >
          {{ item.title }}
        </option>
      </select>

    </div>
  </div>
  <div class radio-block>
    <input type="radio" id="asc"
           value="asc"
           v-model="sortingValues.direction"
           @change="onChangeSortingValues"
    />
    <label for="asc">по возрастанию</label>

    <input type="radio" id="desc"
           value="desc"
           v-model="sortingValues.direction"
           @change="onChangeSortingValues"
    />
    <label for="desc">по убыванию</label>

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
    width: 270px;
    display: flex;
    flex-flow: row wrap;
    justify-content: left;
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
