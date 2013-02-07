define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    // var util = require('./util');

    // initialize the socket io client
    var socket = require('app/socket');

    socket.on('events', function(data) {
        console.log(data);
        Backbone.CQRS.hub.emit('events', data);
    });

    require('backbone.cqrs');

    Backbone.CQRS.hub.init();
    Backbone.sync = Backbone.CQRS.sync;

    Backbone.CQRS.hub.on('commands', function(data) {
        socket.emit('commands', data);
    });

    var Router = require('app/router');
    var router = new Router();
});