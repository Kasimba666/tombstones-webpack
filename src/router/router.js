import {createRouter, createWebHistory} from 'vue-router';
import PgStones from '@/views/PgStones.vue';
// import PgSettlements from '@/views/PgSettlements.vue';
import PgAbout from '@/views/PgAbout.vue';
import ObjDetails from '@/components/spatialObjects/ObjDetails.vue';
import ObjsFiltersAndList from '@/components/spatialObjects/ObjsFiltersAndList.vue';

const routes = [
    {
        name: 'PgStones',
        path: '/stones',
        component: PgStones,
        children: [
            {
                name: 'ObjDetails',
                path: 'details/:id?',
                component: ObjDetails,
            },
            {
                name: 'ObjsFiltersAndList',
                path: 'list',
                component: ObjsFiltersAndList,
            },
        ],
    },
    {
        path: '/',
        redirect: {name: 'PgStones'},
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
