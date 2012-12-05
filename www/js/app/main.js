define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    // var util = require('./util');

    // initialize the socket io client
    var socket = require('app/socket');
    require('backbone.iobind');
    require('backbone.iosync');

    var Router = require('app/router');
    var router = new Router();
});