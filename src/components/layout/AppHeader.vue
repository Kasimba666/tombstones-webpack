<template>
  <div class="AppHeader">
<!--    <button type="button"-->
<!--            class="btn btn-outline-secondary obj-button active"-->
<!--            @click="$router.push({name: 'ObjsFiltersAndList'})"-->
<!--    >-->
<!--      Памятники эпиграфики Республики Татарстан XIV-XVIIвв.-->
<!--    </button>-->
    <div class="my-title"
         @click="$router.push({name: 'ObjsFiltersAndList'})"
    >
      Памятники эпиграфики Республики Татарстан XIV-XVIIвв.
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
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
.AppHeader {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    padding: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    opacity: 80%;
    background-image: url("@/assets/img/headers/Header_2023_05_10_Yamashurma_3_front_ortho_id31.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: repeat-x;
  &:hover {
    box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
  }
  .my-title {
    position: relative;
    width: auto;
    height: auto;
    background-color: hsl(206, 11%, 56%);
    opacity: 80%;
    color: white;
    text-align: center;
    font-size: 24px;
    padding: 5px 12px;
    border-radius: 5px;
  }
  .obj-button {
    opacity: 80%;
    font-size: x-large;
  }
}
</style>
