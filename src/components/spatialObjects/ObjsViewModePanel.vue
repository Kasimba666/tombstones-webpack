<template>
  <div class="viewModePanel">
    <button type="button" class="btn btn-outline-primary btn-sm"
        v-for="mode in allViewModes" key="mode"
        :class="{active: mode === currentViewMode}"
        @click="setViewMode(mode)"
            >
      {{ mode === 'list' ? 'Список' : 'Карта'}}
    </button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {allViewModes: Array, currentViewMode: String},
  emits: ['setViewMode'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    setViewMode(v) {
      this.$emit('setViewMode', v);
    }
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.viewModePanel {
  position: relative;
  width: 100%;
  height: auto;
  min-width: 50px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 3px;
  flex: 1 1 auto;
  padding: 3px;
  .btn {
    color: black;
    border-color: gray;
  }
}
</style>
