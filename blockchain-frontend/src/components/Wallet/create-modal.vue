<template>
    <div :id="id" ref="Modal" class="modal">

        <div class="modal-content">
            <div class="row">
                <b>Enter New Wallet Name</b>
                <div class="input-field col s12">
                    <input placeholder="Enter Name Here"
                        type="text"
                        class="validate"
                        v-model="form.name"
                        @input="status.error = ''"
                        :class="{invalid: status.error}"
                        required />
                    <div v-if="status.error" class="helper-text" :data-error="status.error">
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button class="modal-close waves-effect waves-green btn-flat">Cancel</button>
            <button @click.prevent="submitForm" class="waves-effect waves-green btn-flat">Create</button>
        </div>

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
                form: {name: ''},
                status: {error: ''}
            };
        },
        methods: {
            submitForm() {
                let form = this.form;
                let status = this.status;

                try {
                    status.error = '';
                    for(let i = 0; i < this.wallets.length; i++) {
                        let wallet = this.wallets[i];
                        if(form.name === wallet.name) throw new Error('Wallet name already taken');
                    }

                    const privateKey = utils.generatePrivateKey();
                    const publicKey  = utils.privateKeyToPublicKey(privateKey);
                    const address    = utils.publicKeyToAddress(publicKey);

                    this.$emit('newWallet', {
                        name: form.name,
                        privateKey,
                        publicKey,
                        address
                    });

                    $(this.$refs.Modal).modal('close');
                    form.name = '';
                }
                catch (error) {
                    status.error = error.message;
                }
            }
        },
        mounted() {
            $('.dropdown-trigger').dropdown();
            $('.modal').modal();
        }
    }
</script>
