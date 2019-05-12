<template>
    <div :id="id" class="modal">
        <div class="modal-content">
            <table class="highlight">
                <tbody>
                    <tr>
                        <td><b>Private Key</b></td>
                        <td><i>{{ privateKey }}</i></td>
                    </tr>
                    <tr>
                        <td><b>Public Key</b></td>
                        <td><i>{{ publicKey }}</i></td>
                    </tr>
                    <tr>
                        <td><b>Address</b></td>
                        <td><i>{{ address }}</i></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>

</style>


<script>
    export default {
        props: {
            id: {
                type: String,
                default: null
            },
            privateKey: {
                type: String,
                default: null
            },
            publicKey: {
                type: String,
                default: null
            },
            address: {
                type: String,
                default: null
            }
        },
        mounted() {

        }
    }
</script>

