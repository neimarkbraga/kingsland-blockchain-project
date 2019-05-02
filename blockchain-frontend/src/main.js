import './assets/jquery/dist/jquery';
import './assets/materialize-css/dist/js/materialize';
import Vue from 'vue'
import App from './App.vue'
import router from './router';

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
