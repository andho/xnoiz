define(['backbone', 'socket.io'], function(Backbone, io) {
    var socket = io.connect('http://localhost:8000');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
	});

    Backbone.socket = socket;

    return socket;
});