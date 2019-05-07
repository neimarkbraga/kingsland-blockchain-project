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
            path: '/faucet',
            component: resolve => {
                require.ensure(['@/components/Faucet/index.vue'], () => {
                    resolve(require('@/components/Faucet/index.vue'));
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
            path: '/explorer',
            component: resolve => {
                require.ensure(['@/components/Explorer/index.vue'], () => {
                    resolve(require('@/components/Explorer/index.vue'));
                });
            }
        },
        {
            name: 'confirmed',
            path: '/explorer/transactions/confirmed',
            component: resolve => {
                require.ensure(['@/components/Explorer/Transactions/confirmed.vue'], () => {
                    resolve(require('@/components/Explorer/Transactions/confirmed.vue'));
                });
            }
        },
        {
            name: 'pending',
            path: '/explorer/transactions/pending',
            component: resolve => {
                require.ensure(['@/components/Explorer/Transactions/pending.vue'], () => {
                    resolve(require('@/components/Explorer/Transactions/pending.vue'));
                });
            }
        },
        {
            name: 'txDetails',
            path: '/explorer/transactions/:txhash',
            component: resolve => {
                require.ensure(['@/components/Explorer/Transactions/details.vue'], () => {
                    resolve(require('@/components/Explorer/Transactions/details.vue'));
                });
            }
        },
        {
            path: '/explorer/blocks',
            component: resolve => {
                require.ensure(['@/components/Explorer/Blocks/index.vue'], () => {
                    resolve(require('@/components/Explorer/Blocks/index.vue'));
                });
            }
        },
        {
            name: 'blockDetails',
            path: '/explorer/blocks/:index',
            component: resolve => {
                require.ensure(['@/components/Explorer/Blocks/details.vue'], () => {
                    resolve(require('@/components/Explorer/Blocks/details.vue'));
                });
            }
        },
        {
            name: 'address',
            path: '/explorer/address/',
            component: resolve => {
                require.ensure(['@/components/Explorer/Address/index.vue'], () => {
                    resolve(require('@/components/Explorer/Address/index.vue'));
                });
            }
        },
        {
            name: 'addressDetails',
            path: '/explorer/address/:address',
            component: resolve => {
                require.ensure(['@/components/Explorer/Address/details.vue'], () => {
                    resolve(require('@/components/Explorer/Address/details.vue'));
                });
            }
        },
        {
            name: 'network',
            path: '/explorer/network',
            component: resolve => {
                require.ensure(['@/components/Explorer/Network/index.vue'], () => {
                    resolve(require('@/components/Explorer/Network/index.vue'));
                });
            }
        },
        {
            path: '/explorer/peers',
            component: resolve => {
                require.ensure(['@/components/Explorer/Peers/index.vue'], () => {
                    resolve(require('@/components/Explorer/Peers/index.vue'));
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