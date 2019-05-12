<template>
    <div :id="id" ref="Modal" class="modal">

        <div class="modal-content">
            <div class="row">
                <b>Load Existing Wallet</b>
                <div class="input-field col s12">
                    <input  placeholder="Enter Wallet Name Here"
                            type="text"
                            v-model="form.name"
                            class="validate"
                            required />
                    </div>
                <div class="input-field col s12">
                    <input  placeholder="Enter Private Key Here"
                            type="text"
                            v-model="form.privateKey"
                            class="validate"
                            required />
                </div>
                <div v-if="status.error" class="center">
                    <p class="red-text">
                        {{ status.error }}
                        <a href="#"
                            @click.prevent="status.error = ''"
                            class="white-text right">Hide</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-close waves-effect waves-blue btn-flat">Cancel</button>
            <button @click.prevent="submitForm" class="waves-effect waves-blue btn-flat">Load</button>
        </div>
        <
    </div>
</template>

<style scoped>

    .modal-content {
        padding-bottom: 0px;
    }

    .modal-content .row {
        margin-bottom: 0px;
    }

</style>

<script>
    import utils from '../../library/utils';

    export default {
        props: {
            id: {
                type: String,
                default: undefined
            },
            wallets: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                form: {
                    name: '',
                    privateKey: ''
                },
                status: {
                    error: ''
                }
            };
        },
        methods: {
            submitForm() {
                let form = this.form;
                let status = this.status;
                try {
                    status.error = '';
                    if(!utils.isValidPrivateKey(form.privateKey)) throw new Error('Invalid private key');
                    for(let i = 0; i < this.wallets.length; i++) {
                        let wallet = this.wallets[i];
                        if(form.name === wallet.name) throw new Error('Wallet name already taken');
                        if(form.privateKey === wallet.privateKey) throw new Error('Private key already loaded');
                    }
                    let publicKey = utils.privateKeyToPublicKey(form.privateKey);
                    let address = utils.publicKeyToAddress(publicKey);
                    this.$emit('loadWallet', {
                        name: form.name,
                        privateKey: form.privateKey,
                        publicKey,
                        address
                    });
                    $(this.$refs.Modal).modal('close');
                    form.name = '';
                    form.privateKey = '';
                }
                catch (error) {
                    status.error = error.message;
                }
            }
        },
        mounted() {
            $('.modal').modal();
        }
    }
</script>
