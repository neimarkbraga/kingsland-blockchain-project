<template>
    <header>
        <nav class="blue">
            <div class="container nav-wrapper">
                <router-link to="/" class="brand-logo">KS Project</router-link>
                <a href="#" data-target="mobile-sidenav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                <ul class="right hide-on-med-and-down">
                    <li v-for="link in links">
                        <router-link :to="link.path">{{ link.name }}</router-link>
                    </li>
                </ul>
            </div>
        </nav>

        <ul class="sidenav" id="mobile-sidenav">
            <li v-for="link in links">
                <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
        </ul>
    </header>
</template>
<script>
    export default {
        data() {
            return {
                links: [
                    {name: 'Wallet', path: '/wallet'},
                    {name: 'Explorer', path: '/explorer'}
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