<template>
    <div id="app">
        <app-header></app-header>
        <main><router-view /></main>
        <app-footer></app-footer>
    </div>
</template>
<script>
    import AppHeader from './components/Layout/header';
    import AppFooter from './components/Layout/footer';
    export default {
        name: 'app',
        components: {
            AppHeader,
            AppFooter
        }
    }
</script>
<style lang="scss">
    @import "./assets/materialize-css/sass/materialize";
    html, body {
        padding: 0;
        margin: 0;
        width: 100%;
        min-height: 100vh;
    }
    #app {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        flex: 0 0 0;

        main {
            flex-direction: column;
            width: 100%;
            flex: 1 0 auto;
            position: relative;
        }
    }
</style>
