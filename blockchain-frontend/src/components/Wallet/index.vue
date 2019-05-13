<template>
    <div class="container">
        <div class="row" v-if="wallets.length !== 0">
            <div class="col s4 offset-s4">
                <div class="card wallet-container">
                    <div v-if="selectedWallet" class="card-content">
                        <div class="card-title">
                            <b @click.prevent="renameSelectedWallet()">
                                <i>{{ selectedWallet.name }}</i>
                            </b>

                            <a @click="removeSelectedWallet()">
                                <i class="black-text material-icons right">close</i>
                            </a>
                            <a class='dropdown-trigger' data-target='wallet-list'>
                                <i class="black-text material-icons right">expand_more</i>
                            </a>

                            <a href="#show-keys" class="modal-trigger center">
                                <i class="black-text material-icons right">info_outline</i>
                            </a>

                            <!-- Dropdown Structure -->
                            <ul id='wallet-list' class='dropdown-content'>
                                <li >
                                    <a class="black-text"><b>My Wallets:</b></a>
                                </li>
                                <li v-for="wallet in wallets" :key="wallet.privateKey">
                                    <a @click.prevent="selectWallet(wallet)">
                                        <span><i>{{ wallet.name }}</i></span>
                                    </a>
                                </li>
                                <li class="divider" tabindex="-1"></li>
                                <li class="center">
                                    <a class="modal-trigger center" href="#create-wallet">
                                        Create New Wallet
                                    </a>
                                </li>
                                <li class="center">
                                    <a class="modal-trigger center" href="#load-wallet">
                                        Load Existing Wallet
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div v-if="isLoadingBalances" class="center-align p-4">
                            <div style="display: inline-block">
                                <div class="preloader-wrapper small active">
                                    <div class="spinner-layer spinner-blue-only">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else>

                            <div v-if="balancesErrorMessage" class="p-4 center-align">
                                <p class="mb-2 red-text">{{ balancesErrorMessage }}</p>
                                <button type="button"
                                        @click.prevent="loadBalance"
                                        class="btn btn-small">
                                    Reload
                                </button>
                            </div>

                            <div v-else>
                                <i>{{ selectedWallet.address }}</i>
                                <div class="row">
                                    <h4 class="center">
                                        {{ confirmedBalance }} <span>&micro;</span>Coins
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div class="row button-container center">
                            <div class="col">
                                <a @click.prevent="loadBalance" href="#show-balance" class="modal-trigger waves-effect waves-light btn-large blue">
                                    Balance
                                    <i class="material-icons right">attach_money</i>
                                </a>
                            </div>
                            <div class="col">
                                <a href="#send-transaction" class="modal-trigger waves-effect waves-light btn-large blue">
                                    Send
                                    <i class="material-icons right">send</i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <wallet-info-modal id="show-keys" :privateKey="selectedWallet.privateKey"
                                              :publicKey="selectedWallet.publicKey"
                                              :address="selectedWallet.address"/>


            <balance-modal id="show-balance" :confirmed="confirmedBalance"
                                             :pending="pendingBalance"
                                             :safe="safeBalance" />
        </div>

        <!-- No Wallets Loaded - Landing Page -->
        <div class="row" v-else>
            <div class="col s6 offset-s3">
                <div class="card wallet-container">
                    <div class="card-content">
                        <div class="card-title">
                            <b>Microcoin Wallets</b>
                        </div>
                        <div id="button-container" class="row">
                            <div class="col">
                                <a class="waves-effect waves-light btn-large blue modal-trigger" href="#create-wallet">
                                    Create New Wallet
                                    <i class="material-icons right">create</i>
                                </a>
                            </div>
                            <div class="col">
                                <a class="waves-effect waves-light btn-large blue modal-trigger" href="#load-wallet">
                                    Load Existing Wallet
                                    <i class="material-icons right">cloud_upload</i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Components -->
        <create-modal id="create-wallet" :wallets="wallets" @newWallet="addWallet" />
        <load-modal   id="load-wallet"   :wallets="wallets" @loadWallet="addWallet"/>
        <send-modal   id="send-transaction" v-if ="selectedWallet"
                                         :privateKey="selectedWallet.privateKey"
                                         :publicKey="selectedWallet.publicKey"
                                         :address="selectedWallet.address"/>

    </div>
</template>

