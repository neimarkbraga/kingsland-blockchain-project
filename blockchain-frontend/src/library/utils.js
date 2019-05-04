export default {
    test() {
        alert('Hello World!');
    },
    getErrorMessage(error) {
        let response = error.response || {};
        let data = response.data || {};
        return data.errorMsg || data.message || error.message || 'An unknown error occurred.';
    }
};