<template>
    <div :style="viewStyle">
        <div class="w-100 m-5" style="max-width: 550px;">
            <div class="card m-auto">
                <div class="card-content">
                    <div class="card-title">
                        <b>Microcoin Faucet:</b>
                    </div>

                    <!-- spacer -->
                    <div style="padding-top: 25px"></div>

                    <!-- faucet form -->
                    <form @submit.prevent="sendBalance">
                        <fieldset :disabled="isSending" style="border: none; min-width: 0;">

                            <!-- recipient address input -->
                            <div class="input-field">
                                <input id="recipient"
                                       type="text"
                                       name=recipient
                                       v-model="recipient"
                                       required />
                                <label for="recipient">Enter Recipient Address</label>
                            </div>

                            <!-- captcha -->
                            <div class="center-align">
                                <app-captcha @response="captchaResponse = $event"
                                             ref="Captcha"></app-captcha>
                            </div>

                            <!-- spacer -->
                            <div class="p-3"></div>

                            <!-- error message -->
                            <div v-if="errorMessage" class="card red white-text">
                                <div class="p-2">
                                    <div>{{ errorMessage }}</div>
                                    <div class="right-align">
                                        <a href="#"
                                           @click.prevent="errorMessage = ''"
                                           class="white-text">Hide</a>
                                    </div>
                                </div>
                            </div>

                            <!-- success message -->
                            <div v-if="successData"
                                 class="mb-4"
                                 style="overflow: auto">
                                <div class="card green white-text m-0" style="display: inline-block">
                                    <div class="p-2">
                                        <div>
                                            <span style="white-space: nowrap;">{{ successData.value }} coins was sent to address <b>{{ successData.address }}</b>.</span>
                                            <br />
                                            <span style="white-space: nowrap;">transaction hash is <b>{{ successData.tx }}</b></span>
                                        </div>
                                        <div class="right-align">
                                            <a href="#"
                                               @click.prevent="successData = null"
                                               class="white-text">Hide</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- submit button -->
                            <div class="center-align">
                                <button type="submit" class="btn blue">
                                    <span>Send{{ isSending? 'ing' : '' }} </span>
                                    <i>5000000</i>
                                    <span> microCoins</span>
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AppCaptcha from '../Plugins/captcha';
    import utils from '../../library/utils';
    const axios = require('axios');

    export default {
        data() {
            return {
                captchaResponse: '',
                recipient: '',
                isSending: false,
                errorMessage: '',
                successData: null
            }
        },
        computed: {
            viewStyle() {
                let minHeight = 0;
                let mainElement = document.getElementsByTagName('main')[0];
                if(mainElement) minHeight = `${mainElement.clientHeight - 5}px`;
                return {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight
                };
            }
        },
        methods: {
            resetCaptcha() {
                let vm = this;
                vm.$refs.Captcha.reset();
                vm.captchaResponse = '';
            },
            sendBalance() {
                let vm = this;
                vm.isSending = true;
                vm.errorMessage = '';
                vm.successData = '';

                axios.post('http://localhost:5555/faucet/', {
                    address: this.recipient,
                    captcha: this.captchaResponse,
                })
                .then(function (response) {
                    vm.successData = response.data;
                })
                .catch(function (error) {
                    vm.errorMessage = utils.getErrorMessage(error);
                }).finally(function () {
                    vm.isSending = false;
                    vm.resetCaptcha();
                });
            }
        },
        components: {
            AppCaptcha
        }
    }
</script>