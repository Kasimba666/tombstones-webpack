<template>
  <div class="AppBody">
    <router-view v-slot="{Component}">
                <keep-alive>
      <component :is="Component" />
                </keep-alive>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'AppBody',
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
}
</script>

<style lang="scss">
  .AppBody {
    width: 100%;
    height: auto;
  }
</style>
