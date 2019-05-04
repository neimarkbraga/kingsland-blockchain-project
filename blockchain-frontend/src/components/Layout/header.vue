<template>
    <header>
        <nav class="blue">
            <div class="container nav-wrapper">
                <router-link to="/" class="brand-logo">KS Project</router-link>
                <a href="#" data-target="mobile-sidenav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                <ul class="right hide-on-med-and-down">
                    <router-link tag="li" v-for="link in links" :to="link.path" :key="link.name">
                        <a>{{ link.name }}</a>
                    </router-link>
                </ul>
            </div>
        </nav>

        <ul class="sidenav" id="mobile-sidenav">
            <router-link tag="li" v-for="link in links" :to="link.path" :key="link.name">
                <a>{{ link.name }}</a>
            </router-link>
        </ul>
    </header>
</template>
<script>
    export default {
        data() {
            return {
                links: [
                    {name: 'Explorer', path: '/explorer'},
                    {name: 'Wallet', path: '/wallet'},
                    {name: 'Faucet', path: '/faucet'}
                ]
            }
        },
        created() {

        },
        methods: {

        },
        mounted() {
            $('.sidenav').sidenav();
        }
    }
</script>