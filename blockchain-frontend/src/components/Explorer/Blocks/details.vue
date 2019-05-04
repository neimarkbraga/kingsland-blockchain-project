<template>
    <div class="container">

        <!-- spacer -->
        <div style="height: 15px;"></div>

        <!-- breadcrumb -->
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link to="/explorer/blocks" class="breadcrumb dark">Blocks</router-link>
            <router-link :to="'/explorer/blocks/' + $route.params.index" class="breadcrumb dark">{{ $route.params.index }}</router-link>
        </div>

        <!-- content -->
        <div class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    Block {{ $route.params.index }}
                </div>

                <!-- loading -->
                <div v-if="status.loading" class="progress">
                    <div class="indeterminate"></div>
                </div>

                <!-- loaded -->
                <div v-else>

                    <!-- error -->
                    <div v-if="status.error">
                        <div style="height: 1em"></div>
                        <div class="card red center-align">
                            <div class="card-content white-text">
                                <span class="card-title">Error</span>
                                <p>{{ status.error }}</p>
                            </div>
                            <div class="card-action">
                                <button type="button"
                                        @click.prevent="loadDetails"
                                        class="btn">
                                    Reload
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ready -->
                    <div v-else>
                        <table class="responsive-table striped">
                            <tbody>
                                <tr>
                                    <th>Height</th>
                                    <td>{{ block.index }}</td>
                                </tr>
                                <tr>
                                    <th>Transactions</th>
                                    <td>{{ block.transactions.length }}</td>
                                </tr>
                                <tr>
                                    <th>Difficulty</th>
                                    <td>{{ block.difficulty }}</td>
                                </tr>
                                <tr>
                                    <th>Mined By</th>
                                    <td>{{ block.minedBy }}</td>
                                </tr>
                                <tr>
                                    <th>Block Hash</th>
                                    <td>{{ block.blockHash }}</td>
                                </tr>
                                <tr>
                                    <th>Previous Block Hash</th>
                                    <td>{{ block.prevBlockHash }}</td>
                                </tr>
                                <tr>
                                    <th>Block Data Hash</th>
                                    <td>{{ block.blockDataHash }}</td>
                                </tr>
                                <tr>
                                    <th>Date Created</th>
                                    <td>
                                        <span>{{ block.dateCreated }} </span>
                                        <span class="grey-text">({{ block.age }})</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Nonce</th>
                                    <td>{{ block.nonce }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- spacer -->
        <div style="height: 50px;"></div>
    </div>
</template>
<script>
    const timeago = require('timeago.js');
    import axios from 'axios';
    import utils from '../../../library/utils';

    export default {
        data() {
            return {
                block: null,
                status: {
                    loading: true,
                    error: ''
                }
            }
        },
        methods: {
            async loadDetails() {
                let vm = this;
                try {
                    let url = window.APP_CONFIG.blockchain_node_url;
                    vm.status.loading = true;
                    vm.status.error = '';

                    let response = await axios.get(`${url}/blocks/${vm.$route.params.index}`);
                    vm.block = response.data;
                    vm.block.age = timeago.format(vm.block.dateCreated);
                }
                catch (error) {
                    vm.status.error = utils.getErrorMessage(error);
                }
                vm.status.loading = false;
            }
        },
        created() {
            if(/^\d+$/.test(this.$route.params.index)) this.loadDetails();
            else this.$router.push('/explorer/blocks');
        }
    }
</script>