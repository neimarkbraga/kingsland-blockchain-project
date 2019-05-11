<template>
    <div class="row">
        <div class="s12">
            <ul class="tabs">
                <li class="tab col s3"><a href="#createWalletTab" class="active">Create Wallet</a></li>
                <li class="tab col s3"><a href="#loadWalletTab">Load Wallet</a></li>
                <li class="tab col s3"><a href="#sendTransactionTab">Send Transaction</a></li>
                <li class="tab col s3"><a href="#checkBalanceTab">Check Balance</a></li>
            </ul>
        </div>

        <CreateWalletTab></CreateWalletTab>

        <LoadWalletTab @loadWallet = loadWallet></LoadWalletTab>

        <SendTransactionTab :loadedPrivKey=loadedPrivKey
                            :loadedPubKey=loadedPubKey
                            :loadedAddress=loadedAddress>
        </SendTransactionTab>

        <CheckBalanceTab :loadedAddress=loadedAddress>
        </CheckBalanceTab>

    </div>
</template>

<style scoped>
    /* label focus color */
   .input-field input[type=text]:focus + label {
     color: #2196f3;
   }

   /* label underline focus color */
   .input-field input[type=text]:focus {
     border-bottom: 1px solid #2196f3;
     box-shadow: 0 1px 0 0 #2196f3;
   }

    .tabs .tab a{
        color:#000;
    } /*Black color to the text*/

    .tabs .tab a:hover {
        background-color:#e3f2fd ;
        color:#000;
    } /*Text color on hover*/

    .tabs .tab a.active {
        background-color:#64b5f6 ;
        color:#fff;
    } /*Background and text color when a tab is active*/

    .tabs .indicator {
        background-color:#64b5f6 ;
    } /*Color of underline*/

    #sendTransactionTab {
        padding-top: 7vh;
    }

</style>


<script>
    import CreateWalletTab from './create';
    import LoadWalletTab from './load';
    import CheckBalanceTab from './balance';
    import SendTransactionTab from './send';

    export default {
        name: 'WalletPage',
        components: {
            CreateWalletTab,
            LoadWalletTab,
            CheckBalanceTab,
            SendTransactionTab
        },
        data() {
            return {
                loadedPrivKey: null,
                loadedPubKey: null,
                loadedAddress: null || window.localStorage.getItem('address')
            }
        },
        methods: {
            loadWallet() {
               this.loadedPrivKey = window.localStorage.getItem('privKey');
               this.loadedPubKey = window.localStorage.getItem('pubKey');
               this.loadedAddress = window.localStorage.getItem('address');
            }
        },
        mounted() {
            $('.tabs').tabs();
        }
    }
</script>