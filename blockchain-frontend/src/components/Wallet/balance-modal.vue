<template>
    <div :id="id" class="modal">
        <div class="modal-content">
            <table class="highlight">

                <!-- Loaded -->
                <tbody>
                    <tr>
                        <td><b>Confirmed Balance</b></td>
                        <td>
                            {{ confirmed }}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Pending Balance</b></td>
                        <td>
                            {{ pending }}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Safe Balance</b></td>
                        <td>
                            {{ safe }}
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
</template>

<style>

</style>

<script>
    export default {
        props: {
            id: {
                type: String,
                default: null,
            },
            confirmed: {
                type: Number,
                default: 0,
            },
            pending: {
                type: Number,
                default: 0,
            },
            safe: {
                type: Number,
                default: 0,
            }
        }
    }

</script>
