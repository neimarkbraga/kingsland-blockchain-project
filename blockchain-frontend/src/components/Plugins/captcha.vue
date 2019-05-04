<template>
    <div ref="Captcha"
         style="display: inline-block"></div>
</template>
<script>
    export default {
        data() {
            return {
                id: undefined
            };
        },
        computed: {
            grecaptcha() {
                return window.grecaptcha || grecaptcha || undefined;
            }
        },
        methods: {
            reset() {
                let vm = this;
                if(vm.grecaptcha) vm.grecaptcha.reset(vm.id);
            }
        },
        mounted() {
            let vm = this;
            window.APP_GOOGLE_RECAPTCHA.addTask(function (site_key) {
                vm.id = vm.grecaptcha.render(vm.$refs.Captcha, {
                    'sitekey' : site_key,
                    'callback' : function (response) {
                        vm.$emit('response', response);
                    },
                    'theme' : 'light'
                });
            });
        }
    }
</script>