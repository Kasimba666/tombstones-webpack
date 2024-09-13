import {createRouter, createWebHistory} from 'vue-router';
import PgStones from '@/views/PgStones.vue';
// import PgSettlements from '@/views/PgSettlements.vue';
import PgAbout from '@/views/PgAbout.vue';
import ObjDetails from '@/components/spatialObjects/ObjDetails.vue';
import ObjsFiltersAndList from '@/components/spatialObjects/ObjsFiltersAndList.vue';

const routes = [
    {
        name: 'ObjsFiltersAndList',
        path: '/list',
        component: ObjsFiltersAndList,
    },
    {
        name: 'ObjDetails',
        path: '/details/:id?',
        component: ObjDetails,
    },
    // {
    //     name: 'PgStones',
    //     path: '/stones',
    //     component: PgStones,
    //     children: [
    //     ],
    // },
    {
        path: '/',
        redirect: {name: 'ObjsFiltersAndList'},
    },
    // {
    //     name: 'PgSettlements',
    //     path: '/settlements',
    //     component: PgSettlements,
    // },
    {
        name: 'PgAbout',
        path: '/about',
        component: PgAbout,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
});

export default router;
