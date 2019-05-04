<template>
<div>
    <div class="row">
        <div class="col s12">
            <h1 class="center-align">Block Explorer</h1>
        </div>
    </div>

    <div class="row">
        <div class="input-field col s5 offset-s3">
            <input id="search" type="text" class="validate">
            <label for="search">Enter Address, Transaction, Block</label>
        </div>

        <div class="col">
            <button class="waves-effect waves-light btn-large blue">
                <i class="material-icons right">search</i>
                Search
            </button>
        </div>
    </div>

    <div class="row">
        <div class="col offset-s3">
            <router-link to="/explorer/blocks">
                <button class="waves-effect waves-light btn-large blue">
                    Blocks
                </button>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{name: 'confirmed'}">
                <button class="waves-effect waves-light btn-large blue">
                    Confirmed Transactions
                </button>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{name: 'pending'}">
                <button class="waves-effect waves-light btn-large blue">
                    Pending Transactions
                </button>
            </router-link>
        </div>
    </div>
</div>
</template>

<style scoped>

</style>

<script>
export default {
    name: "Explorer",
    methods: {

    }
}
</script>

