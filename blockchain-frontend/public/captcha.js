window.APP_GOOGLE_RECAPTCHA = {
    site_key: window.APP_CONFIG.google_recaptcha_site_key,
    tasks: [],
    addTask: function (task) {
        var grecaptcha = window.grecaptcha || grecaptcha;
        if(grecaptcha && grecaptcha.render) task(window.APP_GOOGLE_RECAPTCHA.site_key);
        else window.APP_GOOGLE_RECAPTCHA.tasks.push(task);
    }
};
window.APP_GOOGLE_RECAPTCHA_INITIALIZE = function() {
    for(var i = 0; i < window.APP_GOOGLE_RECAPTCHA.tasks.length; i++) {
        var task = window.APP_GOOGLE_RECAPTCHA.tasks[i];
        task(window.APP_GOOGLE_RECAPTCHA.site_key);
    }
};