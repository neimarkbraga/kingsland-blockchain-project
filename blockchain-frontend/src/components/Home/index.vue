<template>
    <div class="container">

        <div class="center-align">
            <h3>Kingsland Blockchain Project</h3>
            <p>Bacon ipsum dolor amet pig flank corned beef, pastrami rump pancetta pork belly shank beef pork. Pork loin pork biltong, salami ball tip ham pork belly. Short ribs cow cupim pork chop burgdoggen rump. Sirloin short ribs ribeye, ham fatback bacon frankfurter biltong porchetta venison tail corned beef jerky. Kielbasa ribeye bacon frankfurter spare ribs turducken strip steak corned beef jowl buffalo meatball. Shank corned beef tenderloin, ham hock ball tip biltong hamburger boudin ground round chuck tongue capicola fatback filet mignon shoulder.</p>
        </div>


        <div class="row">
            <div class="col s4">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">Explorer</span>
                        <p>View blocks, View confirmed transactions, View pending transactions,
                            View accounts and balances, View peers, & View network difficulty</p>
                    </div>
                    <div class="card-action">
                        <router-link to="/explorer">Go to Explorer</router-link>
                    </div>
                </div>
            </div>
            <div class="col s4">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">Wallet</span>
                        <p>Generating & Storing Keys, Check Account
                            Balances, Signing & Sending Transactions</p>
                    </div>
                    <div class="card-action">
                        <router-link to="/wallet">Go to Wallet</router-link>
                    </div>
                </div>
            </div>
            <div class="col s4">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">Faucet</span>
                        <p>Sends coins to anyone who requests. One request per address per hour + captcha.</p>
                    </div>
                    <div class="card-action">
                        <router-link to="/faucet">Go to Faucet</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        },
        created() {

        },
        methods: {

        }
    }
</script>