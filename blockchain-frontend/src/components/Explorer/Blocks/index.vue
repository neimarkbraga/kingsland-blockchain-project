<template>
    <div class="container">

        <!-- spacer -->
        <div style="height: 15px;"></div>

        <!-- breadcrumb -->
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link to="/explorer/blocks" class="breadcrumb dark">Blocks</router-link>
        </div>

        <!-- content -->
        <div class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    <span v-if="blocks.length">{{ blocks.length }} </span>
                    <span>Blocks</span>
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
                                        @click.prevent="loadBlocks"
                                        class="btn">
                                    Reload
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ready -->
                    <div v-else>
                        <table class="responsive-table striped">
                            <thead>
                            <tr>
                                <th>Height</th>
                                <th>Age</th>
                                <th>Txn</th>
                                <th>Hash</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(block, index) in blocks"
                                    v-if="index < showCount"
                                    :key="index">
                                    <td>{{ block.index }}</td>
                                    <td>{{ block.age }}</td>
                                    <td>{{ block.transactions.length }}</td>
                                    <td>{{ block.blockHash }}</td>
                                    <td>
                                        <router-link :to="'/explorer/blocks/' + block.index"
                                                     class="btn btn-small">
                                            View Details
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="center-align" style="padding-top: 2em">
                            <button type="button"
                                    v-if="blocks.length > showCount"
                                    @click.prevent="showCount += 10"
                                    class="btn">
                                Load More
                            </button>
                        </div>
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
                showCount: 10,
                blocks: [],
                status: {
                    loading: true,
                    error: ''
                }
            }
        },
        methods: {
            async loadBlocks() {
                let vm = this;
                try {
                    let url = window.APP_CONFIG.blockchain_node_url;
                    vm.status.loading = true;
                    vm.status.error = '';

                    let response = await axios.get(`${url}/blocks`);
                    let data = response.data;
                    vm.blocks = data.reverse().map(block => {
                        block.age = timeago.format(block.dateCreated);
                        return block;
                    });
                }
                catch (error) {
                    vm.status.error = utils.getErrorMessage(error);
                }
                vm.status.loading = false;
            }
        },
        created() {
            this.loadBlocks();
        }
    }
</script>