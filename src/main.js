import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/router.js'
import store from '@/store/mainStore.js'
import "bootstrap/dist/js/bootstrap.js"
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
// createApp(App).mount('#app')


const app = createApp(App)
app
    .use(router)
    .use(store)
    .use(OpenLayersMap)
    .mount('#app')
