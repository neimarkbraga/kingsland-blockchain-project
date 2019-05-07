<template>
    <div>
        <div class="container">
            <!-- title -->
            <h1 class="center-align">Block Explorer</h1>

            <!-- search form -->
            <form @submit.prevent="submitSearch">
                <div class="row" style="display: flex;">
                    <div class="col" style="flex: 1 0 auto;">
                        <div class="input-field">
                            <input id="search"
                                   v-model="searchForm.keyword"
                                   type="text"
                                   @input="searchStatus.error = ''"
                                   :class="searchStatus.error? 'invalid' : ''">
                            <label for="search">Enter Address, Transaction, Block</label>
                            <span v-if="searchStatus.error" class="helper-text" :data-error="searchStatus.error"></span>
                        </div>
                    </div>
                    <div class="col">
                        <p v-if="searchStatus.searching" class="grey-text">Searching...</p>
                        <button v-else
                                type="submit"
                                class="waves-effect waves-light btn-large blue">
                            <i class="material-icons right">search</i>
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </form>

            <!-- links -->
            <div class="row">
                <div class="col s6">
                    <router-link to="/explorer/blocks" class="waves-effect waves-light btn-large blue w-100">
                        Blocks
                    </router-link>
                </div>
                <div class="col s6">
                    <router-link :to="{name: 'confirmed'}" class="waves-effect waves-light btn-large blue w-100">
                        Confirmed Transactions
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <router-link :to="{name: 'network'}" class="waves-effect waves-light btn-large blue w-100">
                        Network Information
                    </router-link>
                </div>
                <div class="col s6">
                    <router-link :to="{name: 'pending'}" class="waves-effect waves-light btn-large blue w-100">
                        Pending Transactions
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <router-link :to="{name: 'address'}" class="waves-effect waves-light btn-large blue w-100">
                        Addresses
                    </router-link>
                </div>
                <div class="col s6">
                    <router-link to="/explorer/peers" class="waves-effect waves-light btn-large blue w-100">
                        Peers
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script>
    import axios from 'axios';
    import utils from '../../library/utils';

    export default {
        name: "Explorer",
        data() {
            return {
                searchStatus: {
                    searching: false,
                    error: ''
                },
                searchForm: {
                    keyword: ''
                }
            };
        },
        methods: {
            submitSearch() {
                let vm = this;
                let status = vm.searchStatus;
                try {
                    status.searching = true;
                    status.error = 'This feature is not yet ready.';
                    // code for search
                }
                catch (error) {
                    status.error = utils.getErrorMessage(error);
                }
                status.searching = false;
            }
        }
    }
</script>

