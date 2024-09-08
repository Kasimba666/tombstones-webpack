import {createRouter, createWebHistory} from 'vue-router';
import PgStones from '@/views/PgStones.vue';
// import PgSettlements from '@/views/PgSettlements.vue';
import PgAbout from '@/views/PgAbout.vue';
import ObjDetails from '@/components/spatialObjects/ObjDetails.vue';


const routes = [
    {
        name: 'PgStones',
        path: '/stones',
        component: PgStones,
        children: [
            {
            name: 'ObjDetails',
            // path: ':id?',
            path: 'details/:id?',
            component: ObjDetails,

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
router.beforeEach((to, from) => {
    // console.log('from', from.path.toString());
    // console.log('to', to.path.toString());

    // if (true) {
    //     return ({name: 'Pg404'});
    // }
});
export default router;
