import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);



let router = new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            component: resolve => {
                require.ensure(['@/components/Home/index.vue'], () => {
                    resolve(require('@/components/Home/index.vue'));
                });
            }
        },
        {
            path: '/test',
            component: resolve => {
                require.ensure(['@/components/Home/test.vue'], () => {
                    resolve(require('@/components/Home/test.vue'));
                });
            }
        },
        {
            path: '/wallet',
            component: resolve => {
                require.ensure(['@/components/Wallet/index.vue'], () => {
                    resolve(require('@/components/Wallet/index.vue'));
                });
            }
        },
        {
            path: '*',
            component: resolve => {
                require.ensure(['@/components/Errors/page_not_found.vue'], () => {
                    resolve(require('@/components/Errors/page_not_found.vue'));
                });
            }
        }
    ]
});
export default router;