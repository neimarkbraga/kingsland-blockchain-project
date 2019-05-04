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

    </div>
</template>
<script>
    import AppCaptcha from '../Plugins/captcha';

    export default {
        data() {
            return {
                captchaResponse: ''
            }
        },
        watch: {
            captchaResponse(value) {
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
            }
        },
        components: {
            AppCaptcha
        }
    }
</script>