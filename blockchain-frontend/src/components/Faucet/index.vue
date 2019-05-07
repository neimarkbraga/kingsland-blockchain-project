<template>
    <div class="container">
        <!-- spacer -->
        <div style="height: 20vh;"></div>

        <!-- captcha tester -->
        <div class="row">
            <div class="col s6 offset-s3">
                <div class="card">
                    <div class="card-content">
                        <div class="card-title">
                            <b>Microcoin Faucet:</b>
                        </div>
                        <div style="padding-top: 70px">
                            <div class="center-align">
                                <div>
                                    <app-captcha @response="captchaResponse = $event"
                                                ref="Captcha"></app-captcha>
                                </div>
                                <div v-if="captchaResponse">
                                    <button type="button"
                                            @click.prevent="resetCaptcha"
                                            class="btn">
                                        Reset Captcha
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row center-align">
                            <div class="row">
                                <div class="input-field col s10 offset-s1">
                                    <input id="recipient" type="text" class="validate" name=recipient v-model="recipient">
                                    <label for="recipient">Enter Recipient Address</label>
                                </div>
                            </div>
                            <div class="row">
                                <button class="btn blue center-align" v-on:click.prevent="sendBalance">
                                    Send <i>5000000</i> microCoins
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .card-title {
        padding-top: 10px;
    }
</style>


<script>
    import AppCaptcha from '../Plugins/captcha';
    const axios = require('axios');

    export default {
        data() {
            return {
                captchaResponse: '',
                recipient: undefined
            }
        },
        watch: {
            captchaResponse() {
                setTimeout(() => {
                    window.M.updateTextFields();
                    window.M.textareaAutoResize($('textarea'));
                });
            }
        },
        methods: {
            resetCaptcha() {
                let vm = this;
                vm.$refs.Captcha.reset();
                vm.captchaResponse = '';
            },
            sendBalance() {
                console.log('Send Balance');
                axios.post('http://localhost:5555/faucet/', {
                    address: this.recipient,
                    captcha: this.captchaResponse,
                })
                .then(function (response) {
                    console.log(response);
                    //Notify Successful Sending of Balance
                    //to corresponding address
                })
                .catch(function (error) {
                    console.log(error);
                    // Notify Erroneuos Tx Sending
                    // with corresponding Error Msg
                });
            }
        },
        components: {
            AppCaptcha
        }
    }
</script>