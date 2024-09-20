import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/router.js'
import store from '@/store/mainStore.js'
import "bootstrap/dist/js/bootstrap.js"
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// createApp(App).mount('#app')


const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app
    .use(router)
    .use(store)
    .use(ElementPlus)
    .use(OpenLayersMap)
    .mount('#app')
