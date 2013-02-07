var connect = require('connect')
    ,app = connect()
	,server = require('http').createServer(app)
	,io = require('socket.io').listen(server);

var port = 8000;
server.listen(port);
console.log("Server listening on localhost:8000");

app.use(connect.static('www'));

var chats = {};
var id = 0;

io.sockets.on('connection', function (socket) {
	var commandBus = new CommandBus(socket, handlers);

	socket.emit('news', { hello: 'world' });

	socket.on('commands', function (data, callback) {
		console.log(data);
		commandBus.handle(data);
	});

});

var handlers = {
	createChat: function(command) {
		this.socket.emit('events', {name:'chatCreated', payload: command});
	},
	sendMessage: function(command) {
		this.socket.emit('events', {name:'messageSent', payload: command});
	},
	changePerson: function(command) {
		this.socket.emit('events', {name: 'personChanged', payload: command});
	}
};

function CommandBus(socket, handlers) {
	this.socket = socket;
	this.handlers = handlers;
}

CommandBus.prototype = {
	handle: function(command) {
		if (!command.name || !this.handlers[command.name]) {
			console.log("Command does not exist. :" + JSON.stringify(command));
			return;
			throw new Error("Command does not exist. :" + JSON.stringify(command));
		}

		this.handlers[command.name].call(this, command.payload);
	}
};