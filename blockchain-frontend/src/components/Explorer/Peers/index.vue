<template>
    <div class="container">

        <!-- spacer -->
        <div style="height: 15px;"></div>

        <!-- breadcrumb -->
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link to="/explorer/peers" class="breadcrumb dark">Peers</router-link>
        </div>

        <!-- peers -->
        <div class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    <b>Peers</b>
                </div>

                <!-- loading peers -->
                <div v-if="status.gettingPeers" class="progress">
                    <div class="indeterminate"></div>
                </div>

                <!-- peers loaded -->
                <div v-else>

                    <!-- peers error -->
                    <div v-if="status.gettingPeersError">

                        <div class="p-4 center red-text">
                            <h4 class="m-0">Error</h4>
                            <p class="m-0">{{ status.gettingPeersError }}</p>
                            <div class="pt-3">
                                <button type="button"
                                        @click.prevent="loadPeers"
                                        class="btn">
                                    Reload
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ready -->
                    <div v-else>
                        <table v-if="hasPeers" class="truncated-table striped centered">
                            <thead>
                                <tr>
                                    <th>Node ID</th>
                                    <th>Url</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(url, id) in peers" :key="id">
                                    <td>{{ id }}</td>
                                    <td>{{ url }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    <b>Connect to peer</b>
                </div>

                <!-- connect form -->
                <form @submit.prevent="connectPeer" class="pt-4">
                    <fieldset :disabled="status.connectingPeer" style="border: none;">
                        <div class="input-field">
                            <input type="url"
                                   v-model="connectPeerForm.peerUrl"
                                   required>
                            <label>Enter Peer Url</label>
                        </div>

                        <div v-if="status.connectPeerError" class="card red white-text">
                            <div class="p-2">
                                <span>{{ status.connectPeerError }}</span>
                                <a href="#"
                                   @click.prevent="status.connectPeerError = ''"
                                   class="right white-text">Hide</a>
                            </div>
                        </div>

                        <div v-if="status.connectPeerSuccess" class="card green white-text">
                            <div class="p-2">
                                <span>{{ status.connectPeerSuccess }}</span>
                                <a href="#"
                                   @click.prevent="status.connectPeerSuccess = ''"
                                   class="right white-text">Hide</a>
                            </div>
                        </div>

                        <div class="right-align">
                            <button type="submit" class="btn">
                                <span v-if="status.connectingPeer">Connecting</span>
                                <span v-else>Connect</span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
    import axios from 'axios';
    import utils from '../../../library/utils';

    export default {
        data() {
            return {
                peers: {},
                status: {
                    gettingPeers: false,
                    gettingPeersError: '',  // aka get peers error message

                    connectingPeer: false,
                    connectPeerError: '',   // aka connect peer error message
                    connectPeerSuccess: ''  // aka connect peer success message
                },
                connectPeerForm: {
                    peerUrl: ''
                }
            };
        },
        computed: {
            hasPeers() {
                return Object.keys(this.peers).length > 0;
            }
        },
        methods: {
            async loadPeers() {
                let vm = this;
                try {
                    let url = window.APP_CONFIG.blockchain_node_url;
                    vm.status.gettingPeers = true;
                    vm.status.gettingPeersError = '';

                    let response = await axios.get(`${url}/peers`);
                    vm.peers = response.data;
                }
                catch(error) {
                    vm.status.gettingPeersError = utils.getErrorMessage(error);
                }
                vm.status.gettingPeers = false;
            },
            async connectPeer() {
                let vm = this;
                try {
                    let url = window.APP_CONFIG.blockchain_node_url;
                    vm.status.connectingPeer = true;
                    vm.status.connectPeerError = '';
                    vm.status.connectPeerSuccess = '';

                    let response = await axios.post(`${url}/peers/connect`, vm.connectPeerForm);
                    let data = response.data;
                    vm.status.connectPeerSuccess = data.message || 'Connect success!';
                    vm.loadPeers();
                    vm.connectPeerForm.peerUrl = '';
                    window.M.updateTextFields();
                }
                catch(error) {
                    vm.status.connectPeerError = utils.getErrorMessage(error);
                }
                vm.status.connectingPeer = false;
            }
        },
        mounted() {
            window.M.updateTextFields();
        },
        created() {
          this.loadPeers();
        }
    }
</script>

