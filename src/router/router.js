import {createRouter, createWebHistory} from 'vue-router';
import PgAbout from '@/views/PgAbout.vue';
import ObjsDetails from '@/components/spatialObjects/ObjsDetails.vue';
import ObjsFiltersAndList from '@/components/spatialObjects/ObjsFiltersAndList.vue';

const routes = [
    {
        name: 'ObjsFiltersAndList',
        path: '/list',
        component: ObjsFiltersAndList,
    },
    {
        name: 'ObjsDetails',
        path: '/details/:id?',
        component: ObjsDetails,
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
