<template>
    <div class="center-align">
        <h3>Wallet Page</h3>
        <p>{{ message }} {{ count }}</p>
        <button type="button"
                @click.prevent="increaseCount()"
                class="btn blue">
            Click here
        </button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                count: 1,
                message: 'Hello World!'
            }
        },
        methods: {
            increaseCount() {
                let vm = this;

                vm.count++;
            }
        },
        created() {
            let vm = this;
            vm.message = 'Changed message';

            console.log('component was created');
        },
        mounted() {
            console.log('page was mounted to document');
        }
    }
</script>