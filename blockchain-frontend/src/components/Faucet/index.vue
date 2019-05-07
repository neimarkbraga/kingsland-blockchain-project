<template>
    <div class="container">
        <!-- spacer -->
        <div style="height: 50px;"></div>

        <!-- captcha tester -->
        <div class="card">
            <div class="card-content">
                <div class="card-title">Google ReCaptcha Tester</div>
                <div style="padding-top: 10px">
                    <div class="input-field">
                        <label>Response</label>
                        <textarea class="materialize-textarea"
                                  v-model="captchaResponse"
                                  placeholder="" readonly></textarea>
                    </div>
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
            </div>
        </div>

        <div id="loadWalletTab" class="row center-align">
            <div class="row">
                <div class="input-field col offset-s4 s4">
                    <input id="recipient" type="text" class="validate" name=recipient v-model="recipient">
                    <label for="recipient">Enter Recipient</label>
                </div>
            </div>
            <div class="row">
                <button class="btn blue center-align" v-on:click.prevent="sendBalance">Send Balance</button>
            </div>
        </div>

    </div>
</template>
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
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        components: {
            AppCaptcha
        }
    }
</script>