<style scoped>

    .wallet-container {
        margin: 0;
        position: absolute;
        top: 30%;
    }

    .button-container {
        margin-top: 3vh
    }

    .modal {
        width: 60% !important;
        min-width: 500px;
    }

    #wallet-list {
        width: 250px;
    }

</style>

<script>
    const axios = require('axios');

    import utils from '../../library/utils';
    import BalanceModal from './balance-modal';
    import CreateModal from './create-modal';
    import LoadModal   from './load-modal';
    import SendModal   from './send-modal';
    import WalletInfoModal   from './wallet-info-modal';

    export default {
        components: {
            BalanceModal,
            CreateModal,
            LoadModal,
            SendModal,
            WalletInfoModal
        },
        data() {
            return {
                wallets: [],
                selectedWallet: null,
                node: window.APP_CONFIG.blockchain_node_url,

                // balances
                isLoadingBalances: false,
                balancesErrorMessage: '',
                balancesCancelToken: axios.CancelToken.source(),
                safeBalance: 0,
                confirmedBalance: 0,
                pendingBalance: 0,

                // transactions
                isLoading: false,
                transactions: [],
            }
        },
        methods: {
            selectWallet(wallet) {
                this.selectedWallet = wallet;
                window.localStorage.setItem('selectedWalletIndex', JSON.stringify(this.wallets.indexOf(wallet)));
            },
            saveWallets() {
                window.localStorage.setItem('wallets', JSON.stringify(this.wallets));
            },
            addWallet(wallet) {
                this.wallets.push(wallet);
                this.saveWallets();
                this.selectWallet(wallet);
            },
            loadWallets() {
                try {
                    let wallets = JSON.parse(window.localStorage.getItem('wallets'));
                    let index = JSON.parse(window.localStorage.getItem('selectedWalletIndex'));
                    if(Array.isArray(wallets)) {
                        this.wallets = wallets;
                        let selectedWallet = this.wallets[index];
                        if(selectedWallet) this.selectWallet(selectedWallet);

                    }
                    else this.wallets = [];
                }
                catch(error) {
                    this.wallets = [];
                }
            },
            loadBalance() {
                let vm = this;
                vm.balancesCancelToken.cancel();

                // set timeout to finish cancel task
                setTimeout(async () => {
                    try {
                        vm.balancesCancelToken = axios.CancelToken.source(); // recreate cancel token
                        vm.isLoadingBalances = true; // start loading
                        vm.balancesErrorMessage = ''; // reset error message
                        let response = await axios.get(vm.node + '/address/' + vm.selectedWallet.address + '/balance', {
                            cancelToken: vm.balancesCancelToken.token
                        });
                        let balance = response.data;
                        vm.safeBalance = balance.safeBalance;
                        vm.confirmedBalance = balance.confirmedBalance;
                        vm.pendingBalance = balance.pendingBalance;
                    }
                    catch(error) {
                        if(!axios.isCancel(error)) vm.balancesErrorMessage = utils.getErrorMessage(error);
                    }

                    // end loading no matter what
                    vm.isLoadingBalances = false;
                });
            },
            async loadTransactions() {
                try {
                    let response = await axios.get(this.node + '/address/' + this.selectedWallet.address + '/transactions');
                    this.transactions = response.data;
                    this.isLoading = false;
                }
                catch(error) {
                    console.log(error);
                }
            },
            renameSelectedWallet() {
                let newName = window.prompt('Enter new name', this.selectedWallet.name);
                if (!newName) {
                    return;
                }
                this.selectedWallet.name = newName;
                this.saveWallets();
            },
            removeSelectedWallet() {
                if(window.confirm(`Do you want to delete ${this.selectedWallet.name}?`)) {
                    let index = this.wallets.indexOf(this.selectedWallet);
                    this.wallets.splice(index, 1);
                    this.saveWallets();
                    this.selectWallet(this.wallets[this.wallets.length-1]);
                }
            }
        },
        created() {
            this.loadWallets();
            this.loadBalance();
        },
        mounted() {
            $('.dropdown-trigger').dropdown({
                constrainWidth: false
            });

        },
        updated() {
            $('.dropdown-trigger').dropdown({
                constrainWidth: false
            });
            M.updateTextFields();
        },
        watch: {
            selectedWallet: function() {
                if (this.selectedWallet) {
                    this.loadBalance();
                }
            }
        },
    }
</script>

