<template>
  <div class="nav-buttons title-image-background">
    <button type="button"
            class="btn btn-outline-secondary obj-button"
            :class="{active: $route.path === '/stones'}"
            @click="$router.push('/stones')"
    >
      Памятники эпиграфики Республики Татарстан XIV-XVIIвв.
    </button>

<!--    <button type="button"-->
<!--            class="btn btn-outline-secondary"-->
<!--            :class="{active: $route.path === '/settlements'}"-->
<!--            @click="$router.push('/settlements');"-->
<!--    >-->
<!--      Болгарские городища-->
<!--    </button>-->
    <button type="button"
            class="btn btn-outline-secondary"
            :class="{active: $route.path === '/about'}"
            @click="$router.push('/about');"
    >
      О нас
    </button>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      titleImg: '',
    }
  },
  computed: {},
  methods: {
    init() {
      this.titleImg = "@/assets/img/headers/Header_2023_05_10_Yamashurma_3_front_ortho_id31.jpg"
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style lang="scss">
.nav-buttons {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  gap: 10px;
  border: 3px solid gray;
  padding: 5px;
  margin: auto;
}
.obj-button {
  opacity: 80%;
  font-size: x-large;
}
.title-image-background {
  flex: 0 0 auto;
  width: auto;
  height: 100%;
  opacity: 80%;
  background-image: url("@/assets/img/headers/Header_2023_05_10_Yamashurma_3_front_ortho_id31.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: repeat-x;

  &:hover {
    box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
  }
}

</style>
