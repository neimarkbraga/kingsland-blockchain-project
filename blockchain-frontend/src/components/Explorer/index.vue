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
            async submitSearch() {
                let vm = this;
                let status = vm.searchStatus;
                try {
                    status.searching = true;

                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/search`, {
                        params: {
                            keyword: vm.searchForm.keyword
                        }
                    });

                    switch(response.data.type) {
                    case 'address':
                        vm.$router.push({
                            name: 'addressDetails',
                            params: {
                                address: response.data.data.address
                            }
                        });
                        break;
                    case 'transaction':
                        vm.$router.push({
                            name: 'txDetails',
                            params: {
                                txhash: response.data.data.transactionDataHash
                            }
                        });
                        break;
                    case 'block':
                        vm.$router.push({
                            name: 'blockDetails',
                            params: {
                                index: response.data.data.index
                            }
                        });
                        break;
                    default:
                        status.error = 'You have entered an Invalid Search Key.';
                    }

                }
                catch (error) {
                    status.error = utils.getErrorMessage(error);
                }
                status.searching = false;
            }
        }
    }
</script>

