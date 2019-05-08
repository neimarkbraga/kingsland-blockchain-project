<template>
    <div>
        <footer class="page-footer no-padding">
            <!--<div class="container">
                <div class="row">
                    <div class="col l6 s12">
                        <h5 class="white-text">Footer Content</h5>
                        <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                    </div>
                    <div class="col l4 offset-l2 s12">
                        <h5 class="white-text">Links</h5>
                        <ul>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                            <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                        </ul>
                    </div>
                </div>
            </div>-->
            <div class="footer-copyright">
                <div class="container">
                    <div class="row m-0">
                        <div class="col s6 p-0">
                            © 2019 Project of Neimark and John Christian
                        </div>
                        <div class="col s6 p-0 right-align">
                            <b>Server: </b>
                            <a href="#ChangeServerModal"
                               @click="onModalOpen"
                               class="white-text modal-trigger">{{ nodeUrl }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>


        <div id="ChangeServerModal" class="modal">
            <form @submit.prevent="submitChangeServerForm">
                <fieldset :disabled="changeServerStatus.loading" style="border: none;">
                    <div class="modal-content">
                        <h4 class="m-0">Server / Backend</h4>
                        <div class="p-4"></div>
                        <div class="input-field mb-0">
                            <input v-model="changeServerForm.url"
                                   :class="{invalid: changeServerStatus.error}"
                                   type="text" />
                            <label>Enter New Server Url</label>
                            <span v-if="changeServerStatus.error" class="helper-text" :data-error="changeServerStatus.error"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-close waves-effect waves-green btn-flat">Close</button>
                        <span>&nbsp;&nbsp;</span>
                        <button type="submit" class="blue waves-effect waves-green btn">
                            <span v-if="changeServerStatus.loading">Please Wait</span>
                            <span v-else>Change Server</span>
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '../../library/utils';

    export default {
        data() {
            return {
                changeServerForm: {
                    url: ''
                },
                changeServerStatus: {
                    loading: false,
                    error: ''
                },
                nodeUrl: window.APP_CONFIG.blockchain_node_url
            };
        },
        methods: {
            onModalOpen() {
                this.changeServerStatus.error = '';
                this.changeServerForm.url = this.nodeUrl;
                setTimeout(window.M.updateTextFields);
            },
            async submitChangeServerForm() {
                let vm = this;
                let status = vm.changeServerStatus;
                try {
                    let url = vm.changeServerForm.url;
                    if(url === this.nodeUrl) return false;
                    status.loading = true;
                    status.error = '';
                    await axios.get(`${url}/info`);
                    window.APP_CONFIG.blockchain_node_url = url;
                    this.nodeUrl = window.APP_CONFIG.blockchain_node_url;
                    window.localStorage.setItem('blockchain_node_url', this.nodeUrl);
                    window.location.reload();
                }
                catch(error) {
                    status.error = utils.getErrorMessage(error);
                }
                status.loading = false;
            }
        },
        mounted() {
            $('.modal').modal();
        }
    }
</script>